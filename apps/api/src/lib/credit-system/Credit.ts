import { creditLedger, getDB, user } from "@workspace/db";
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
    modelId: string,
    conversationId: string,
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

      if (result.length === 0) return false;

      await db.insert(creditLedger).values({
        id: crypto.randomUUID(),
        userId,
        conversationId,
        type: "reserve",
        amount: -creditsToReserve,
        modelId,
        createdAt: new Date(),
      });
  
      return true;

  }

  static async settle(
    userId: string,
    estimatedCredits: number,
    actualCredits: number,
    modelId: string,
    conversationId?: string,
    inputTokens?: number,
    outputTokens?: number,
  ) {
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

      if (result.length === 0) return false;

      const model = Model.getModel(modelId);
      const inputRateUsed = model.inputRateUSD;
      const outputRateUsed = model.outputRateUSD;

      await db.insert(creditLedger).values({
        id: crypto.randomUUID(),
        userId,
        conversationId,
        type: "deduct",
        amount: -actualCredits,
        modelId,
        inputTokens,
        outputTokens,
        inputRateUsed,
        outputRateUsed,
        createdAt: new Date(),
      });
  
      // If estimated > actual, log the refund of the difference
      if (difference > 0) {
        await db.insert(creditLedger).values({
          id: crypto.randomUUID(),
          userId,
          conversationId,
          type: "refund",
          amount: difference,
          modelId,
          createdAt: new Date(),
        });
      }
  
      return true;
  }

  static async release(userId: string, estimatedCredits: number, conversationId: string) {
    const db = Db.get();
    await db
      .update(user)
      .set({ 
        reserved_credits: sql`${user.reserved_credits} - ${estimatedCredits}`,
        credit_balance: sql`${user.credit_balance} + ${estimatedCredits}`
      })
      .where(eq(user.id, userId))

      await db.insert(creditLedger).values({
        id: crypto.randomUUID(),
        userId,
        conversationId,
        type: "release",
        amount: estimatedCredits, // positive — credits returned
        createdAt: new Date(),
      });
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
