import { t } from "elysia";

export const DashboardStatsSchema = t.Object({
  total_students: t.Number(),
  total_teachers: t.Number(),
  total_class: t.Number(),
  total_donation: t.Number(),
});

export const DashboardGrowthSchema = t.Array(
  t.Object({
    m: t.String(), // Month
    students: t.Number(),
    donations: t.Number(),
  }),
);

export const DashboardAttendanceSchema = t.Object({
  percentage: t.Number(),
  total_students: t.Number(),
  present: t.Number(),
  late: t.Number(),
  absent: t.Number(),
});

export const DashboardDonationCategorySchema = t.Object({
  zakat: t.Number(),
  sadqah: t.Number(),
  fidya: t.Number(),
  nafl: t.Number(),
  lillah: t.Number(),
});

export const DashboardDonationBreakdownSchema = t.Array(
  t.Object({
    name: t.String(),
    value: t.Number(),
  }),
);

export const DashboardRecentActivitySchema = t.Array(
  t.Object({
    title: t.String(),
    description: t.String(),
    created_at: t.String(),
    type: t.Union([
      t.Literal("student"),
      t.Literal("donation"),
      t.Literal("teacher"),
      t.Literal("attendance"),
    ]),
  }),
);

export const DashboardTopPerformerSchema = t.Array(
  t.Object({
    student_id: t.String(),
    student_name: t.String(),
    class_name: t.String(),
    marks: t.Number(),
    percentage: t.Number(),
    image: t.Optional(t.String()),
  }),
);

export const DashboardStoreScheam = t.Object({
  stats: DashboardStatsSchema,

  growth_chart: DashboardGrowthSchema,

  attendance: DashboardAttendanceSchema,

  donation_categories: DashboardDonationCategorySchema,

  donation_breakdown_chart: DashboardDonationBreakdownSchema,

  recent_activities: DashboardRecentActivitySchema,

  top_performers: DashboardTopPerformerSchema,
});

export default {
  dashboard: {
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: DashboardStoreScheam,
        },
        {
          description: "Dashboard Overview Data",
        },
      ),
    },

    detail: {
      operationId: "DashboardOverview",
      summary: "Dashboard Overview API",
    },
  },
};
