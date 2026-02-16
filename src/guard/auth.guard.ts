import redisKeys from "src/config/redis-keys";
import redis from "src/db/redis";


export const isUserAuthenticated = async (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Context: any,
) => {
	const { set, headers, request } = Context;

	if (!headers!.authorization) {
		set.status = 401;
		return {
			status: false,
			message: "Unauthorized",
			data: "No access token",
		};
	}

	let token = headers.authorization.replace("Bearer ", "");

	const payload = await redis.getJson(redisKeys.userAuth(token));

	if (!payload) {
		set.status = 401;
		return {
			status: false,
			message: "Invalid Token",
			data: "Invalid Token",
		};
	}

	let user;
	try {
		user = { ...payload };
	} catch {

	}



	if (!user) {
		set.status = 401;

		return {
			status: false,
			message: "Unauthorized",
			data: "User not found",
		};
	}




	Context.user = user;


};
