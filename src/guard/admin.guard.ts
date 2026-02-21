import { customError } from "src/utils/AppErr";

import Admin from "src/models/Admin";
import JWT from "src/utils/jwt";

export const isAdminAuthenticated = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Context: any,
) => {
  const { set, headers, request } = Context;
  // console.log("/!\\ AUTHENTICATED GUARD /!\\");

  if (!headers!.authorization) {
    // console.log("@Error: No access token", headers);
    set.status = 401;
    return {
      status: false,
      message: "Unauthorized",
      data: "No access token",
    };
  }

  let token = headers.authorization.replace("Bearer ", "");

  const jwt = JWT.verify(token);
  if (!jwt) {
    // console.log("@Error: Invalid access token", jwt);
    set.status = 401;
    return {
      status: false,
      message: "Unauthorized",
      data: "Invalid access token",
    };
  }

  const { _id } = jwt;
  if (!_id) {
    // console.log("@Error: Invalid access token", _id);
    set.status = 401;
    return {
      status: false,
      message: "Unauthorized",
      data: "Invalid access token",
    };
  }

  if (!jwt) {
    // console.log("@Error: User not found", jwt);
    set.status = 401;
    return {
      status: false,
      message: "Unauthorized",
      data: "User not found",
    };
  }

  const user = await Admin.findById(jwt._id);

  // const userContext = new Elysia({ name: "user" }).decorate("user", user);
  Context.user = user;

  // console.log("user", userContext);

  // return {
  // 	status: true,
  // 	data: user,
  // };
};
