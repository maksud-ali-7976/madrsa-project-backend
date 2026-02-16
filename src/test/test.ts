import { mongo } from "mongoose";
import { connectDB } from "src/db/mongo";
import PlanLangue from "src/models/app/PlanLanguage";
import User from "src/models/app/User";
import { HashPassword } from "src/utils/auth";
import getErrorMessage from "src/utils/languageError";

import GoogleAuth from "google-auth-library";
import AppleAuth from "apple-signin-auth";
import Subscriptions from "src/models/app/Subscriptions";
import moment from "moment";
import userImagesRoutes from "src/api/admin/user-images/user-images.routes";
import Plan from "src/models/app/Plan";
import PlanLanguage from "src/models/app/PlanLanguage";
import axios from "axios";
import { revenueSubs } from "src/utils/subscription";

connectDB("test");

const logUnlimitedSubs = async () => {
	try {
		const subs = await Subscriptions.find(
			{
				description: { $regex: /Unlimited until/i },
			},
			{
				description: 1,
				user: 1,
				plan: 1,
				startDate: 1,
				endDate: 1,
				store_transaction_id: 1,
			},
		).populate([
			{ path: "user", select: ["email"] },
			{ path: "plan", select: ["title"] },
		]);

		console.log(
			`Found ${subs.length} subscriptions containing "Unlimited until".`,
		);
		subs.forEach(
			async (sub) => {
				if (sub.plan?._id.toString() != "6888fa51eda525510929bb59") {
					console.log("MISSED");
					sub.plan = "6888fa51eda525510929bb59";
					await sub.save();
				}

				return sub;
			},
			// console.log({
			// 	id: sub._id?.toString(),
			// 	user: (sub as any)?.user?.email || sub.user,
			// 	plan: (sub as any)?.plan?.title || sub.plan,
			// 	description: sub.description,
			// 	startDate: sub.startDate,
			// 	endDate: sub.endDate,
			// 	store_transaction_id: sub.store_transaction_id,
			// }),
		);
	} catch (error) {
		console.error("Failed to list Unlimited subs", error);
	}
};

void logUnlimitedSubs();

// const main = async (app_user_id: string) => {
// 	try {
// 		const sub = await revenueSubs.getCustomerInfo(app_user_id);
// 		console.log("🚀 ~ main ~ sub:", sub);
// 		// await revenueSubs.managerUserSub(app_user_id);

// 		// console.log("🚀 ~ main ~ sub:", sub);
// 		// const start = moment(sub?.purchase_date);
// 		// console.log("🚀 ~ main ~ start:", start);
// 		// const end = moment(sub?.expires_date);
// 		// console.log("🚀 ~ main ~ end:", end);
// 	} catch (error) {
// 		console.log("🚀 ~ main ~ error:", error);
// 	}
// };

// main("6900e703602e64d98ac839fd");
// import nodemailer from 'nodemaile
// const plans = [
//   {
//     plan: new mongo.ObjectId("688b8383cf8406ba4c673c34"),
//     name: "حر",
//     language: "Arabic",
//   },
//   {
//     plan: new mongo.ObjectId("688b8383cf8406ba4c673c34"),
//     name: "Free",
//     language: "English",
//   },
//   {
//     plan: new mongo.ObjectId("688b8383cf8406ba4c673c34"),
//     name:"رایگان",
//     language: "Persian",
//   },
//   {
//     plan: new mongo.ObjectId("688b8383cf8406ba4c673c34"),
//     name: "Özgür",
//     language: "Turkish",
//   },
//   {
//     plan: new mongo.ObjectId("688b8383cf8406ba4c673c34"),
//     name: "Անվճար",
//     language: "Armenian",
//   },
// ];

