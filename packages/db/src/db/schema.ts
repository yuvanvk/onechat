import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: t.text("id").primaryKey(),
  name: t.text("name").notNull(),
  email: t.text("email").notNull().unique(),
  emailVerified: t.integer("email_verified").notNull(),
  plan: t.text("plan", { enum: ["free", "pro"] }).notNull().default("free"),
  credit_balance: t.integer("credit_balance").notNull().default(20_000),
  reserved_credits: t.integer("reserved_credits").notNull().default(0),
  subscriptionId: t.text("subscription_id").unique(),
  customerId: t.text("customer_id").unique(),
  cancelAtNextBillingDate: t.integer("cancel_at_next_billing_date", { mode: "boolean" }).default(false),
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
  id: t.text("id").primaryKey(),
  modelId: t.text("model_id").notNull().unique(),
  displayName: t.text("display_name").notNull(),
  description: t.text("description").notNull(),
  capabilities: t.text("capabilities", { mode: "json" }).$type<string[]>().notNull(),
  userId: t.text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const creditLedger = sqliteTable("credit_ledger", {
  id: t.text("id").primaryKey(),
  userId: t.text("user_id").notNull().references(() => user.id),
  conversationId: t.text("conversation_id").references(() => conversation.id, { onDelete: "set null"}),
  type: t.text("type", {
    enum: ["grant", "deduct", "topup", "refund", "reserve", "release"],
  }).notNull(),
  amount: t.integer("amount").notNull(),
  modelId: t.text("model_id"),
  provider: t.text("provider"),
  inputTokens: t.integer("input_tokens"),
  outputTokens: t.integer("output_tokens"),
  inputRateUsed: t.real("input_rate_used"),
  outputRateUsed: t.real("output_rate_used"),
  createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [
  t.index("ledger_user_idx").on(table.userId),
  t.index("ledger_conversation_idx").on(table.conversationId),
]);


export const model = sqliteTable("model", {
  id: t.text("id").primaryKey(),
  modelId: t.text("model_id").notNull().unique(),
  provider: t.text("provider").notNull(),
  displayName: t.text("display_name").notNull(),
  description: t.text("description").notNull(),
  tier: t.text("tier", { enum: ["free", "pro"]}).notNull().default("free"),
  usecase: t.text("usecase", { enum: ["text", "image"]}).notNull().default("text"),
  isActive: t.integer("is_active", { mode: "boolean" }).notNull().default(true),
  capabilities: t.text("capabilities", { mode: "json" }).$type<("text" | "vision" | "reasoning" | "coding" | "image-gen" | "multilingual" | "multi-agent")[]>(),
  rawInputRateUSD: t.real("raw_input_rate_usd").notNull(),
  rawOutputRateUSD: t.real("raw_output_rate_usd").notNull(),
  inputRateUSD: t.real("input_rate_usd").notNull(),
  outputRateUSD: t.real("output_rate_usd").notNull(),
  imageRateUSD: t.real("image_rate_usd"),
  markupMultiplier: t.real("markup_multiplier").notNull(),
  createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }).notNull(),
})