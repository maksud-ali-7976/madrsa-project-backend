import dotenv from "dotenv";
dotenv.config();

import axios, { Axios } from "axios";

const baseUrl = process.env.AI_API_URL;

const client = axios.create({
	baseURL: baseUrl,
	headers: {
		"Content-Type": "application/json",
	},
});

export interface AnalyedImagesResponse {
	success: boolean;
	message?: string;
	readings: {
		Observation: string;
		Location: string;
		Strength: number;
		Meaning: string;
		Image: string;
	}[];
	final_reading: string;
}

export default {
	analyzeImages: async (payload: {
		reading_id: string;
		language: string;
		images: { url: string; position: string }[];
		additional_prompt: string;
	}): Promise<AnalyedImagesResponse> => {
		try {
			const request = await client.post<AnalyedImagesResponse>(
				"/coffee_cup_reading",
				payload,
				{ maxBodyLength: Infinity },
			);

			if (request.status != 200) {
				throw "Invalid status code";
			}

			if (!request.data) {
				throw "Invalid response";
			}

			return request.data;
		} catch (error: any) {
			throw error;
		}
	},
	updatePrompt: async (payload: {
		analyze: string;
		generate: string;
	}): Promise<{
		status: "success";
		message: "Prompt(s) updated.";
	}> => {
		try {
			const request = await client.put<{
				status: "success";
				message: "Prompt(s) updated.";
			}>("/prompts", payload, { maxBodyLength: Infinity });

			if (request.status != 200) {
				throw "Invalid status code";
			}

			if (!request.data) {
				throw "Invalid response";
			}

			return request.data;
		} catch (error: any) {
			throw error;
		}
	},
};
