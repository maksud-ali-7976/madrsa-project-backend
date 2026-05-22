import { createElysia } from "src/utils/createElysia";
import { R } from "src/utils/response-helpers";
import { customError } from "src/utils/AppErr";
import Donations, { DonationsClass } from "src/models/Donations";
import { isAdminAuthenticated } from "src/guard/admin.guard";
import donationsSchema from "./donations.schema";
import moment from "moment";
import { ModuleId, Summary } from "src/config/modules";
import { RootFilterQuery } from "mongoose";

export default createElysia({ prefix: "/donations" }).guard(
  {
    detail: {
      tags: ["Donations"],
      summary: Summary([ModuleId.DONATIONS]),
    },
    beforeHandle: isAdminAuthenticated,
  },
  (app) =>
    app
      .get(
        "/",
        async ({ query, user }) => {
          const page = parseInt(query.page || "");
          const size = parseInt(query.size || "");

          let fillter: RootFilterQuery<DonationsClass> = {};
          if (!user.super_admin) {
            fillter.admin = user._id;
          }
          const [donations, total] = await Promise.all([
            Donations.find(fillter)
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
      )
      .get(
        "/detail",
        async ({ query }) => {
          const entry = await Donations.findById(query.id);
          return R("Donation Detail", entry);
        },
        donationsSchema.detail,
      ),
);
