import { t } from "elysia";
import { RoleSchema } from "../roles/roles.schema";
import { query } from "firebase/database";

export const adminSchema = t.Object({
	_id: t.String(),
	name: t.String(),
	// FIX 1 → array allow
	permissions: t.Any(),
	super_admin: t.Boolean(),
	phone: t.Optional(t.String()),
	password: t.Optional(t.String()),
	token: t.Optional(t.String()),
	createdAt: t.String(),
	updatedAt: t.String(),
	admins: t.Array(
		t.Object({
			_id: t.String(),
			name: t.String(),

			// FIX 4
			permissions: t.Any(),

			super_admin: t.Boolean(),
			phone: t.Optional(t.String()),
			password: t.Optional(t.String()),
			token: t.Optional(t.String()),
			createdAt: t.String(),
			updatedAt: t.String(),
			role: t.Any(), // Because role.permissions changes dynamically
		}),
	),

	role: RoleSchema,
});

const typeEnum = {
	NORMAL: "normal",
	CUSTOMER: "customer",
};

const MetaPaginationSchema = t.Object({
	pages: t.Number(),
	total: t.Number(),
	page: t.Number(),
	size: t.Number(),
});

export default {
	list: {
		query: t.Object({
			page: t.String(),
			size: t.String(),
			search: t.Optional(t.String()),
			request_type: t.Optional(t.String()),
			type: t.Optional(t.String()),
			deleted: t.Optional(t.String()),
			// page: t.Numeric(),
			// size: t.Numeric(),
		}),
		response: {
			200: t.Object(
				{
					status: t.Boolean(),
					message: t.String(),
					data: t.Any(t.Array(adminSchema)),
					meta: MetaPaginationSchema,
				},
				{
					description: "admins Response",
				},
			),
		},
		detail: {
			operationId: "list",
		},
	},
	create: {
		body: t.Object({
			name: t.String(),
			phone: t.String(),
			email: t.String(),
			password_unhashed: t.String(),
			password: t.Optional(t.String()),
			role: t.String(),
		}),
		response: {
			200: t.Object(
				{
					status: t.Boolean(),
					message: t.String(),
					data: t.Any(adminSchema),
				},
				{
					description: "admins Response",
				},
			),
		},
		detail: {
			operationId: "create",
		},
	},
	update: {
		body: t.Object({
			name: t.String(),
			phone: t.String(),
			email: t.String(),
			password_unhashed: t.String(),
			password: t.Optional(t.String()),
			role: t.String(),
		}),

		query: t.Object({
			id: t.String(),
		}),
		response: {
			200: t.Object(
				{
					status: t.Boolean(),
					message: t.String(),
					data: t.Any(adminSchema),
				},
				{
					description: "admins Response",
				},
			),
		},
		detail: {
			operationId: "update",
		},
	},
	delete: {
		query: t.Object({
			id: t.String(),
		}),
		response: {
			200: t.Object(
				{
					status: t.Boolean(),
					message: t.String(),
					data: t.Any(adminSchema),
				},
				{
					description: "admins Response",
				},
			),
		},
		detail: {
			operationId: "delete",
		},
	},
	permission: {
		query: t.Object({
			id: t.String(),
		}),
		body: t.Object({
			permission: t.Any(),
		}),
		response: {
			200: t.Object(
				{
					status: t.Boolean(),
					message: t.String(),
					data: t.Any(),
				},
				{
					description: "Permission Add Response",
				},
			),
		},
		detail: {
			operationId: "PersmissionAdd",
		},
	},
};
