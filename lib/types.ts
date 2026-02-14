export interface Book {
_id: string;
title: string;
coverImage: string;
category: string;
tags: string[];
summary: string;
unlockPrice: number;
authorId: string;
}

export interface Chapter {
_id: string;
bookId: string;
chapterNumber: number;
title: string;
content: string;
isFree: boolean;
wordCount: number;
}

export interface User {
_id: string;
username: string;
profileImage?: string;
bio?: string;
}

export interface Wallet {
_id: string;
balance: number;
}

export interface Streak {
_id: string;
currentStreak: number;
longestStreak: number;
level: number;
xp: number;
}

export interface Badge {
_id: string;
badgeType: string;
earnedAt: number;
}
