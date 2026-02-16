import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import moment from "moment";
import Subscriptions from "src/models/app/Subscriptions";
import Plan from "src/models/app/Plan";
import User from "src/models/app/User";

interface CustomerInfo {
	request_date: string;
	request_date_ms: number;
	subscriber: {
		entitlements: {
			premium_access: {
				expires_date: string;
				grace_period_expires_date: any;
				product_identifier: string;
				product_plan_identifier: string;
				purchase_date: string;
			};
		};
		first_seen: string;
		last_seen: string;
		management_url: string;
		non_subscriptions: {};
		original_app_user_id: string;
		original_application_version: any;
		original_purchase_date: any;
		other_purchases: {};
		subscriptions: {
			[key: string]: {
				auto_resume_date: any;
				billing_issues_detected_at: any;
				display_name: any;
				expires_date: string;
				grace_period_expires_date: any;
				is_sandbox: boolean;
				management_url: string;
				original_purchase_date: string;
				period_type: string;
				price: {
					amount: number;
					currency: string;
				};
				product_plan_identifier: string;
				purchase_date: string;
				refunded_at: any;
				store: string;
				store_transaction_id: string;
				unsubscribe_detected_at: string;
			};
		};
	};
}
export const revenueSubs = {
	getCustomerInfo: async (userId: string) => {
		try {
			const request = await axios.get(
				`https://api.revenuecat.com/v1/subscribers/${userId}`,
				{
					headers: {
						Authorization: `Bearer ${process.env.REVENUECAT_SECRET_KEY}`,
					},
				},
			);

			const data = request.data as CustomerInfo;

			if (!Object.keys(data?.subscriber?.subscriptions || {}).length)
				return null;

			return data;
		} catch (error) {
			console.log("🚀 ~ error:", error);
			return null;
		}
	},
	getUserActiveSub: async (userId: string) => {
		const customerInfo = await revenueSubs.getCustomerInfo(userId);
		if (!customerInfo) return null;

		let activeSubscription;

		for (let key in customerInfo.subscriber.subscriptions) {
			let sub = (customerInfo.subscriber.subscriptions as any)[
				key
			] as CustomerInfo["subscriber"]["subscriptions"][""];

			const startDate = moment(sub.purchase_date);
			const endDate = moment(sub.expires_date);
			const now = moment();

			if (now.isSameOrAfter(startDate) && now.isSameOrBefore(endDate)) {
				if (sub.unsubscribe_detected_at) {
					const unsubscribeAt = moment(sub.unsubscribe_detected_at);
					if (now.isBefore(unsubscribeAt)) {
						activeSubscription = sub;
					}
				} else {
					activeSubscription = sub;
				}
			}
		}

		return activeSubscription;
	},
	managerUserSub: async (userId: string) => {
		const user = await User.findById(userId);

		if (!user) return;

		const activeSub = await revenueSubs.getUserActiveSub(userId);
		console.log("🚀 ~ activeSub:", activeSub);
		const dbActiveSubs = await Subscriptions.find({
			user: userId,
			status: "active",
			type: "subscription",
		})
			.populate("plan")
			.sort({ createdAt: -1 })
			.limit(1);

		const dbActiveSub = dbActiveSubs.length ? dbActiveSubs[0] : null;
		console.log("🚀 ~ dbActiveSub:", dbActiveSub);
		const dbActiveSubPlan = dbActiveSub?.plan as any;

		if (!activeSub) {
			if (dbActiveSub && (dbActiveSub.plan as any)?.title != "Free") {
				console.log("assigining a free plan");
				const freePlan = await Plan.findOne({
					title: "Free",
				});

				if (!freePlan) return;

				const freeSubscription = await Subscriptions.findOneAndUpdate(
					{
						user: userId,
						plan: freePlan._id,
					},
					{
						$set: {
							status: "active",
							type: "subscription",
							startDate: moment(),
							endDate: moment().add(100, "year"),
							pendingCancle: true,
							description: "Free Readings",
						},
					},
					{ upsert: true, new: true },
				);

				user.subscription = freeSubscription._id;
				if (user?.availableReadings <= dbActiveSubPlan.readings) {
					user.availableReadings = 0;
				}

				await user.save();
			}
			return;
		}

		if (activeSub.store_transaction_id != dbActiveSub?.store_transaction_id) {
			const plan = await Plan.findOne({
				productId:
					activeSub.product_plan_identifier || "qahveenunlimitedsubscription",
			});

			if (!plan) return;

			const sub = await Subscriptions.create({
				user: userId,
				autoRenew: true,
				startDate: moment(activeSub.purchase_date),
				endDate: moment(activeSub.expires_date),
				plan: plan._id,
				status: "active",
				type: "subscription",
				store_transaction_id: activeSub.store_transaction_id,
				description: `Unlimited until ${moment(activeSub.expires_date).format(
					"DD MMM YYYY hh:mm:ss",
				)}`,
			});
			user.subscription = sub._id;

			user.availableReadings = plan.readings || 0;

			await user.save();
		}
	},
};
