// @ts-ignore
import { UserDetail } from "otpless-node-js-auth-sdk";

import { customError } from "src/utils/AppErr";
import { HashPassword, VerifyPassword } from "src/utils/auth";
import jwt from "src/utils/jwt";
import { R } from "src/utils/response-helpers";
import schema from "./auth.schema";
import { createElysia } from "src/utils/createElysia";
import moment from "moment";
import { generateUserToken } from "src/utils/common";
import redis from "src/db/redis";
import redisKeys from "src/config/redis-keys";
import Admin from "src/models/app/Admin";
import { uploadFile } from "src/utils/upload";
import { sendMail } from "src/utils/mailer";
import otp from "src/utils/otp";
import Plan from "src/models/app/Plan";
import Subscriptions from "src/models/app/Subscriptions";
import AppWrite from "src/utils/AppWrite";
import {
    getVerificationEmailTemplate,
    getWelcomeEmailTemplate,
} from "src/utils/mailTemplate";
import axios from "axios";
import getErrorMessage from "src/utils/languageError";
import { verifyGoogleToken } from "src/utils/Google";
import { verifyAppleToken } from "src/utils/Apple";
import { t } from "elysia";
import { isAdminAuthenticated } from "src/guard/admin.guard";

export default createElysia({ prefix: "/auth" }).guard(
    {
        detail: {
            tags: ["AdminAuth"],
        },
    },
    (app) => app
        .post("/login", async ({ body }) => {
            try {
                const { adminId, password } = body;

                // Find admin by adminId
                const admin = await Admin.findOne({
                    adminId: adminId,
                    isActive: true
                });

                if (!admin) {
                    throw customError("Invalid credentials", 401);
                }

                // Verify password
                const isValidPassword = await VerifyPassword(password, admin.password);
                if (!isValidPassword) {
                    throw customError("Invalid credentials", 401);
                }

                // Generate token
                const token = jwt.sign({
                    adminId: admin.adminId,
                    role: "admin"
                });

                return R("Login successful", {
                    token,
                    admin: {
                        adminId: admin.adminId,
                        isActive: admin.isActive
                    }
                });
            } catch (error: any) {
                throw customError(error.message, error.status || 500);
            }
        }, {
            body: t.Object({
                adminId: t.Number(),
                password: t.String(),
            }),
            response: {
                200: t.Object({
                    status: t.Boolean(),
                    message: t.String(),
                    data: t.Object({
                        token: t.String(),
                        admin: t.Object({
                            adminId: t.Number(),
                            isActive: t.Boolean(),
                        }),
                    }),
                }),
            },
            detail: {
                summary: "Admin Login",
                description: "Login for admin users using adminId and password"
            }
        })
        .get("/me", async ({ body, admin }) => {

            const data = await Admin.findById(admin._id)


            return R("OK", { token: admin.token, admin: data })

        }, {
            beforeHandle: isAdminAuthenticated as any,
            response: {
                200: t.Object({
                    status: t.Boolean(),
                    message: t.String(),
                    data: t.Object({
                        token: t.String(),
                        admin: t.Object({
                            adminId: t.Number(),
                            isActive: t.Boolean(),
                        }),
                    }),
                }),
            },
            detail: {
                summary: "Admin me",
                description: "Login for admin users using adminId and password"
            }
        })
);
