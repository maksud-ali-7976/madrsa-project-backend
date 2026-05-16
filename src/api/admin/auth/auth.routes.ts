import { createElysia } from "src/utils/createElysia";
import Elysia, { t } from "elysia";
import Admin from "src/models/Admin";
import { R } from "src/utils/response-helpers";
import { customError } from "src/utils/AppErr";
import jwt from "src/utils/jwt";
import { HashPassword, VerifyPassword } from "src/utils/auth";
import authSchema from "./auth.schema";
import { sendMail } from "src/utils/mailer";

export default createElysia({ prefix: "/auth" }).guard(
  {
    detail: {
      tags: ["auth"],
    },
  },
  (app) =>
    app
      .post(
        "/login",
        async ({ body }) => {
          const user = await Admin.findOne({
            $or: [
              {
                email: body.username,
              },
              {
                phone: body.username,
              },
            ],
          }).populate("role");
          if (!user) {
            return customError("Invalid credentials.");
          }

          if (!VerifyPassword(body.password, user.password)) {
            return customError("Invalid credentials.");
          }

          let u: Record<string, any> = user.toObject();

          u.token = jwt.sign({
            _id: user._id,
            phone: user.phone,
            email: user.email,
          });

          if (Object.keys(u?.permissions ?? {}).length > 0) {
            (u.role as any).permissions = {
              ...(u.role as any).permissions,
              ...u.permissions,
            };
          }

          return R("Login Successfully", u);
        },
        authSchema.login,
      )
      .get(
        "/me",
        async (ctx) => {
          const user = await Admin.findById(ctx.user._id)
            .populate("role")
            .lean();

          if (!user) {
            return customError("Invalid credentials.");
          }

          if (Object.keys(user?.permissions ?? {}).length > 0) {
            (user.role as any).permissions = {
              ...(user.role as any).permissions,
              ...user.permissions,
            };
          }

          return R("admin data", user);
        },
        authSchema.me,
      )
      .post(
        "/password-change",
        async (ctx) => {
          const user = await Admin.findById(ctx.user._id);
          console.log("User", user);

          if (!user) {
            return customError("User Not Found");
          }

          if (VerifyPassword(ctx.body.old_password, user.password)) {
            return customError("Old Password Wrong");
          }

          user.password = HashPassword(ctx.body.new_password);
          user.password_unHashed = ctx.body.new_password;

          await user.save();
          return R("Password Change SuccessFully");
        },
        authSchema.change_password,
      ),
);
