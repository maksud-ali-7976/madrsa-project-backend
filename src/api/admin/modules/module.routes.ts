import Elysia, { t } from "elysia";

import { customError } from "src/utils/AppErr";
import { HashPassword, VerifyPassword } from "src/utils/auth";
import jwt from "src/utils/jwt";
import { R } from "src/utils/response-helpers";
import schema from "./module.schema";
import Admin from "src/models/Admin";
import Role from "src/models/Role";
import { createElysia } from "src/utils/createElysia";
import {
  AdditionalModuleList,
  BasicModuleList,
  ModuleId,
  ModuleList,
  Summary,
} from "src/config/modules";
import { isAdminAuthenticated } from "src/guard/admin.guard";

export default createElysia({ prefix: "/modules" }).guard(
  {
    detail: {
      tags: ["Module"],
      summary: Summary([ModuleId.TEACHERS]),
    },
    beforeHandle: isAdminAuthenticated,
  },
  (app) =>
    app.get(
      "/",
      async ({ query, user }) => {
        const loggedInUser = await Admin.findById(user.id).populate("role");

        const type = query.type;

        let list: typeof ModuleList = ModuleList;

        if (type === "all") {
          list = ModuleList;
        }

        if (type === "basic") {
          list = BasicModuleList;
        }

        if (type === "additional") {
          list = AdditionalModuleList;
        }

        if (!loggedInUser?.super_admin) {
          let UserPermission = loggedInUser?.permissions || {};

          list = list.filter((module) => {
            const permission = UserPermission[module._id];
            return permission && permission.ability?.length > 0;
          });
        }
        console.log("List0", list);

        return R("module list data", list, true);
      },
      schema.list,
    ),
);
