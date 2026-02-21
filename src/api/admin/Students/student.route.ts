import { createElysia } from "src/utils/createElysia";
import Student from "src/models/Student";
import { isAdminAuthenticated } from "src/guard/admin.guard";
import { R } from "src/utils/response-helpers";
import { customError } from "src/utils/AppErr";
import studentsSchema from "./students.schema";

export default createElysia({ prefix: "/students" }).guard(
  {
    detail: {
      tags: ["Students"],
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

          const [list, total] = await Promise.all([
            Student.find()
              .size(page * size)
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
      ),
);
