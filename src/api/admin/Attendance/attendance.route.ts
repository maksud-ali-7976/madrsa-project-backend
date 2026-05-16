import { createElysia } from "src/utils/createElysia";
import Attendance from "src/models/Attendance";
import { isAdminAuthenticated } from "src/guard/admin.guard";
import { R } from "src/utils/response-helpers";
import attendanceSchema from "./attendance.schema";
import { ModuleId, Summary } from "src/config/modules";

export default createElysia({ prefix: "/attendance" }).guard(
  {
    detail: {
      tags: ["Attendance"],
      summary: Summary([ModuleId.ATTENDANCE]),
    },
    beforeHandle: isAdminAuthenticated,
  },
  (app) =>
    app
      .get(
        "/",
        async ({ query }) => {
          const page = parseInt(query.page || "0");
          const size = parseInt(query.size || "10");
          const filter: any = {};

          if (query.classId) filter.class = query.classId;
          if (query.date) {
            const start = new Date(query.date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(query.date);
            end.setHours(23, 59, 59, 999);
            filter.date = { $gte: start, $lte: end };
          }

          const [list, total] = await Promise.all([
            Attendance.find(filter)
              .populate("student", "name guardian_name")
              .populate("class", "name")
              .skip(page * size)
              .limit(size)
              .sort({ date: -1 }),
            Attendance.countDocuments(filter),
          ]);

          const pages = Math.ceil(total / size);
          return R("Attendance List", list, true, { pages, total, page, size });
        },
        attendanceSchema.list
      )
      .post(
        "/bulk",
        async ({ body }) => {
          const { classId, date, records } = body;
          const attendanceDate = new Date(date);
          attendanceDate.setHours(0, 0, 0, 0);

          const operations = records.map((record) => ({
            updateOne: {
              filter: {
                student: record.studentId,
                class: classId,
                date: {
                  $gte: new Date(attendanceDate).setHours(0, 0, 0, 0),
                  $lte: new Date(attendanceDate).setHours(23, 59, 59, 999),
                },
              },
              update: {
                $set: {
                  status: record.status,
                  remarks: record.remarks,
                  date: attendanceDate, // ensure it's exact
                },
              },
              upsert: true,
            },
          }));

          await Attendance.bulkWrite(operations);
          return R("Attendance records updated successfully");
        },
        attendanceSchema.takeBulk
      )
      .put(
        "/",
        async ({ body, query }) => {
          const entry = await Attendance.findByIdAndUpdate(query.id, body, { new: true });
          return R("Attendance Updated Successfully", entry);
        },
        attendanceSchema.update
      )
      .delete(
        "/",
        async ({ query }) => {
          const entry = await Attendance.findByIdAndDelete(query.id);
          return R("Attendance Record Deleted Successfully", entry);
        },
        {
          query: attendanceSchema.update.query // Reuse the ID query
        }
      )
);
