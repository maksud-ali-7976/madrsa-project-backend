import { createElysia } from "src/utils/createElysia";
import Student from "src/models/Student";
import { isAdminAuthenticated } from "src/guard/admin.guard";
import { R } from "src/utils/response-helpers";
import { customError } from "src/utils/AppErr";
import studentsSchema from "./students.schema";
import { ModuleId, Summary } from "src/config/modules";

export default createElysia({ prefix: "/students" }).guard(
  {
    detail: {
      tags: ["Students"],
      summary: Summary([ModuleId.STUDENTS]),
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
          // console.log("PAge", page, "size", size);

          const [list, total] = await Promise.all([
            Student.find()
              .skip(page * size)
              .populate("class")
              .limit(size),
            Student.countDocuments(),
          ]);

          const pages = Math.ceil(total / size);
          return R("Studnet List ", list, true, { pages, total, page, size });
        },
        studentsSchema.list,
      )
      .post(
        "/",
        async ({ body }) => {
          const student = await Student.create(body);
          return R("Student Added Successflly", student);
        },
        studentsSchema.create,
      )
      .put(
        "/",
        async ({ body, query }) => {
          const entry = await Student.findByIdAndUpdate(query.id, body);
          return R("Student Updates Successfully");
        },
        studentsSchema.update,
      )
      .delete(
        "/",
        async ({ query }) => {
          const student = await Student.findByIdAndDelete(query.id);
          return R("Student Deleted Successfully", student);
        },
        studentsSchema.delete,
      ),
);
