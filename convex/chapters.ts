import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listChapters = query({
args: { bookId: v.id("books") },
returns: v.array(
v.object({
_id: v.id("chapters"),
bookId: v.id("books"),
chapterNumber: v.number(),
title: v.string(),
isFree: v.boolean(),
wordCount: v.number(),
})
),
handler: async (ctx, { bookId }) => {
const chapters = await ctx.db
.query("chapters")
.withIndex("by_bookId", (q) => q.eq("bookId", bookId))
.order("asc")
.collect();

return chapters.map((chapter) => ({
_id: chapter._id,
bookId: chapter.bookId,
chapterNumber: chapter.chapterNumber,
title: chapter.title,
isFree: chapter.isFree,
wordCount: chapter.wordCount,
}));
},
});

export const getChapter = query({
args: { chapterId: v.id("chapters") },
returns: v.optional(
v.object({
_id: v.id("chapters"),
bookId: v.id("books"),
chapterNumber: v.number(),
title: v.string(),
content: v.string(),
isFree: v.boolean(),
wordCount: v.number(),
})
),
handler: async (ctx, { chapterId }) => {
const chapter = await ctx.db.get(chapterId);
if (!chapter) return null;

return {
_id: chapter._id,
bookId: chapter.bookId,
chapterNumber: chapter.chapterNumber,
title: chapter.title,
content: chapter.content,
isFree: chapter.isFree,
wordCount: chapter.wordCount,
};
},
});

export const createChapter = mutation({
args: {
bookId: v.id("books"),
chapterNumber: v.number(),
title: v.string(),
content: v.string(),
isFree: v.boolean(),
},
returns: v.id("chapters"),
handler: async (ctx, args) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

const book = await ctx.db.get(args.bookId);
if (!book) throw new Error("Book not found");
if (book.authorId.toString() !== userData._id.toString())
throw new Error("Unauthorized");

const wordCount = args.content.split(/\s+/).length;

const chapterId = await ctx.db.insert("chapters", {
bookId: args.bookId,
authorId: userData._id,
chapterNumber: args.chapterNumber,
title: args.title,
content: args.content,
isFree: args.isFree,
wordCount: wordCount,
createdAt: Date.now(),
});

return chapterId;
},
});

export const updateChapter = mutation({
args: {
chapterId: v.id("chapters"),
title: v.optional(v.string()),
content: v.optional(v.string()),
isFree: v.optional(v.boolean()),
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

const chapter = await ctx.db.get(args.chapterId);
if (!chapter) throw new Error("Chapter not found");
if (chapter.authorId.toString() !== userData._id.toString())
throw new Error("Unauthorized");

const updates: {
title?: string;
content?: string;
isFree?: boolean;
wordCount?: number;
} = {};

if (args.title) updates.title = args.title;
if (args.content) {
updates.content = args.content;
updates.wordCount = args.content.split(/\s+/).length;
}
if (args.isFree !== undefined) updates.isFree = args.isFree;

await ctx.db.patch(args.chapterId, updates);
return null;
},
});

export const deleteChapter = mutation({
args: { chapterId: v.id("chapters") },
returns: v.null(),
handler: async (ctx, { chapterId }) => {
const user = await ctx.auth.getUserIdentity();
if (!user) throw new Error("Not authenticated");

const userData = await ctx.db
.query("users")
.withIndex("by_email", (q) => q.eq("email", user.email!))
.unique();

if (!userData) throw new Error("User not found");

const chapter = await ctx.db.get(chapterId);
if (!chapter) throw new Error("Chapter not found");
if (chapter.authorId.toString() !== userData._id.toString())
throw new Error("Unauthorized");

await ctx.db.delete(chapterId);
return null;
},
});
