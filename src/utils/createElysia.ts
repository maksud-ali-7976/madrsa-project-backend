import { DocumentType, ReturnModelType } from "@typegoose/typegoose";
import consola from "consola";
import { Elysia, t } from "elysia";
import moment, { Moment } from "moment";
import { AdminClass } from "src/models/app/Admin";
import { UserClass } from "src/models/app/User";

export class Logger {
	private logText: string;
	private handleLog: boolean;
	private timeStart: Moment;

	constructor() {
		this.timeStart = moment();
		this.logText = `${this.timeStart.format('h:mm:ss a, MMMM Do YYYY')}`;
		this.handleLog = false;
	}

	add(text: any) {
		this.logText = this.logText + `\n` + text;
		return;
	}

	log(text: any) {
		if (!this.handleLog) {
			this.add("Handler Logs - ")
			this.handleLog = true;
		}
		this.add(text);
		return;
	}

	print() {
		this.add(`in ${moment().diff(this.timeStart, 'milliseconds')}ms`)
		consola.box(this.logText);
	}
}

export const createElysia = (
	config?: ConstructorParameters<typeof Elysia>[0],
) =>
	new Elysia({ ...config, aot: process.env.RUNTIME === "bun" })
		.decorate("user", {} as DocumentType<UserClass>)
		.decorate("admin", {} as DocumentType<AdminClass> & { token: string })
		.decorate("logger", {} as Logger)
		.guard({
			headers: t.Object({
				authorization: t.Optional(t.String({})),
			}),
		});
