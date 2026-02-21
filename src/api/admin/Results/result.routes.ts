import Result from "src/models/Results";
import { isAdminAuthenticated } from "src/guard/admin.guard";
import { R } from "src/utils/response-helpers";
import { customError } from "src/utils/AppErr";
import { createElysia } from "src/utils/createElysia";
import resultSchema from "./result.schema";

export default createElysia({ prefix: "/results" }).guard(
  {
    detail: {
      tags: ["Results"],
    },
    beforeHandle: isAdminAuthenticated,
  },
  (app) =>
    app
      .get(
        "/",
        async ({ query }) => {
          const page = parseInt(query.page || "");
          const size = parseInt(query.size || "");

          const [list, total] = await Promise.all([
            Result.find({})
              .skip(page * size)
              .limit(size),
            Result.countDocuments(),
          ]);

          const pages = Math.ceil(total / size);
          return R("Result List Data", list, true, {
            pages,
            total,
            page,
            size,
          });
        },
        resultSchema.list,
      )
      .post(
        "/",
        async ({ body }) => {
          const ExitingResult = await Result.findOne({
            student: body.student,
            session: body.session,
          });
          if (ExitingResult) {
            return customError(
              "Result Alreay Added For this Student and sesison",
            );
          }
          const result = await Result.create({
            student: body.student,
            class: body.class,
            grade: body.grade,
            marks: body.marks,
            remarks: body.remarks,
            session: body.session,
          });

          return R("Result ceated Successfully", result);
        },
        resultSchema.add,
      ),
);
