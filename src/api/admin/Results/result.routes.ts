import Result from "src/models/Results";
import { isAdminAuthenticated } from "src/guard/admin.guard";
import { R } from "src/utils/response-helpers";
import { customError } from "src/utils/AppErr";
import { createElysia } from "src/utils/createElysia";
import resultSchema from "./result.schema";
import { ModuleId, Summary } from "src/config/modules";

export default createElysia({ prefix: "/results" }).guard(
  {
    detail: {
      tags: ["Results"],
      summary: Summary([ModuleId.RESULT]),
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
              .limit(size)
              .populate("student")
              .populate("class"),
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
          let total = 100;
          let grade = "";
          let remarks = "";
          const marks = body.marks || 0;
          const percentage = (marks / total) * 100;

          if (percentage >= 90) {
            grade = "A+";
            remarks = "Outstanding Performance";
          } else if (percentage >= 80) {
            grade = "A";
            remarks = "Excellent Work";
          } else if (percentage >= 60) {
            grade = "B"
            remarks = "Very Good";
          } else if (percentage >= 50) {
            grade = "C"
            remarks = "Good Effort";
          } else if (percentage >= 33) {
            grade = "D"
            remarks = "Needs Improvement";
          } else {
            grade = "F"
            remarks = "Poor Performance But Better Luck Next Time";
          }
          const ExitingResult = await Result.findOne({
            student: body.student,
            session: body.session,
            class: body.class,
          });
          if (ExitingResult) {
            return customError(
              "Result Alreay Added For this Student and sesison",
            );
          }
          const result = await Result.create({
            student: body.student,
            class: body.class,
            grade: grade,
            marks: marks,
            remarks: remarks,
            session: body.session,
            total: total,
            percentage: percentage
          });

          return R("Result ceated Successfully", result);
        },
        resultSchema.add,
      ).get("/detail", async ({ query }) => {
        const entry = await Result.findOne({ student: query.studentId })
          .populate("student")
          .populate("class")
        return R("Result Detail", entry);
      }, resultSchema.detail)
  ,
);
