import { t } from "elysia";

export const name = "Class";

export const StoreClassSchema = t.Object({
  _id: t.String(),
  name: t.String(),
  description: t.Optional(t.String()),
  teacher: t.Object({
    _id: t.String(),
    name: t.String(),
    phone: t.String(),
  }),
  active: t.Boolean(),
  total_students: t.Number(),
});

export const MetaPaginationSchema = t.Object({
  total: t.Number(),
  pages: t.Number(),
  page: t.Number(),
  size: t.Number(),
});

export default {
  list: {
    query: t.Object({
      page: t.String(),
      size: t.String(),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Array(StoreClassSchema),
          meta: MetaPaginationSchema
        },
        {
          description: `${name} List Response`,
        },
      ),
    },
    detail: {
      operationId: `${name}List`,
    },
  },
  create: {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
      teacher: t.String(),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: StoreClassSchema,
        },
        {
          description: `${name} Create Response`,
        },
      ),
    },
    detail: {
      operationId: `${name}Create`,
    },
  },
};
