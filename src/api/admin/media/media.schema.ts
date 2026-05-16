import { t } from "elysia";

export const name = "Media";

export const MediaStoreSchema = t.Object({
  _id: t.String(),
  file_name: t.String(),
  file_size: t.String(),
  file_url: t.String(),
});

export default {
  list: {
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Array(MediaStoreSchema),
        },
        { description: `${name} list response` },
      ),
    },
    detail: {
      operationId: `${name}List`,
    },
  },
  create: {
    type: "multipart/form-data" as any,
    body: t.Object({
      filename: t.Optional(t.String()),
      file: t.File(),
      file_size: t.Optional(t.String()),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: MediaStoreSchema,
        },
        { description: `${name} create response` },
      ),
    },
    detail: {
      operationId: `${name}Create`,
    },
  },
};
