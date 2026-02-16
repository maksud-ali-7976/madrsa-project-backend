import dotenv from "dotenv";
dotenv.config();

export default {
	// App
	// secret: process.env.APP_SECRET || "",
	baseUrl: {
		production: process.env.BASE_URL_PRODUCTION || "",
		test: process.env.BASE_URL_TEST || "",
	},
	port: (process.env.APP_PORT || 9000) as number,


	//web push
	webPushContact: process.env.WEB_PUSH_CONTACT || "",
	publicVapidKey: process.env.PUBLIC_VAPID_KEY || "",
	secretVapidKey: process.env.PRIVATE_VAPID_KEY || "",

	//google
	GoogleClientId: process.env.GOOGLE_CLIENT_ID || "",
	GoogleClientIdIos: process.env.GOOGLE_CLIENT_ID_IOS || "",

	//Api

	base_url: "http://127.0.0.1:10001",


	origin: "*",
	secret: "C582FCCF4AF6F14433E2736F8331A",



};
