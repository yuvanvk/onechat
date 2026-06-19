import { Db } from "./Db";
import { Model } from "./Model";
import { eq } from "drizzle-orm";
import { user } from "@workspace/db";

export class User {

  static async getUser(userId: string) {
    const db = Db.get();
    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });
    return existingUser;
  }

  static async getUserCredits(userId: string) {
    const db = Db.get();
    const userCredits = await db.query.user.findFirst({
      where: eq(user.id, userId),
      columns: { id: true, credit_balance: true, reserved_credits: true },
    });
    return userCredits;
  }

  static async hasAccess(userId: string, modelId: string): Promise<boolean> {
    const user = await User.getUser(userId);
    const model = Model.getModel(modelId);

    if (model.tier === "free") {
      return true;
    }
    return model.tier === "pro" && user?.plan === "pro";
  }
}