// const plan = await PlanLangue.insertMany(plans);
//     title: "Basic",
//     price: 4.99,
//     duration: "1 Month",
//     benefit: "Five readings a month no advertisement",
//     discounted_price: 4.99,
//     productId: "qahweenbasicplan",
//     readings: 5,
//   },
//   {
//     title: "Standard",
//     price: 8.99,
//     duration: "1 Month",
//     benefit: "ten readings a month no advertisement",
//     discounted_price:8.99,
//     productId: "qahweenstandardplan",
//     readings: 10,
//   },
//   {
//     title: "Premium",
//     price: 12.99,
//     duration: "1 Month",
//     benefit: "ten readings a month no advertisement",
//     discounted_price: 12.99,
//     productId: "qahweenpremiumplan",
//     readings: 15,
//   },
// ];

// const plan = await Plan.insertMany(plans);

// const client = new GoogleAuth.OAuth2Client({
//   client_id: "1065493654943-ac3uudg8pp215gmlnohjre0klo55071q.apps.googleusercontent.com",
// })

// async function verifyGoogleToken(idToken: string) {
//   const ticket = await client.verifyIdToken({
//     idToken,
//     audience: "1065493654943-ac3uudg8pp215gmlnohjre0klo55071q.apps.googleusercontent.com",
//   });
//   const payload = ticket.getPayload();
//   return payload; // contains email, name, sub (Google user ID)
// }

// const plans = await Plan.find({})
// console.log("🚀 ~ plan:", plans)

// for (let p of plans) {
//     p.days = 30;
//     await p.save();
// }

// async function verifyAppleToken(idToken: string) {
//   const response = await AppleAuth.verifyIdToken(idToken, {
//     audience: "com.qahveen", // Your app's bundle ID
//     ignoreExpiration: false,

//   });

//   // response contains user details: sub (user ID), email, etc.
//   return response;
// }

// const user = await User.findOne({ email: "jyoti55@gmail.com" })

// if (user) {

//     const subs = await Subscriptions.find({ user: user._id }).populate([{ path: "plan" }]).sort({ createdAt: -1 })
//     for (let sub of subs) {
//         const startDate = moment(sub.startDate).format("DD MMM YY hh:mm:ss")
//         const endDate = moment(sub.endDate).format("DD MMM YY hh:mm:ss")
//         const createdAt = moment(sub.createdAt).format("DD MMM YY hh:mm:ss")
//     }
// }

// "qahweenstandardplan"
// const data = [
//     {
//         _id: '6888fa51eda525510929bb57',
//         title: "1 Reading",
//         price: 3.99,
//         discounted_price: 1.99,
//         duration: "1 Month",
//         benefit: "1 Reading",
//         productId: "qahveen_one",
//         readings: 1,
//     }, {
//         _id: '6888fa51eda525510929bb59',
//         title: "Unlimited for a month",
//         price: 59.99,
//         discounted_price: 29.99,
//         duration: "1 Month",
//         benefit: "Unlimited readings for a month",
//         productId: "qahveen_unlimited",
//         readings: 30,
//     }, {
//         _id: '6888fa51eda525510929bb58',
//         title: "5 Readings",
//         price: 14.99,
//         discounted_price: 7.99,
//         duration: "1 Month",
//         benefit: "5 Readings",
//         productId: "qahveen_five",
//         readings: 5,
//     }
// ];

// for (let item of data) {
//     const product = await Plan.findById(item._id)

//     if (product) {
//         await product.updateOne(item)
//         await product.save()

//         const planLanguages = await PlanLanguage.find({ plan: product._id })

//         if (planLanguages.length) {
//             for (let planLanguage of planLanguages) {

//                 planLanguage.name = item.title
//                 planLanguage.benefit = item.benefit;
//                 await planLanguage.save()
//             }

//         }
//     }
// }

// const plans = await Plan.find({})
// console.log("🚀 ~ plans:", plans)

// const user = await User.findOne({ email: "p3@gmail.com" })

// if (user) {
//     const sub = await Subscriptions.find({ user: user._id }).populate("plan").sort({ createdAt: -1 })
//     console.log("🚀 ~ sub:", sub)
// }

console.log("finished");
