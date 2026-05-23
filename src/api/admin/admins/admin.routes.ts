import Elysia, { t } from "elysia";
import { customError } from "src/utils/AppErr";
import { HashPassword, VerifyPassword } from "src/utils/auth";
import jwt from "src/utils/jwt";
import { R } from "src/utils/response-helpers";
import Admin, { AdminClass } from "src/models/Admin";
import { createElysia } from "src/utils/createElysia";
import moment from "moment";
import Role, { RoleLevel } from "src/models/Role";
import { RootFilterQuery } from "mongoose";

import { ModuleId, Summary } from "src/config/modules";
import { isAdminAuthenticated } from "src/guard/admin.guard";
import adminSchema from "../admins/admin.schema";

export default createElysia({ prefix: "/admins" }).guard(
  {
    detail: {
      tags: ["Admin"],
      summary: Summary([ModuleId.TEACHERS]),
    },
    beforeHandle: isAdminAuthenticated,
  },
  (app) =>
    app
      .get(
        "/",
        async ({ query, user }) => {
          const page = Number(query.page) || 0;
          const size = Number(query.size) || 10;
          const deleted = query?.deleted === "yes";

          let search = query?.search;

          if (search) {
            search = new RegExp(search, "i") as any;
          }

          const level = (user.role as any).level;
          const roles = await Role.find({
            level:
              level === RoleLevel.L1
                ? [RoleLevel.L1, RoleLevel.L2]
                : [RoleLevel.L3],
          }).distinct("_id");

          // Base query
          const filter: RootFilterQuery<AdminClass> = {
            phone: { $ne: "madrsaadmin" },
            ...(search && {
              $or: [
                {
                  name: {
                    $regex: search,
                  },
                },

                {
                  phone: {
                    $regex: search,
                  },
                },
              ],
            }),
            role: {
              $in: roles,
            },
          };

          const [list, total] = await Promise.all([
            Admin.find(filter)
              .skip(page * size)
              .limit(size)
              .populate("role")
              .sort({ createdAt: -1 })
              .select(
                size >= 50
                  ? { _id: 1, name: 1, phone: 1, password_unhashed: 1 }
                  : { password: 0 },
              )
              .lean(),
            Admin.countDocuments(filter),
          ]);
          const pages = Math.ceil(total / size);

          /**
           * Additoinal operations for checking group assigned or not.
           */

          for (let item of list) {
            const str = `${item?.phone || ""}|${item?.password_unHashed || ""}`;

            item.password = btoa(
              String.fromCharCode(...new TextEncoder().encode(str)),
            );

            delete (item as any).password_unhashed;
          }

          return R("admin list data", list, true, {
            pages,
            total,
            page,
            size,
          });
        },
        adminSchema.list,
      )
      .post(
        "/",
        async ({ body, user }) => {
          console.log("Body", body);

          const exitingAdmin = await Admin.findOne({ phone: body.phone });

          if (exitingAdmin) {
            return customError("Phone Number already used by another Teacher");
          }

          body.password = HashPassword(body.password_unhashed);

          const role = await Role.findById(body.role);

          if (!role) return customError("Invalid role");

          const entry = await Admin.create({
            ...body,
          });

          // if (role.level === RoleLevel.L2) {
          // 	const tenantEntry = await Tenant.create({
          // 		name: body.name,
          // 	});

          // 	entry.tenant = tenantEntry._id;
          // 	await entry.save();
          // }

          // if (role.level === RoleLevel.L3) {
          // 	entry.tenant = user.tenant._id;
          // 	await entry.save();
          // }

          // if (!user.super_admin) {
          // 	const children_count = await Admin.countDocuments({
          // 		parent: user._id,
          // 		deleted: false,
          // 	});
          // 	user.children_count = children_count;
          // 	await user.save();
          // }

          // if (body.children.length) {

          // 	await Admin.updateMany({ _id: { $in: body.children } }, { parent: entry._id })

          // }

          return R("entry Created", entry);
        },
        adminSchema.create,
      )
      .put(
        "/",
        async ({ body, query, user }) => {
          body.password = HashPassword(body.password_unhashed);

          const entry = await Admin.findOneAndUpdate(
            {
              _id: query.id,
            },
            {
              $set: {
                ...body,
              },
            },
            { new: true },
          );

          // if (body.children.length && entry) {
          // 	console.log("🚀 ~ body.children:", body.children)

          // 	await Admin.updateMany({
          // 		$and: [
          // 			{
          // 				_id: { $in: body.children }
          // 			},
          // 			{
          // 				_id: { $ne: entry._id }
          // 			},
          // 		]
          // 	}, { parent: entry._id })

          // }

          return R("entry updated", entry);
        },
        adminSchema.update,
      )
      .delete(
        "/",
        async ({ query, user }) => {
          const entry = await Admin.findByIdAndDelete(query.id);

          const role = await Role.findOne({ _id: entry?.role });
          console.log("Role", role);

          // if (!entry?.super_admin && role?.name === "MASTER") {
          // 	await Admin.updateMany({ parent: entry?._id }, { deleted: true });
          // }

          return R("entry updated", entry);
        },
        adminSchema.delete,
      )
      .post(
        "/permission",
        async ({ body, query }) => {
          console.log("Calling...");
          const { permission } = body;
          const { id } = query;

          const admin = await Admin.findById(id).populate("role");

          const mergePermissions = {
            ...((admin?.role as any)?.permissions || {}),
            ...permission,
          };
          // console.log("Merge Permission", mergePermissions);
          await Admin.findByIdAndUpdate(id, {
            $set: { permissions: mergePermissions },
          });

          return R("Permission Added");
        },
        adminSchema.permission,
      ),
);
