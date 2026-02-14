import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const UNLOCK_PRICE = 100;

export const getWallet = query({
args: {},
returns: v.optional(
v.object({
_id: v.id("wallets"),
balance: v.number(),
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

const wallet = await ctx.db
.query("wallets")
.withIndex("by_userId", (q) => q.eq("userId", userData._id))
.unique();

if (!wallet) {
const newWalletId = await ctx.db.insert("wallets", {
userId: userData._id,
balance: 0,
updatedAt: Date.now(),
});

return {
_id: newWalletId,
balance: 0,
};
}

return {
_id: wallet._id,
balance: wallet.balance,
};
},
});

export const depositFunds = mutation({
args: { amount: v.number() },
returns: v.number(),
handler: async (ctx, { amount }) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

if (amount <= 0) throw new Error("Amount must be positive");

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
type: "deposit",
amount: amount,
description: `Deposited ₦${amount}`,
createdAt: Date.now(),
});

return wallet.balance + amount;
},
});

export const unlockBook = mutation({
args: { bookId: v.id("books") },
returns: v.boolean(),
handler: async (ctx, { bookId }) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

const book = await ctx.db.get(bookId);
if (!book) throw new Error("Book not found");

const existingUnlock = await ctx.db
.query("unlocks")
.withIndex("by_userId_bookId", (q) =>
q.eq("userId", userData._id).eq("bookId", bookId)
)
.unique();

if (existingUnlock) {
return true;
}

let wallet = await ctx.db
.query("wallets")
.withIndex("by_userId", (q) => q.eq("userId", userData._id))
.unique();

if (!wallet) {
const walletId = await ctx.db.insert("wallets", {
userId: userData._id,
balance: 0,
updatedAt: Date.now(),
});
wallet = await ctx.db.get(walletId);
if (!wallet) throw new Error("Wallet creation failed");
}

if (wallet.balance < UNLOCK_PRICE) {
throw new Error(
`Insufficient balance. Need ₦${UNLOCK_PRICE}, have ₦${wallet.balance}`
);
}

await ctx.db.patch(wallet._id, {
balance: wallet.balance - UNLOCK_PRICE,
updatedAt: Date.now(),
});

await ctx.db.insert("unlocks", {
userId: userData._id,
bookId: bookId,
unlockedAt: Date.now(),
});

await ctx.db.insert("transactions", {
userId: userData._id,
type: "unlock",
amount: -UNLOCK_PRICE,
description: `Unlocked book: ${book.title}`,
relatedId: bookId.toString(),
createdAt: Date.now(),
});

return true;
},
});

export const isBookUnlocked = query({
args: { bookId: v.id("books") },
returns: v.boolean(),
handler: async (ctx, { bookId }) => {
const user = await ctx.auth.getUserIdentity();
if (!user) return false;

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) return false;

const unlock = await ctx.db
.query("unlocks")
.withIndex("by_userId_bookId", (q) =>
q.eq("userId", userData._id).eq("bookId", bookId)
)
.unique();

return !!unlock;
},
});

export const getTransactionHistory = query({
args: { limit: v.optional(v.number()) },
returns: v.array(
v.object({
_id: v.id("transactions"),
type: v.union(
v.literal("deposit"),
v.literal("unlock"),
v.literal("reward")
),
amount: v.number(),
description: v.string(),
createdAt: v.number(),
})
),
handler: async (ctx, args) => {
const user = await ctx.auth.getUserIdentity();
if (!user) return [];

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) return [];

const transactions = await ctx.db
.query("transactions")
.withIndex("by_userId", (q) => q.eq("userId", userData._id))
.order("desc")
.take(args.limit || 20);

return transactions.map((t) => ({
_id: t._id,
type: t.type,
amount: t.amount,
description: t.description,
createdAt: t.createdAt,
}));
},
});
