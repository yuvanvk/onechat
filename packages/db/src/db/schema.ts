import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
	id: t.text("id").primaryKey(),
	name: t.text("name").notNull(),
	email: t.text("email").notNull().unique(),
	emailVerified: t.integer("email_verified").notNull(),
	tier: t.text("tier", { enum: ["free", "pro"] }).notNull().default("free"),
	credit_balance: t.integer("credit_balance").notNull().default(0),
	reserved_credits: t.integer("reserved_credits").notNull().default(0),
	image: t.text("image"),
	createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
	updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const account = sqliteTable("account", {
	id: t.text("id").primaryKey(),
	userId: t.text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	accountId: t.text("account_id").notNull(),
	providerId: t.text("provider_id").notNull(),
	accessToken: t.text("access_token"),
	refreshToken: t.text("refresh_token"),
	accessTokenExpiresAt: t.integer("access_token_expires_at", { mode: "timestamp_ms" }),
	refreshTokenExpiresAt: t.integer("refresh_token_expires_at", { mode: "timestamp_ms" }),
	scope: t.text("scope"),
	idToken: t.text("id_token"),
	password: t.text("password"),
	createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
	updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const session = sqliteTable("session", {
	id: t.text("id").primaryKey(),
	userId: t.text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	token: t.text("token").notNull().unique(),
	expiresAt: t.integer("expires_at", { mode: "timestamp_ms" }).notNull(),
	ipAddress: t.text("ip_address"),
	userAgent: t.text("user_agent"),
	createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
	updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const verification = sqliteTable("verification", {
	id: t.text("id").primaryKey(),
	identifier: t.text("identifier").notNull(),
	value: t.text("value").notNull(),
	expiresAt: t.integer("expires_at", { mode: "timestamp_ms" }).notNull(),
	createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
	updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const conversation = sqliteTable("conversation", {
	id: t.text("id").primaryKey(),
	title: t.text("title", { length: 255 }).notNull().default("Untitled"),
	shareLink: t.text("share_link").unique(),
	userId: t.text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
	updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [t.index("conversation_user_idx").on(table.userId)]);

export const favourite = sqliteTable("favourite", {
	id: t.text("favourite").primaryKey(),
	modelId: t.text("model_id").notNull().unique(),
	displayName: t.text("display_name").notNull(),
	description: t.text("description").notNull(),
	capabilities: t.text("capabilities", { mode: "json"}).$type<string[]>().notNull(),
	userId: t.text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
	updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const creditLedger = sqliteTable("credit_ledger", {
	id: t.text("id").primaryKey(),
	user_id: t.text("user_id").notNull().references(() => user.id),
	type: t.text("type", { enum: ["grant", "deduct", "topup", "refund", "reserve", "release"]}).notNull(),
	amount: t.integer("amount").notNull(),
	modelId: t.text("model_id"),
	provider: t.text("provider"),
	input_tokens: t.integer("input_tokens"),
	output_tokens: t.integer("output_tokens"),
	createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const modelRate = sqliteTable("model_rate", {
	id: t.text("id").primaryKey(),
	modelId: t.text("model_id").notNull().unique(),
	provider: t.text("provider").notNull(),
	inputRateUSD: t.real("input_rate_usd"),
	outputRateUSD: t.real("output_rate_usd"),
	imageRateUSD: t.real("image_rate_usd"),
	minTier: t.text("min_tier", { enum: ["free", "pro"]}).notNull().default("free"),
	usecase: t.text("provider", { enum: ["text", "image"]}).notNull().default("text"),
	createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

// Steps:

// 0. Create a proper credit system as per provider and usecase.
// 1. Create the DB schema for Credit System -> Credit_ledger, Credit_pricing as per providers and models maybe
// 2. On the Backend before every AI call check for credits, and proceed further, and deduct as per. credit system
	// free user -> deduct as per credit system only.
	// pro -> deduct as per credit system only.
// 3. So we have a reserve field and credit_balance field, if credits required are more than balance - reserved only then
// we proceed with request after completion we finally deduct those many credits from balance, and free the reserved ones.
// after each deduction log it to ledger for compilances.
// 4. On Client show the credit usage for user both free/pro and if 20% less banner is show on top.

// Credit Subscriptions
// 1. Pro -> Fair credits
// 2. Credit packs like 5$, 10$, 100$ etc gets them credits as per price.

// edge cases
// 1. If for pro users or pack users credits are left off we need carry them to next billing cycle also.
//		So their amount is valued.
// 2. Make sure before calling AI api they have sufficient credits to process their request.
// 3. Handle stream disconnects



// credit system
// use cases as of now.

// Text generation -> tokens burned -> (check provider) as per them -> convert to credits -> deduct them + log
// Image generation -> here? -> (check provider) as per them -> convert to credit-> deduct them + log

// providers we have 
// 1. Anthropic
// 2. OpenAI
// 3. Google 
// 4. Meta
// 5. Kimi
// 6. Mistral
// 7. xAI
// 8. Qwen

// we are using AI gateway of cloudflare
// based on this how to convert credits?
