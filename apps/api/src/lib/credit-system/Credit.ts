import { getDB, user } from "@workspace/db";
import { Model } from "./Model";
import { User } from "./User";
import { and, eq, gte, sql } from "drizzle-orm";
import { Db } from "./Db";

export class Credit {
  private static readonly CREDIT_VALUE = 0.0001;

  static async get(
    userId: string,
  ): Promise<{ creditBalance: number; reservedCredits: number }> {
    const userCredits = await User.getUserCredits(userId);

    return {
      creditBalance: userCredits?.credit_balance!,
      reservedCredits: userCredits?.reserved_credits!,
    };
  }

  static async reserve(
    userId: string,
    creditsToReserve: number,
  ): Promise<boolean> {
    const db = Db.get();
    const result = await db
      .update(user)
      .set({ 
        credit_balance: sql`${user.credit_balance} - ${creditsToReserve}`,
        reserved_credits: sql`${user.reserved_credits} + ${creditsToReserve}`
      })
      .where(
        and(
          eq(user.id, userId),
          gte(user.credit_balance, creditsToReserve)
        )
      )
      .returning()

    return result.length > 0;

  }

  static async settle(userId: string, estimatedCredits: number, actualCredits: number) {
    const db = Db.get();
    const difference = estimatedCredits - actualCredits;

    const result = await db
      .update(user)
      .set({
        reserved_credits: sql`${user.reserved_credits} - ${estimatedCredits}`,
        credit_balance: sql`${user.credit_balance} + ${difference}`
      })
      .where(
        eq(user.id, userId)
      )
      .returning()

      return result.length > 0;
  }

  static async release(userId: string, estimatedCredits: number) {
    const db = Db.get();
    await db
      .update(user)
      .set({ 
        reserved_credits: sql`${user.reserved_credits} - ${estimatedCredits}`,
        credit_balance: sql`${user.credit_balance} + ${estimatedCredits}`
      })
      .where(eq(user.id, userId))
  }

  static calculate(
    modelId: string,
    inputTokens: number,
    outputToken: number,
  ) {
    try {
      const model = Model.getModel(modelId);

      const cost =
        (inputTokens / 1_000_000) * model.inputRateUSD +
        (outputToken / 1_000_000) * model.outputRateUSD;
      return Math.max(1, Math.ceil(cost / Credit.CREDIT_VALUE));
    } catch (error) {
      throw error;
    }
  }

  static calculateImageCredits(modelId: string) {
    const model = Model.getModel(modelId);
    if (!model.imageRateUSD) {
      throw new Error(`Model ${modelId} does not have image rate configured`);
    }
    return Math.max(1, Math.ceil(model.imageRateUSD / Credit.CREDIT_VALUE));
  }
}
