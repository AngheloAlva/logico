import { prismaAdapter } from "better-auth/adapters/prisma"
import { twoFactor } from "better-auth/plugins/two-factor"
import { nextCookies } from "better-auth/next-js"
import { admin } from "better-auth/plugins/admin"
import { betterAuth } from "better-auth"

import { prisma } from "./prisma"

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [nextCookies(), admin(), twoFactor()],
})
