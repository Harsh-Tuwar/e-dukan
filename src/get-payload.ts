import dotenv from 'dotenv';
import path from 'path';
import payload, { Payload } from 'payload';
import type { InitOptions } from 'payload/config';
import nodemailer from 'nodemailer';

dotenv.config({
	path: path.resolve(__dirname, '../.env')
});

const transport = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	secure: true,
	port: 465,
	auth: {
		user: process.env.G_APP_PASS_USER,
		pass: process.env.G_APP_PASS_KEY
	}
});

let cached = (global as any).payload;

if (!cached) {
	cached = (global as any).payload = {
		client: null,
		promise: null,
	};
}

interface Args {
	initOptions?: Partial<InitOptions>
}

export const getPayloadClient = async ({ initOptions }: Args = {}): Promise<Payload> => {
	if (!process.env.PAYLOAD_SECRET) {
		throw new Error('PAYLOAD_SECRET is missing');
	}

	if (cached.client) {
		return cached.client;
	}

	if (!cached.client) {
		cached.promise = payload.init({
			email: {
				transport: transport,
				fromAddress: 'welcome@edukan.com',
				fromName: 'E-Dukan'
			},
			secret: process.env.PAYLOAD_SECRET,
			local: initOptions?.express ? false : true,
			...(initOptions || {})
		});
	}

	try {
		cached.client = await cached.promise;
	} catch (error) {
		cached.promise = null;
		throw error;
	}

	return cached.client;
}