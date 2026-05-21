import { Elysia } from "elysia";

import { html } from "@elysiajs/html";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import AppErr from "./utils/AppErr";

import { bearer } from "@elysiajs/bearer";
import env from "./config/env";
import moment from "moment";

import { createElysia, Logger } from "./utils/createElysia";
import { logger } from "@typegoose/typegoose/lib/logSettings";
import { R } from "./utils/response-helpers";
import { connectDB } from "./db/mongo";

import { ModuleId } from "./config/modules";
import adminRoute from "./api/admin/admin.index";
declare module "elysia" {}

const app = createElysia({ normalize: false });

app.onRequest((ctx: any) => {
  ctx.logger = new Logger();
  ctx.logger.add(`Request`);
  ctx.logger.add(`${ctx.request.method} - ${(ctx as any).path}`);
});

app.onAfterHandle(({ logger, response }) => {
  logger.add("Response - ");
  logger.add(JSON.stringify(response, null, 2).substring(0, 150));
  logger.add("Request End");
  logger.print();
});

app.use(
  cors({
    methods: "*",
    origin: ({ headers }) => {
      return true;
    },
  }),
);

app.onError(({ error, code, set, ...rest }: any) => {
  if (error instanceof AppErr) {
    set.status = "OK";
    return R(error.message, null, false);
  }

  const errorType = "type" in error ? error.type : "internal";

  if (errorType == "internal") {
    console.log(`${errorType} ERROR: ${JSON.stringify(error, null, 2)}`);
    set.status = "OK";
    return { status: false, message: error.message, data: null };
  } else if (errorType == "response") {
    set.status = "OK";
    const result = JSON.parse(error?.message);
    return result?.found;
  } else if (["body", "query"].includes(errorType)) {
    set.status = "OK";
    const result = JSON.parse(error?.message);
    const message = result.errors
      .map(
        (err: any) =>
          `${err.path.replace("/", "").replace("_", " ").toUpperCase()} ${
            err.message
          }`,
      )
      .join("\n");

    return { status: false, message: message, data: null };
  }
  console.log(`${errorType} ERRRO ❌: ${JSON.stringify(error, null, 2)}`);

  return { status: false, message: error.message, data: null };
});

app.onTransform(({ body = {}, params = {}, query = {}, logger }) => {
  const removeWasteFromObject = (obj: Record<string, any> | any) => {
    for (let key in obj) {
      let value = obj[key];
      if (typeof value == "object" && !Array.isArray(value)) {
        // removeWasteFromObject(obj);
        continue;
      }

      if (value === "") {
        delete obj[key];
      }
    }
  };
  removeWasteFromObject(body);
  removeWasteFromObject(params);
  removeWasteFromObject(query);

  if (Object.keys(params).length) {
    logger.add("Params - ");
    logger.add(JSON.stringify(params, null, 2));
  }

  if (Object.keys(query).length) {
    logger.add("Query - ");
    logger.add(JSON.stringify(query, null, 2));
  }

  if (Object.keys(body as any).length) {
    logger.add("Body -");
    logger.add(JSON.stringify(body, null, 2));
  }
});

app.use(bearer());

app.use(html());

app.onAfterHandle((ctx) => {
  const isJsonPath = ctx.path.includes("/json");
  const normalizeContentType = (type: string) => {
    switch (type) {
      case "json":
      case "application/json":
        return "application/json";
      case "text":
      case "text/plain":
        return "text/plain";
      case "formdata":
      case "multipart/form-data":
        return "multipart/form-data";
      case "urlencoded":
      case "application/x-www-form-urlencoded":
        return "application/x-www-form-urlencoded";
      case "arrayBuffer":
      case "application/octet-stream":
        return "application/octet-stream";
      default:
        return type;
    }
  };
  const toOpenApiPath = (path: string) =>
    path
      .split("/")
      .map((segment) => {
        if (segment.startsWith(":")) {
          let name = segment.slice(1);
          if (name.endsWith("?")) name = name.slice(0, -1);
          return `{${name}}`;
        }
        return segment;
      })
      .join("/");
  const buildRequestBodyContentTypeOverrides = () => {
    const overrides = new Map<string, string[]>();
    for (const route of app.routes) {
      const rawType =
        (route.hooks as any)?.type ??
        (route.hooks as any)?.contentType ??
        (route.hooks as any)?.mediaType;
      if (!rawType) continue;

      const types = Array.isArray(rawType) ? rawType : [rawType];
      const normalized = types.map(normalizeContentType).filter(Boolean);
      if (!normalized.length) continue;

      const path = toOpenApiPath(route.path);
      overrides.set(`${route.method.toLowerCase()} ${path}`, normalized);
    }
    return overrides;
  };
  const pruneRequestBodyContentTypes = (doc: any) => {
    if (!doc?.paths) return;
    const overrides = buildRequestBodyContentTypeOverrides();
    for (const [path, methods] of Object.entries(doc.paths)) {
      for (const [method, operation] of Object.entries(methods as any)) {
        const requestBody = (operation as any)?.requestBody;
        const content = requestBody?.content;
        if (!content) continue;

        const allowed = overrides.get(`${method} ${path}`);
        if (!allowed?.length) continue;

        const filtered: Record<string, any> = {};
        for (const type of allowed) {
          if (content[type]) filtered[type] = content[type];
        }
        if (Object.keys(filtered).length > 0) {
          requestBody.content = filtered;
        }
      }
    }
  };
  const handleJsonSchema = (obj: any) => {
    for (let key in obj) {
      let value = obj[key];
      if (typeof value == "object" && !Array.isArray(value)) {
        if (`${key}`.startsWith("/admin")) {
          continue;
        }
        if (value.description == "upload") {
          // value.consumes = ["multipart/form-data"];
          delete obj[key];
        }
        if (value?.description == "file") {
          for (let jkey in value) {
            if (jkey != "type") {
              delete value[jkey];
            }
          }
          value.type = "file";
          // value.format = "binary";
        }
        handleJsonSchema(obj[key]);
      }
    }
    return obj;
  };

  if (isJsonPath) {
    handleJsonSchema(ctx.response);
    pruneRequestBodyContentTypes(ctx.response);
  }
});

app.use(
  swagger({
    path: "/swagger-admin",
    provider: "scalar",
    exclude: new RegExp(/^(?!\/admin).*/),
    swaggerOptions: {
      persistAuthorization: true,
    },

    documentation: {
      info: {
        title: "Ai Story Book Admin API Documentation",
        version: "0.0.1",
      },
    },
  }),
);

export const routeMap: Map<any, { modules: ModuleId[] }> = new Map();
for (let route of app.routes) {
  if (route.hooks.detail?.summary) {
    routeMap.set(route.path, JSON.parse(route.hooks.detail?.summary));
  }
}

app.use(adminRoute);
app.get("/health", () => {
  return {
    status: true,
  };
});
connectDB("APP").then((d) => {
  app.listen(env.port || 8080);

  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${
      env.port || 8080
    } ${moment().format("h:mm:ss a, MMMM Do YYYY")}`,
  );

  setInterval(async () => {
    try {
      await fetch("https://madrsa-project-backend.onrender.com/health");

      console.log("✅ Self ping success");
    } catch (error) {
      console.log("❌ Self ping failed");
    }
  }, 1000 * 60 * 5);
});
