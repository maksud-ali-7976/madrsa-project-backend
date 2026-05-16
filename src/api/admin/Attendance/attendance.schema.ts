import { t } from "elysia";

export const AttendanceSchema = t.Object({
  _id: t.String(),
  student: t.Any(), // Can be string ID or populated student object
  class: t.Any(),   // Can be string ID or populated class object
  date: t.String(),
  status: t.String(),
  remarks: t.Optional(t.String()),
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
      page: t.Optional(t.String()),
      size: t.Optional(t.String()),
      classId: t.Optional(t.String()),
      date: t.Optional(t.String()),
    }),
    response: {
      200: t.Object({
        status: t.Boolean(),
        message: t.String(),
        data: t.Array(AttendanceSchema),
        meta: MetaPagination,
      }),
    },
    detail: {
      operationId: "AttendanceList",
    },
  },
  takeBulk: {
    body: t.Object({
      classId: t.String(),
      date: t.String(),
      records: t.Array(
        t.Object({
          studentId: t.String(),
          status: t.String(),
          remarks: t.Optional(t.String()),
        })
      ),
    }),
    response: {
      200: t.Object({
        status: t.Boolean(),
        message: t.String(),
      }),
    },
    detail: {
      operationId: "AttendanceTakeBulk",
    },
  },
  update: {
    query: t.Object({
      id: t.String(),
    }),
    body: t.Object({
      status: t.Optional(t.String()),
      remarks: t.Optional(t.String()),
    }),
    response: {
      200: t.Object({
        status: t.Boolean(),
        message: t.String(),
        data: AttendanceSchema,
      }),
    },
    detail: {
      operationId: "AttendanceUpdate",
    },
  },
};
