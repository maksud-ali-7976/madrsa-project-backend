process.env.TZ = "Asia/Kolkata";

import { Elysia, HTTPMethod, Context, t } from "elysia";
import { html } from "@elysiajs/html";
// import { helmet } from "elysia-helmet";
// import { auth } from "@auth/auth.controller";
// import { jwtAccessSetup, jwtRefreshSetup } from "@auth/guards/setup.jwt";
import cookie from "@elysiajs/cookie";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { connectDB } from "./db/mongo";
import AppErr from "./utils/AppErr";
import { R } from "./utils/response-helpers";
import { staticPlugin } from "@elysiajs/static";
import { bearer } from "@elysiajs/bearer";
import env from "./config/env";
import moment from "moment";
import consola from "consola";
import { createElysia, Logger } from "./utils/createElysia";
import adminRoutes from "./api/admin/admin.index";
import path from "path";

declare module "elysia" {}

const api = createElysia({ normalize: false });

api.onRequest((ctx: any) => {
	ctx.logger = new Logger();
	ctx.logger.add(`Request -`);
	ctx.logger.add(`${ctx.request.method} - ${(ctx as any).path}`);
});

api.onAfterHandle(({ logger, response }) => {
	logger.add("Response - ");
	logger.add(JSON.stringify(response, null, 2).substring(0, 150));
	logger.add("Request End");
	// logger.print();
});

api.use(
	cors({
		methods: "*",
		origin: ({ headers }) => {
			return true;
		},
	}),
);
api.onError(({ error, code, set, ...rest }) => {
	console.log("🚀 ~ error:", error);
	if (error instanceof AppErr) {
		set.status = "OK";
		return R(error.message, null, false);
	}

	const errorType = "type" in error ? error.type : "internal";

	if (errorType == "internal") {
		consola.error(`${errorType} ERROR: ${JSON.stringify(error, null, 2)}`);
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

	return { status: false, message: error.message, data: null };
});

api.onTransform(({ body = {}, params = {}, query = {}, logger }) => {
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

api.use(bearer());

api.use(html());

api.use(
	staticPlugin({
		assets: path.join(process.cwd(), "public"),
		prefix: "/public",
	}),
);

// Setup

api.onAfterHandle((ctx) => {
	const isJsonPath = ctx.path.includes("/json");
	const handleJsonSchema = (obj: any) => {
		for (let key in obj) {
			let value = obj[key];
			if (typeof value == "object" && !Array.isArray(value)) {
				if (`${key}`.startsWith("/admin")) {
					continue;
				}
				// if (value.description == "upload") {
				// 	// value.consumes = ["multipart/form-data"];
				// 	delete obj[key];
				// }
				// if (value?.description == "file") {
				// 	for (let jkey in value) {
				// 		if (jkey != "type") {
				// 			delete value[jkey];
				// 		}
				// 	}
				// 	value.type = "file";
				// 	// value.format = "binary";
				// }
				handleJsonSchema(obj[key]);
			}
		}
		return obj;
	};

	if (isJsonPath) {
		handleJsonSchema(ctx.response);
	}
});


api.use(
	swagger({
		path: "/swagger-admin",
		provider: "scalar",
		exclude: new RegExp(/^(?!\/admin).*/),
		swaggerOptions: {
			persistAuthorization: true,
		},

		documentation: {
			info: {
				title: "Madrsa Gareeb Nawaz API Documentation",
				version: "0.0.1",
			},
		},
	}),
);

// Routes
api.use(adminRoutes);

connectDB("APP").then((d) => {
	api.listen(env.port || 8080);
	consola.success(
		`🦊 Elysia is running at ${api.server?.hostname}:${
			env.port || 8080
		} ${moment().format("h:mm:ss a, MMMM Do YYYY")}`,
	);
});
