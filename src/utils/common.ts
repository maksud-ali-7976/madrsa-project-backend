import moment from "moment";
import { read, utils, write } from "xlsx";
import otp from "./otp";

export function randomInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}


export function csvJSON(csv: ArrayBuffer) {
    const wb = read(csv);

    return utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: null, dateNF: moment().creationData().format?.toString(), })
}



export const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

export const queryStringtoArray = (queryString: string | undefined): string[] => (queryString || '').split(",").filter(f => f);

export const generateUserToken = (userId: string) => `${userId}|${otp.generate(35, { alphabets: true, upperCase: true })}`