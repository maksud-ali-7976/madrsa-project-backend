import { t } from "elysia";
import { isUserAuthenticated } from "src/guard/auth.guard";

export const StoreUserSchema = t.Object({
  _id: t.Optional(t.String()),
  name: t.Optional(t.String()),
  email: t.Optional(t.String()),
  token: t.Optional(t.String()),
  dob: t.Optional(t.String()),
  address: t.Optional(t.String()),
  language: t.Optional(t.String()),
  subscriptionLevel: t.Optional(t.String()),
  availableReadings: t.Optional(t.Number()),
  gender: t.Optional(t.String()),
  photo: t.Optional(t.String()),
  password: t.Optional(t.String()),
  createdAt: t.Optional(t.String()),
  updatedAt: t.Optional(t.String()),
  subscription: t.Optional(
    t.Object({
      _id: t.Optional(t.String()),
      name: t.Optional(t.String()),
      price: t.Optional(t.Number()),
      description: t.Optional(t.String()),
      readings: t.Optional(t.Number()),
    })
  ),
});
//
export default {
  signup: {
    body: t.Object({
      name: t.Optional(t.String()),
      password: t.Optional(t.String()),
      email: t.Optional(t.String()),
      dob: t.Optional(t.String()),
      gender: t.Optional(t.String()),
      language: t.Optional(t.String()),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Optional(StoreUserSchema),
        },
        {
          description: "signup response",
        }
      ),
    },
    detail: {
      operationId: "signup",
    },
  },
  login: {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Optional(StoreUserSchema),
        },
        {
          description: "Login Response",
        }
      ),
    },
    detail: {
      operationId: "login",
    },
  },
  me: {
    beforeHandle: isUserAuthenticated as any,
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Optional(StoreUserSchema),
        },
        {
          description: "me Response",
        }
      ),
    },
    detail: {
      operationId: "me",
    },
  },
  logout: {
    beforeHandle: isUserAuthenticated as any,
    params: t.Object({
      userId: t.String(),
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
        }
      ),
    },
    detail: { operationId: "logout" },
  },
  update_profile: {
    beforeHandle: isUserAuthenticated as any,
    body: t.Object({
      name: t.Optional(t.String()),
      email: t.Optional(t.String()),
      dob: t.Optional(t.String()),
      language: t.Optional(t.String()),
      gender: t.Optional(t.String()),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: StoreUserSchema,
        },
        {
          description: "update profile response",
        }
      ),
    },
    detail: {
      operationId: "updateProfile",
    },
  },
  change_password: {
    beforeHandle: isUserAuthenticated as any,
    body: t.Object({
      old_password: t.String(),
      new_password: t.String(),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Optional(StoreUserSchema),
        },
        {
          description: "change password response",
        }
      ),
    },
    detail: {
      operationId: "changePassword",
    },
  },
  update_profile_photo: {
    beforeHandle: isUserAuthenticated as any,
    body: t.Required(
      t.Object({
        photo: t.File({}),
      })
    ),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Optional(StoreUserSchema),
        },
        {
          description: "update user profile photo",
        }
      ),
    },
    detail: {
      operationId: "updateUserProfilePhoto",
      description: "upload",
    },
    type: "multipart/form-data",
  },
  signup_email_verify: {
    query: t.Object({
      id: t.String(),
    }),
    response: {
      200: t.Any(),
    },
  },
  forgot_password: {
    body: t.Object({
      email: t.Optional(t.String()),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Any(),
        },
        {
          description: "forgot password response",
        }
      ),
    },
    detail: {
      operationId: "forgotPassResponse",
    },
  },
  password_reset_schema: {
    body: t.Object({
      email: t.Optional(t.String()),
      password: t.Optional(t.String()),
      opt: t.String(),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Optional(StoreUserSchema),
        },
        {
          description: "password reset response",
        }
      ),
    },
    detail: {
      operationId: "PassResetRe",
    },
  },
  google_login: {
    body: t.Object({
      code: t.String(),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Optional(StoreUserSchema),
        },
        {
          description: "Google Login response",
        }
      ),
    },
    detail: {
      operationId: "GoogleLoginResponse",
    },
  },

  apple_login: {
    body: t.Object({
      code: t.String(),
      email: t.Optional(t.Nullable(t.String())),
      name: t.Optional(t.Nullable(t.String())),
    }),
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Optional(StoreUserSchema),
        },
        {
          description: "Apple Login response",
        }
      ),
    },
    detail: {
      operationId: "apple_login",
    },
  },
  user_delete: {
    beforeHandle: isUserAuthenticated as any,
    response: {
      200: t.Object(
        {
          status: t.Boolean(),
          message: t.String(),
          data: t.Any(StoreUserSchema),
        },
        {
          description: "Account Delete Response",
        }
      ),
    },
    detail: {
      operationId: "AccountDelete",
    },
  },
  subscription_cancle: {
    beforeHandle: isUserAuthenticated as any,
    response: {
      200: t.Object({
        status: t.Boolean(),
        message: t.String(),
        data: t.Any()
      }, {
        description: "Subscription Canclled"
      })
    },
    detail: {
      operationId: "SubscriptionCanclled"
    }
  }
};
