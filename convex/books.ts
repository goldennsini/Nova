import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listBooks = query({
args: {
category: v.optional(v.string()),
limit: v.optional(v.number()),
},
returns: v.array(
v.object({
_id: v.id("books"),
title: v.string(),
coverImage: v.string(),
category: v.string(),
tags: v.array(v.string()),
summary: v.string(),
unlockPrice: v.number(),
})
),
handler: async (ctx, args) => {
let query_result = ctx.db
.query("books")
.withIndex("by_category", (q) =>
args.category ? q.eq("category", args.category) : q.eq("status", "published")
)
.order("desc");

if (args.category) {
query_result = ctx.db
.query("books")
.withIndex("by_category", (q) => q.eq("category", args.category))
.order("desc");
} else {
query_result = ctx.db.query("books").order("desc");
}

const books = await query_result.take(args.limit || 20);
return books.map((book) => ({
_id: book._id,
title: book.title,
coverImage: book.coverImage,
category: book.category,
tags: book.tags,
summary: book.summary,
unlockPrice: book.unlockPrice,
}));
},
});

export const getBook = query({
args: { bookId: v.id("books") },
returns: v.optional(
v.object({
_id: v.id("books"),
title: v.string(),
coverImage: v.string(),
category: v.string(),
tags: v.array(v.string()),
summary: v.string(),
unlockPrice: v.number(),
authorId: v.id("users"),
})
),
handler: async (ctx, { bookId }) => {
const book = await ctx.db.get(bookId);
if (!book) return null;
return {
_id: book._id,
title: book.title,
coverImage: book.coverImage,
category: book.category,
tags: book.tags,
summary: book.summary,
unlockPrice: book.unlockPrice,
authorId: book.authorId,
};
},
});

export const createBook = mutation({
args: {
title: v.string(),
coverImage: v.string(),
category: v.string(),
tags: v.array(v.string()),
summary: v.string(),
unlockPrice: v.number(),
},
returns: v.id("books"),
handler: async (ctx, args) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

const bookId = await ctx.db.insert("books", {
title: args.title,
authorId: userData._id,
coverImage: args.coverImage,
category: args.category,
tags: args.tags,
summary: args.summary,
status: "draft",
unlockPrice: args.unlockPrice,
createdAt: Date.now(),
updatedAt: Date.now(),
});

return bookId;
},
});

export const publishBook = mutation({
args: { bookId: v.id("books") },
returns: v.null(),
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
if (book.authorId.toString() !== userData._id.toString())
throw new Error("Unauthorized");

await ctx.db.patch(bookId, {
status: "published",
updatedAt: Date.now(),
});
return null;
},
});

export const getAuthorBooks = query({
args: { authorId: v.id("users") },
returns: v.array(
v.object({
_id: v.id("books"),
title: v.string(),
coverImage: v.string(),
status: v.union(v.literal("draft"), v.literal("published")),
createdAt: v.number(),
})
),
handler: async (ctx, { authorId }) => {
const books = await ctx.db
.query("books")
.withIndex("by_authorId", (q) => q.eq("authorId", authorId))
.order("desc")
.collect();

return books.map((book) => ({
_id: book._id,
title: book.title,
coverImage: book.coverImage,
status: book.status,
createdAt: book.createdAt,
}));
},
});
