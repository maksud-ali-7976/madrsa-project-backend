import { t } from "elysia";
import { isAdminAuthenticated } from "src/guard/admin.guard";

export const AdminSchema = t.Object({
  _id: t.Optional(t.String()),
  password_unHashed: t.Optional(t.String()),
  name: t.Optional(t.String()),
  phone: t.Optional(t.String()),
  email: t.Optional(t.String()),
  password: t.Optional(t.String()),
  token: t.Optional(t.String()),
});
//
export default {
  signup: {
    body: t.Object({
      name: t.Optional(t.String()),
      password: t.Optional(t.String()),
      email: t.Optional(t.String()),
      phone: t.Optional(t.String()),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Optional(AdminSchema),
        },
        {
          description: "signup response",
        },
      ),
    },
    detail: {
      operationId: "signup",
    },
  },
  login: {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Optional(AdminSchema),
        },
        {
          description: "Login Response",
        },
      ),
    },
    detail: {
      operationId: "login",
    },
  },
  me: {
    beforeHandle: isAdminAuthenticated as any,
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Optional(AdminSchema),
        },
        {
          description: "me Response",
        },
      ),
    },
    detail: {
      operationId: "me",
    },
  },
  logout: {
    beforeHandle: isAdminAuthenticated as any,
    params: t.Object({
      id: t.String(),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Any(),
        },
        {
          description: "logout response",
        },
      ),
    },
    detail: { operationId: "logout" },
  },
  update_profile: {
    beforeHandle: isAdminAuthenticated as any,
    body: t.Object({
      name: t.Optional(t.String()),
      password: t.Optional(t.String()),
      email: t.Optional(t.String()),
      phone: t.Optional(t.String()),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: AdminSchema,
        },
        {
          description: "update profile response",
        },
      ),
    },
    detail: {
      operationId: "updateProfile",
    },
  },
  change_password: {
    beforeHandle: isAdminAuthenticated as any,
    body: t.Object({
      old_password: t.String(),
      new_password: t.String(),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Optional(AdminSchema),
        },
        {
          description: "change password response",
        },
      ),
    },
    detail: {
      operationId: "changePassword",
    },
  },
};
