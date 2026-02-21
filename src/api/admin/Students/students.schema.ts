import { t } from "elysia";

export const StoreStudentSchema = t.Object({
  _id: t.String(),
  name: t.String(),
  guardian_name: t.String(),
  dob: t.String(),
  class: t.String(),
  address: t.String(),
  contact: t.String(),
  adhar: t.String(),
});

export const MetaPagination = t.Object({
  pages: t.Number(),
  total: t.Number(),
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
          data: t.Array(StoreStudentSchema),
          meat: MetaPagination,
        },
        {
          description: "Students List Response",
        },
      ),
    },
    detail: {
      operationId: "StudentList",
    },
  },
  create: {
    body: t.Object({
      name: t.String(),
      guardian_name: t.String(),
      dob: t.String(),
      class: t.String(),
      address: t.String(),
      contact: t.String(),
      adhar: t.Optional(t.String()),
    }),

    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: StoreStudentSchema,
        },
        {
          description: "Student Add Response",
        },
      ),
    },
    detail: {
      operationId: "StudentAdd",
    },
  },
  update: {
    query: t.Object({
      id: t.String(),
    }),
    body: t.Object({
      name: t.Optional(t.String()),
      guardian_name: t.Optional(t.String()),
      dob: t.Optional(t.String()),
      class: t.Optional(t.String()),
      address: t.Optional(t.String()),
      contact: t.Optional(t.String()),
      adhar: t.Optional(t.String()),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: StoreStudentSchema,
        },
        {
          description: "Student Update Response",
        },
      ),
    },
    detail: {
      operationId: "StudentUpdates",
    },
  },
};
