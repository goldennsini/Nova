import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
...authTables,

// User profiles
userProfiles: defineTable({
userId: v.id("users"),
username: v.string(),
profileImage: v.optional(v.string()),
bio: v.optional(v.string()),
createdAt: v.number(),
}).index("by_userId", ["userId"]),

// Wallets & Transactions
wallets: defineTable({
userId: v.id("users"),
balance: v.number(),
updatedAt: v.number(),
}).index("by_userId", ["userId"]),

transactions: defineTable({
userId: v.id("users"),
type: v.union(v.literal("deposit"), v.literal("unlock"), v.literal("reward")),
amount: v.number(),
description: v.string(),
relatedId: v.optional(v.string()),
createdAt: v.number(),
}).index("by_userId", ["userId"]),

// Books
books: defineTable({
title: v.string(),
authorId: v.id("users"),
coverImage: v.string(),
category: v.string(),
tags: v.array(v.string()),
summary: v.string(),
status: v.union(v.literal("draft"), v.literal("published")),
unlockPrice: v.number(),
createdAt: v.number(),
updatedAt: v.number(),
})
.index("by_authorId", ["authorId"])
.index("by_category", ["category"]),

chapters: defineTable({
bookId: v.id("books"),
authorId: v.id("users"),
chapterNumber: v.number(),
title: v.string(),
content: v.string(),
isFree: v.boolean(),
wordCount: v.number(),
createdAt: v.number(),
})
.index("by_bookId", ["bookId"])
.index("by_bookId_number", ["bookId", "chapterNumber"]),

// Book Interactions
unlocks: defineTable({
userId: v.id("users"),
bookId: v.id("books"),
unlockedAt: v.number(),
})
.index("by_userId_bookId", ["userId", "bookId"])
.index("by_userId", ["userId"]),

readingProgress: defineTable({
userId: v.id("users"),
bookId: v.id("books"),
currentChapter: v.number(),
lastReadAt: v.number(),
totalReadTime: v.number(),
completed: v.boolean(),
})
.index("by_userId_bookId", ["userId", "bookId"])
.index("by_userId", ["userId"]),

bookmarks: defineTable({
userId: v.id("users"),
bookId: v.id("books"),
chapterNumber: v.number(),
createdAt: v.number(),
}).index("by_userId", ["userId"]),

reviews: defineTable({
userId: v.id("users"),
bookId: v.id("books"),
rating: v.number(),
reviewText: v.optional(v.string()),
createdAt: v.number(),
})
.index("by_userId", ["userId"])
.index("by_bookId", ["bookId"]),

// Gamification
streaks: defineTable({
userId: v.id("users"),
currentStreak: v.number(),
longestStreak: v.number(),
lastReadDate: v.number(),
totalReadMinutes: v.number(),
level: v.number(),
xp: v.number(),
}).index("by_userId", ["userId"]),

rewards: defineTable({
userId: v.id("users"),
type: v.string(),
xpReward: v.number(),
walletReward: v.number(),
earnedAt: v.number(),
claimed: v.boolean(),
}).index("by_userId", ["userId"]),

badges: defineTable({
userId: v.id("users"),
badgeType: v.string(),
earnedAt: v.number(),
})
.index("by_userId", ["userId"])
.index("by_userId_badgeType", ["userId", "badgeType"]),

// Social & Community
posts: defineTable({
userId: v.id("users"),
content: v.string(),
bookId: v.optional(v.id("books")),
likes: v.number(),
createdAt: v.number(),
})
.index("by_userId", ["userId"])
.index("by_createdAt", ["createdAt"]),

comments: defineTable({
postId: v.id("posts"),
userId: v.id("users"),
content: v.string(),
createdAt: v.number(),
})
.index("by_postId", ["postId"])
.index("by_userId", ["userId"]),

postLikes: defineTable({
postId: v.id("posts"),
userId: v.id("users"),
createdAt: v.number(),
}).index("by_postId_userId", ["postId", "userId"]),

follows: defineTable({
followerId: v.id("users"),
followingId: v.id("users"),
createdAt: v.number(),
}).index("by_followerId", ["followerId"]),

// Author Features
authors: defineTable({
userId: v.id("users"),
penName: v.string(),
bio: v.string(),
genres: v.array(v.string()),
profileImage: v.string(),
socialLink: v.optional(v.string()),
totalReads: v.number(),
totalLikes: v.number(),
createdAt: v.number(),
}).index("by_userId", ["userId"]),

// Referrals
referrals: defineTable({
referrerId: v.id("users"),
referredUserId: v.optional(v.id("users")),
referralCode: v.string(),
status: v.union(
v.literal("pending"),
v.literal("signed_up"),
v.literal("first_unlock")
),
createdAt: v.number(),
completedAt: v.optional(v.number()),
})
.index("by_referrerId", ["referrerId"])
.index("by_referralCode", ["referralCode"]),

// Daily Challenges & Events
dailyChallenges: defineTable({
userId: v.id("users"),
date: v.string(),
challenge: v.string(),
completed: v.boolean(),
xpReward: v.number(),
completedAt: v.optional(v.number()),
}).index("by_userId_date", ["userId", "date"]),

// Notifications
notifications: defineTable({
userId: v.id("users"),
type: v.string(),
title: v.string(),
message: v.string(),
read: v.boolean(),
relatedId: v.optional(v.string()),
createdAt: v.number(),
})
.index("by_userId", ["userId"])
.index("by_userId_createdAt", ["userId", "createdAt"]),
});
