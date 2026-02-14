import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const REWARD_BRACKETS = {
1: { xp: 10, wallet: 5 },
3: { xp: 25, wallet: 10 },
7: { xp: 50, wallet: 20 },
14: { xp: 100, wallet: 50 },
30: { xp: 200, wallet: 100 },
};

export const getOrCreateStreak = query({
args: {},
returns: v.optional(
v.object({
_id: v.id("streaks"),
currentStreak: v.number(),
longestStreak: v.number(),
level: v.number(),
xp: v.number(),
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

let streak = await ctx.db
.query("streaks")
.withIndex("by_userId", (q) => q.eq("userId", userData._id))
.unique();

if (!streak) {
const streakId = await ctx.db.insert("streaks", {
userId: userData._id,
currentStreak: 0,
longestStreak: 0,
lastReadDate: 0,
totalReadMinutes: 0,
level: 1,
xp: 0,
});

streak = await ctx.db.get(streakId);
if (!streak) return null;
}

return {
_id: streak._id,
currentStreak: streak.currentStreak,
longestStreak: streak.longestStreak,
level: streak.level,
xp: streak.xp,
};
},
});

export const updateReadingProgress = mutation({
args: {
bookId: v.id("books"),
chapterId: v.id("chapters"),
minutesRead: v.number(),
},
returns: v.null(),
handler: async (ctx, args) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

const today = new Date().toISOString().split("T")[0];

let reading = await ctx.db
.query("readingProgress")
.withIndex("by_userId_bookId", (q) =>
q.eq("userId", userData._id).eq("bookId", args.bookId)
)
.unique();

if (!reading) {
reading = await ctx.db.get(
await ctx.db.insert("readingProgress", {
userId: userData._id,
bookId: args.bookId,
currentChapter: 1,
lastReadAt: Date.now(),
totalReadTime: args.minutesRead,
completed: false,
})
);
if (!reading) throw new Error("Reading progress creation failed");
} else {
await ctx.db.patch(reading._id, {
lastReadAt: Date.now(),
totalReadTime: reading.totalReadTime + args.minutesRead,
});
}

let streak = await ctx.db
.query("streaks")
.withIndex("by_userId", (q) => q.eq("userId", userData._id))
.unique();

if (!streak) {
const streakId = await ctx.db.insert("streaks", {
userId: userData._id,
currentStreak: 1,
longestStreak: 1,
lastReadDate: Date.now(),
totalReadMinutes: args.minutesRead,
level: 1,
xp: 10,
});
streak = await ctx.db.get(streakId);
if (!streak) throw new Error("Streak creation failed");
} else {
const lastReadDateString = new Date(streak.lastReadDate)
.toISOString()
.split("T")[0];
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
.toISOString()
.split("T")[0];

let newStreak = streak.currentStreak;
if (lastReadDateString !== today) {
if (lastReadDateString === yesterday) {
newStreak = streak.currentStreak + 1;
} else {
newStreak = 1;
}
}

const xpGain = Math.floor(args.minutesRead / 5) * 10;
const newXp = streak.xp + xpGain;
const newLevel = Math.floor(newXp / 100) + 1;

await ctx.db.patch(streak._id, {
currentStreak: newStreak,
longestStreak: Math.max(newStreak, streak.longestStreak),
lastReadDate: Date.now(),
totalReadMinutes: streak.totalReadMinutes + args.minutesRead,
level: newLevel,
xp: newXp,
});
}

return null;
},
});

export const claimStreakReward = mutation({
args: { day: v.number() },
returns: v.null(),
handler: async (ctx, { day }) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

const streak = await ctx.db
.query("streaks")
.withIndex("by_userId", (q) => q.eq("userId", userData._id))
.unique();

if (!streak) throw new Error("Streak not found");
if (streak.currentStreak < day)
throw new Error("Streak not long enough for this reward");

const reward =
REWARD_BRACKETS[day as keyof typeof REWARD_BRACKETS] ||
REWARD_BRACKETS[30];
if (!reward) throw new Error("Invalid reward day");

const existingReward = await ctx.db
.query("rewards")
.withIndex("by_userId", (q) => q.eq("userId", userData._id))
.collect();

const rewardExists = existingReward.some(
(r) => r.type === `streak_${day}` && r.claimed
);
if (rewardExists) throw new Error("Reward already claimed");

await ctx.db.insert("rewards", {
userId: userData._id,
type: `streak_${day}`,
xpReward: reward.xp,
walletReward: reward.wallet,
earnedAt: Date.now(),
claimed: true,
});

let wallet = await ctx.db
.query("wallets")
.withIndex("by_userId", (q) => q.eq("userId", userData._id))
.unique();

if (!wallet) {
const walletId = await ctx.db.insert("wallets", {
userId: userData._id,
balance: reward.wallet,
updatedAt: Date.now(),
});
wallet = await ctx.db.get(walletId);
if (!wallet) throw new Error("Wallet creation failed");
} else {
await ctx.db.patch(wallet._id, {
balance: wallet.balance + reward.wallet,
updatedAt: Date.now(),
});
}

await ctx.db.patch(streak._id, {
xp: streak.xp + reward.xp,
level: Math.floor((streak.xp + reward.xp) / 100) + 1,
});

return null;
},
});

export const earnBadge = mutation({
args: { badgeType: v.string() },
returns: v.null(),
handler: async (ctx, { badgeType }) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

const existingBadge = await ctx.db
.query("badges")
.withIndex("by_userId_badgeType", (q) =>
q.eq("userId", userData._id).eq("badgeType", badgeType)
)
.unique();

if (existingBadge) return null;

await ctx.db.insert("badges", {
userId: userData._id,
badgeType: badgeType,
earnedAt: Date.now(),
});

return null;
},
});

export const getBadges = query({
args: {},
returns: v.array(
v.object({
_id: v.id("badges"),
badgeType: v.string(),
earnedAt: v.number(),
})
),
handler: async (ctx) => {
const user = await ctx.auth.getUserIdentity();
if (!user) return [];

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) return [];

const badges = await ctx.db
.query("badges")
.withIndex("by_userId", (q) => q.eq("userId", userData._id))
.collect();

return badges.map((badge) => ({
_id: badge._id,
badgeType: badge.badgeType,
earnedAt: badge.earnedAt,
}));
},
});
