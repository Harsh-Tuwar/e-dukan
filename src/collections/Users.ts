import { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
	slug: 'users',
	auth: {
		verify: {
			generateEmailHTML: ({ token }) => {
				return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}'>Verify Email</a>`;
			}
		}
	},
	access: {
		read: () => true,
		create: () => true,
	},
	fields: [
		{
			name: 'role',
			type: 'select',
			defaultValue: 'user',
			required: true,
			options: [
				{ label: 'Admin', value: 'admin' },
				{ label: 'User', value: 'user' }
			]
		}
	]
}