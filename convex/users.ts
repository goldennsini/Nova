import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentUser = query({
args: {},
returns: v.optional(
v.object({
_id: v.id("users"),
email: v.string(),
username: v.string(),
profileImage: v.optional(v.string()),
bio: v.optional(v.string()),
createdAt: v.number(),
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

return {
_id: userData._id,
email: userData.email,
username: userData.username,
profileImage: userData.profileImage,
bio: userData.bio,
createdAt: userData.createdAt,
};
},
});

export const getUserProfile = query({
args: { userId: v.id("users") },
returns: v.optional(
v.object({
_id: v.id("users"),
username: v.string(),
profileImage: v.optional(v.string()),
bio: v.optional(v.string()),
})
),
handler: async (ctx, { userId }) => {
const user = await ctx.db.get(userId);
if (!user) return null;
return {
_id: user._id,
username: user.username,
profileImage: user.profileImage,
bio: user.bio,
};
},
});

export const updateUserProfile = mutation({
args: {
username: v.optional(v.string()),
bio: v.optional(v.string()),
profileImage: v.optional(v.string()),
},
returns: v.id("users"),
handler: async (ctx, args) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

const updates: {
username?: string;
bio?: string;
profileImage?: string;
} = {};

if (args.username) updates.username = args.username;
if (args.bio !== undefined) updates.bio = args.bio;
if (args.profileImage !== undefined)
updates.profileImage = args.profileImage;

await ctx.db.patch(userData._id, updates);
return userData._id;
},
});

export const createUserIfNotExists = mutation({
  args: {},
  returns: v.id("users"),
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user?.email) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", user.email!))
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      email: user.email!,
      username: user.email!.split("@")[0],
      profileImage: user.pictureUrl ?? undefined,
      bio: "",
      createdAt: Date.now(),
    });
  },
});