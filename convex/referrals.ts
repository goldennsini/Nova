import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createReferralCode = mutation({
args: {},
returns: v.string(),
handler: async (ctx) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

const existing = await ctx.db
.query("referrals")
.withIndex("by_referralCode", (q) => q.eq("referralCode", referralCode))
.unique();

if (existing) {
return referralCode;
}

await ctx.db.insert("referrals", {
referrerId: userData._id,
referralCode: referralCode,
status: "pending",
createdAt: Date.now(),
});

return referralCode;
},
});

export const getReferralCode = query({
args: {},
returns: v.optional(v.string()),
handler: async (ctx) => {
const user = await ctx.auth.getUserIdentity();
if (!user) return null;

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) return null;

const referral = await ctx.db
.query("referrals")
.withIndex("by_referrerId", (q) => q.eq("referrerId", userData._id))
.unique();

return referral?.referralCode || null;
},
});

export const getReferralStats = query({
args: {},
returns: v.optional(
v.object({
totalReferred: v.number(),
totalEarned: v.number(),
referrals: v.array(
v.object({
status: v.union(
v.literal("pending"),
v.literal("signed_up"),
v.literal("first_unlock")
),
count: v.number(),
})
),
})
),
handler: async (ctx) => {
const user = await ctx.auth.getUserIdentity();
if (!user) return null;

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) return null;

const referrals = await ctx.db
.query("referrals")
.withIndex("by_referrerId", (q) => q.eq("referrerId", userData._id))
.collect();

const statuses = {
pending: 0,
signed_up: 0,
first_unlock: 0,
};

referrals.forEach((referral) => {
statuses[referral.status]++;
});

const totalEarned =
statuses.signed_up * 10 + statuses.first_unlock * 30;

return {
totalReferred: referrals.filter(
(r) => r.status === "signed_up" || r.status === "first_unlock"
).length,
totalEarned: totalEarned,
referrals: [
{ status: "pending" as const, count: statuses.pending },
{ status: "signed_up" as const, count: statuses.signed_up },
{ status: "first_unlock" as const, count: statuses.first_unlock },
],
};
},
});

export const applyReferralReward = mutation({
args: { amount: v.number() },
returns: v.null(),
handler: async (ctx, { amount }) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

let wallet = await ctx.db
.query("wallets")
.withIndex("by_userId", (q) => q.eq("userId", userData._id))
.unique();

if (!wallet) {
const walletId = await ctx.db.insert("wallets", {
userId: userData._id,
balance: amount,
updatedAt: Date.now(),
});
wallet = await ctx.db.get(walletId);
if (!wallet) throw new Error("Wallet creation failed");
} else {
await ctx.db.patch(wallet._id, {
balance: wallet.balance + amount,
updatedAt: Date.now(),
});
}

await ctx.db.insert("transactions", {
userId: userData._id,
type: "reward",
amount: amount,
description: "Referral reward earned",
createdAt: Date.now(),
});

return null;
},
});
