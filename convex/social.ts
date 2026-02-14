import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPost = mutation({
args: {
content: v.string(),
bookId: v.optional(v.id("books")),
},
returns: v.id("posts"),
handler: async (ctx, args) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

const postId = await ctx.db.insert("posts", {
userId: userData._id,
content: args.content,
bookId: args.bookId,
likes: 0,
createdAt: Date.now(),
});

return postId;
},
});

export const listPosts = query({
args: { limit: v.optional(v.number()) },
returns: v.array(
v.object({
_id: v.id("posts"),
content: v.string(),
likes: v.number(),
createdAt: v.number(),
})
),
handler: async (ctx, args) => {
const posts = await ctx.db
.query("posts")
.withIndex("by_createdAt", (q) => q.gte("createdAt", 0))
.order("desc")
.take(args.limit || 20);

return posts.map((post) => ({
_id: post._id,
content: post.content,
likes: post.likes,
createdAt: post.createdAt,
}));
},
});

export const likePost = mutation({
args: { postId: v.id("posts") },
returns: v.null(),
handler: async (ctx, { postId }) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

const post = await ctx.db.get(postId);
if (!post) throw new Error("Post not found");

const existingLike = await ctx.db
.query("postLikes")
.withIndex("by_postId_userId", (q) =>
q.eq("postId", postId).eq("userId", userData._id)
)
.unique();

if (!existingLike) {
await ctx.db.insert("postLikes", {
postId: postId,
userId: userData._id,
createdAt: Date.now(),
});

await ctx.db.patch(postId, {
likes: post.likes + 1,
});
}

return null;
},
});

export const addComment = mutation({
args: {
postId: v.id("posts"),
content: v.string(),
},
returns: v.id("comments"),
handler: async (ctx, args) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

const post = await ctx.db.get(args.postId);
if (!post) throw new Error("Post not found");

const commentId = await ctx.db.insert("comments", {
postId: args.postId,
userId: userData._id,
content: args.content,
createdAt: Date.now(),
});

return commentId;
},
});

export const getComments = query({
args: { postId: v.id("posts") },
returns: v.array(
v.object({
_id: v.id("comments"),
content: v.string(),
createdAt: v.number(),
})
),
handler: async (ctx, { postId }) => {
const comments = await ctx.db
.query("comments")
.withIndex("by_postId", (q) => q.eq("postId", postId))
.order("asc")
.collect();

return comments.map((comment) => ({
_id: comment._id,
content: comment.content,
createdAt: comment.createdAt,
}));
},
});

export const followUser = mutation({
args: { userId: v.id("users") },
returns: v.null(),
handler: async (ctx, { userId }) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");
if (userData._id.toString() === userId.toString())
throw new Error("Cannot follow yourself");

const followingUser = await ctx.db.get(userId);
if (!followingUser) throw new Error("User to follow not found");

const existingFollow = await ctx.db
.query("follows")
.withIndex("by_followerId", (q) => q.eq("followerId", userData._id))
.collect();

const alreadyFollowing = existingFollow.some(
(f) => f.followingId.toString() === userId.toString()
);
if (!alreadyFollowing) {
await ctx.db.insert("follows", {
followerId: userData._id,
followingId: userId,
createdAt: Date.now(),
});
}

return null;
},
});

export const createReview = mutation({
args: {
bookId: v.id("books"),
rating: v.number(),
reviewText: v.optional(v.string()),
},
returns: v.id("reviews"),
handler: async (ctx, args) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

if (args.rating < 1 || args.rating > 5)
throw new Error("Rating must be between 1 and 5");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

const book = await ctx.db.get(args.bookId);
if (!book) throw new Error("Book not found");

const reviewId = await ctx.db.insert("reviews", {
userId: userData._id,
bookId: args.bookId,
rating: args.rating,
reviewText: args.reviewText,
createdAt: Date.now(),
});

return reviewId;
},
});

export const getBookReviews = query({
args: { bookId: v.id("books") },
returns: v.array(
v.object({
_id: v.id("reviews"),
rating: v.number(),
reviewText: v.optional(v.string()),
createdAt: v.number(),
})
),
handler: async (ctx, { bookId }) => {
const reviews = await ctx.db
.query("reviews")
.withIndex("by_bookId", (q) => q.eq("bookId", bookId))
.order("desc")
.collect();

return reviews.map((review) => ({
_id: review._id,
rating: review.rating,
reviewText: review.reviewText,
createdAt: review.createdAt,
}));
},
});
