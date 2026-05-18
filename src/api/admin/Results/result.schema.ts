import { t } from "elysia";
import { StoreClassSchema } from "../class/class.schema";
import { StoreStudentSchema } from "../Students/students.schema";

export const ResultStoreSchema = t.Object({
  _id: t.Optional(t.String()),
  student: StoreStudentSchema,
  session: t.String(),
  class: StoreClassSchema,
  marks: t.Number(),
  grade: t.String(),
  remarks: t.String(),
  issue_date: t.String(),
  total: t.Number(),
  percentage: t.Number()
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
          data: t.Array(ResultStoreSchema),
          meta: MetaPagination,
        },
        {
          description: "Student Result Response",
        },
      ),
    },
    detail: {
      operationId: "StudentResult",
    },
  },
  add: {
    body: t.Object({
      student: t.String(),
      session: t.String(),
      class: t.String(),
      marks: t.Number(),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: ResultStoreSchema,
        },
        {
          description: "Student Result Add Response",
        },
      ),
    },
    detail: {
      operationId: "ResultAdd",
    },
  },
  update: {
    query: t.Object({
      id: t.String(),
    }),
    body: t.Object({
      student: t.Optional(t.String()),
      session: t.Optional(t.String()),
      class: t.Optional(t.String()),
      marks: t.Optional(t.Number()),
      grade: t.Optional(t.String()),
      remarks: t.Optional(t.String()),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: ResultStoreSchema,
        },
        {
          description: "Student Result Update Response",
        },
      ),
    },
    detail: {
      operationId: "ResultUpdate",
    },
  },
  detail: {
    query: t.Object({
      studentId: t.String()
    }),
    response: {
      200: t.Object({
        status: t.Boolean(),
        message: t.String(),
        data: ResultStoreSchema
      }, {
        description: "Student Detail Response"
      })
    },
    detailId: "ResultDetail"
  }
};
