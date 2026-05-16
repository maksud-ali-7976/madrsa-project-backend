import { t } from "elysia";

export const DonationSchema = t.Object({
  _id: t.String(),
  donar_name: t.String(),
  type: t.String(),
  amount: t.Number(),
  date: t.String(),
  payment_method: t.Optional(t.String()),
  notes: t.Optional(t.String()),
});

export const DonationStatsSchema = t.Object({
  total_donation: t.Optional(t.Number()),
  total_zakat: t.Optional(t.Number()),
});

export const MetaPgination = t.Object({
  total: t.Number(),
  pages: t.Number(),
  page: t.Number(),
  size: t.Number(),
});

export default {
  list: {
    query: t.Object({
      page: t.Optional(t.String()),
      size: t.Optional(t.String()),
    }),

    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Array(DonationSchema),
          meta: MetaPgination,
        },
        {
          description: "Donation List Response",
        },
      ),
    },
    detail: {
      operationId: "DonationList",
    },
  },
  add: {
    body: t.Object({
      donar_name: t.String(),
      type: t.String(),
      amount: t.Number(),
      payment_method: t.Optional(t.String()),
      notes: t.Optional(t.String()),
    }),

    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: DonationSchema,
        },
        {
          description: "Donation Add Response",
        },
      ),
    },
    detail: {
      operationId: "DonationAdd",
    },
  },
  update: {
    query: t.Object({
      id: t.String(),
    }),
    body: t.Object({
      donar_name: t.Optional(t.String()),
      type: t.Optional(t.String()),
      amount: t.Optional(t.Number()),
      payment_method: t.Optional(t.String()),
      notes: t.Optional(t.String()),
    }),

    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: DonationSchema,
        },
        {
          description: "Donation Update Response",
        },
      ),
    },
    detail: {
      operationId: "DonationUpdate",
    },
  },
  stats: {
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: DonationStatsSchema,
        },
        {
          description: "Donation Stats response",
        },
      ),
    },
    detail: {
      operationId: "DonationStats",
    },
  },
};
