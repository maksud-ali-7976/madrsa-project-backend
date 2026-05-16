import { isAdminAuthenticated } from "src/guard/admin.guard";
import Class from "src/models/Class";
import { createElysia } from "src/utils/createElysia";
import schema, { name } from "./class.schema";
import { R } from "src/utils/response-helpers";
import { customError } from "src/utils/AppErr";
import { ModuleId, Summary } from "src/config/modules";
import Student from "src/models/Student";

export default createElysia({ prefix: "/class" }).guard(
  {
    detail: {
      tags: ["Class"],
      summary: Summary([ModuleId.CLASSES]),
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
          let list: any[] = [];

          const [classes, total] = await Promise.all([
            Class.find()
              .skip(page * size)
              .populate("teacher")
              .limit(size)
              .lean(),

            Class.countDocuments(),
          ]);
          for (const item of classes) {
            const total_students = await Student.countDocuments({
              current_class: item._id,
            });

            list.push({
              ...item,
              total_students,
            });
          }
          const pages = Math.ceil(total / size);
          console.log("List", list)
          return R(`${name} List`, list, true, {
            pages,
            total,
            page,
            size,
          });
        },
        schema.list,
      )
      .post(
        "/",
        async ({ body }) => {
          const entry = await Class.create(body);

          return R(`${name} created successfully`, entry);
        },
        schema.create,
      ),
);
