import moment from "moment";
import { isAdminAuthenticated } from "src/guard/admin.guard";
import { createElysia } from "src/utils/createElysia";
import { R } from "src/utils/response-helpers";

import Attendance from "src/models/Attendance";
import Student from "src/models/Student";
import Admin from "src/models/Admin";
import Class from "src/models/Class";
import Donations from "src/models/Donations";
import Results from "src/models/Results";
import schema from "./dashboard.schema";
export default createElysia({ prefix: "/dashboard" }).guard(
  {
    detail: {
      tags: ["Dashboard"],
    },

    beforeHandle: isAdminAuthenticated,
  },

  (app) =>
    app.get(
      "/",

      async () => {
        // -------------------------
        // STATS
        // -------------------------
        const [
          total_students,
          total_teachers,
          total_class,
          total_donation_aggregate,
        ] = await Promise.all([
          Student.countDocuments(),
          Admin.countDocuments({ super_admin: false }),
          Class.countDocuments(),

          Donations.aggregate([
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$amount",
                },
              },
            },
          ]),
        ]);

        const total_donation = total_donation_aggregate?.[0]?.total || 0;

        // -------------------------
        // GROWTH CHART
        // -------------------------
        const growth_chart = [];

        for (let i = 8; i >= 0; i--) {
          const start = moment()
            .subtract(i, "months")
            .startOf("month")
            .toDate();

          const end = moment().subtract(i, "months").endOf("month").toDate();

          const [students, donations] = await Promise.all([
            Student.countDocuments({
              createdAt: {
                $gte: start,
                $lte: end,
              },
            }),

            Donations.aggregate([
              {
                $match: {
                  createdAt: {
                    $gte: start,
                    $lte: end,
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  total: {
                    $sum: "$amount",
                  },
                },
              },
            ]),
          ]);

          growth_chart.push({
            m: moment(start).format("MMM"),
            students,
            donations: donations?.[0]?.total || 0,
          });
        }

        // -------------------------
        // ATTENDANCE
        // -------------------------
        const todayStart = moment().startOf("day").toDate();
        const todayEnd = moment().endOf("day").toDate();

        const [totalAttendanceStudents, present, late, absent] =
          await Promise.all([
            Student.countDocuments(),

            Attendance.countDocuments({
              status: "present",
              createdAt: {
                $gte: todayStart,
                $lte: todayEnd,
              },
            }),

            Attendance.countDocuments({
              status: "late",
              createdAt: {
                $gte: todayStart,
                $lte: todayEnd,
              },
            }),

            Attendance.countDocuments({
              status: "absent",
              createdAt: {
                $gte: todayStart,
                $lte: todayEnd,
              },
            }),
          ]);

        const percentage =
          totalAttendanceStudents > 0
            ? Math.round((present / totalAttendanceStudents) * 100)
            : 0;

        // -------------------------
        // DONATION CATEGORY
        // -------------------------
        const donationCategoryAggregate = await Donations.aggregate([
          {
            $group: {
              _id: "$type",
              total: {
                $sum: "$amount",
              },
            },
          },
        ]);

        const donation_categories = {
          zakat: 0,
          sadqah: 0,
          fidya: 0,
          nafl: 0,
          lillah: 0,
        };

        donationCategoryAggregate.forEach((item: any) => {
          switch (item._id) {
            case "ZAKAT":
              donation_categories.zakat = item.total;
              break;

            case "SADQAH":
              donation_categories.sadqah = item.total;
              break;

            case "FIDYA":
              donation_categories.fidya = item.total;
              break;

            case "NAFL":
              donation_categories.nafl = item.total;
              break;

            case "LILLAH":
              donation_categories.lillah = item.total;
              break;
          }
        });

        // -------------------------
        // DONATION BREAKDOWN CHART
        // -------------------------
        const donation_breakdown_chart = [
          {
            name: "Zakat",
            value: donation_categories.zakat,
          },
          {
            name: "Sadqah",
            value: donation_categories.sadqah,
          },
          {
            name: "Fidya",
            value: donation_categories.fidya,
          },
          {
            name: "Nafl",
            value: donation_categories.nafl,
          },
          {
            name: "Lillah",
            value: donation_categories.lillah,
          },
        ];

        // -------------------------
        // RECENT ACTIVITIES
        // -------------------------
        const recentStudents = await Student.find()
          .sort({ createdAt: -1 })
          .limit(5);

        const recent_activities = recentStudents.map((student) => ({
          title: "New Student Admission",
          description: `${student.name} joined the madrasa`,
          created_at: (student as any).createdAt,
          type: "student",
        }));

        // -------------------------
        // TOP PERFORMERS
        // -------------------------
        const topResults = await Results.find()
          .populate("student")
          .populate("class")
          .sort({ percentage: -1 })
          .limit(5);

        const top_performers = topResults.map((result: any) => ({
          student_id: result.student?._id || "",
          student_name: result.student?.name || "",
          class_name: result.class?.name || "",
          marks: result.marks || 0,
          percentage: result.percentage || 0,
          image: result.student?.image || "",
        }));

        return R("Dashboard Data Fetched Successfully", {
          stats: {
            total_students,
            total_teachers,
            total_class,
            total_donation,
          },

          growth_chart,

          attendance: {
            percentage,
            total_students: totalAttendanceStudents,
            present,
            late,
            absent,
          },

          donation_categories,

          donation_breakdown_chart,

          recent_activities,

          top_performers,
        });
      },

      schema.dashboard,
    ),
);
