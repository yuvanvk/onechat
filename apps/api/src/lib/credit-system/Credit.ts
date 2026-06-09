import { models } from "../model-pricing-seed";
import { Model } from "./Model";
import { User } from "./User";

export class Credit {
  private static readonly CREDIT_VALUE = 0.0001;

  static async hasCredits(userId: string, estimatedCredits: number) {
    const user = await User.getUserCredits(userId);
    return user.credit_balance >= estimatedCredits;
  }

  static async reserve(userId: string, creditsToReserve: number) {

  }

  static async deduct(userId: string, creditsToDeduct: number) {

  }

  static async release(userId: string) {

  }

  static async topUp(userId: string) {

  }

  static async grant(userId: string) {

  }

  static calculate(modelId: string, inputTokens: number, outputToken: number) {
    const model = Model.getModel(modelId);

    if (!model) {
      return;
    }

    const cost =
      (inputTokens / 1_000_000) * model.inputRateUSD +
      (outputToken / 1_000_000) * model.outputRateUSD
    return Math.max(1, Math.ceil(cost / Credit.CREDIT_VALUE));
  }
}
