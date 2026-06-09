import { Model } from "./Model";

export class User {

    private static async getUser(userId: string) {
        const user = { tier: "free" };
        return user;
    }

    static async getUserCredits(userId: string) {
        const user = { credit_balance: 1000 };
        return user;
    }

    static async userHasAccess(userId: string, modelId: string) {
        const user = await User.getUser(userId);
        const model = Model.getModel(modelId);

        return user.tier === model?.minTier
    }
}