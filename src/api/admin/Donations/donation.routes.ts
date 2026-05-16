import { createElysia } from "src/utils/createElysia";
import { R } from "src/utils/response-helpers";
import { customError } from "src/utils/AppErr";
import Donations from "src/models/Donations";
import { isAdminAuthenticated } from "src/guard/admin.guard";
import donationsSchema from "./donations.schema";
import moment from "moment";

export default createElysia({ prefix: "/donations" }).guard(
  {
    detail: {
      tags: ["Donations"],
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

          const [donations, total] = await Promise.all([
            Donations.find()
              .skip(page * size)
              .limit(size),
            Donations.countDocuments(),
          ]);
          const pages = Math.ceil(total / size);
          return R("Donation List", donations, true, {
            pages,
            page,
            size,
            total,
          });
        },
        donationsSchema.list,
      )
      .post(
        "/",
        async ({ body }) => {
          const now = moment();
          const donation = await Donations.create({
            donar_name: body.donar_name,
            type: body.type,
            amount: body.amount,
            date: now.startOf("day").toDate(),
            payment_method: body.payment_method,
            notes: body.notes,
          });
          return R("Donation Added Successfully", donation);
        },
        donationsSchema.add,
      )
      .put(
        "/",
        async ({ body, query }) => {
          const donation = await Donations.findByIdAndUpdate(query.id, body);
          return R("Donation Updated Successfully", donation);
        },
        donationsSchema.update,
      )
      .get(
        "/stats",
        async () => {
          const stats = await Donations.aggregate([
            {
              $group: {
                _id: null,
                totalDonation: { $sum: "$amount" },
                totalZakat: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "ZAKAT"] }, "$amount", 0],
                  },
                },
              },
            },
          ]);
          return R("Donation Stats", stats);
        },
        donationsSchema.stats,
      ),
);
