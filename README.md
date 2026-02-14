# Nova
A reading and novel posting platform 
# BlueReads - Modern Book Reading + Author Publishing Platform

A comprehensive mobile app for book discovery, reading, community engagement, and author publishing with gamification features.

## Features

### For Readers
- **Book Discovery**: Browse books by category, trending books, featured selections
- **Free Previews**: Read first chapters for free before purchasing
- **Book Unlock**: Pay ₦100 per book to unlock full reading access
- **Digital Reader**: Comfortable reading experience with adjustable font size, dark mode, and page navigation
- **Reading Streaks**: Maintain daily reading streaks and earn rewards
- **Gamification**: 
- Level system with XP progression
- Daily challenges and rewards
- Badges for achievements
- **Wallet System**: Top up balance and purchase books
- **Community Feed**: Share reading moments, like posts, and engage with other readers
- **Reviews & Ratings**: Rate and review books

### For Authors
- **Author Dashboard**: View reading statistics, total likes, and earnings
- **Story Publishing**: Create and publish stories with cover images
- **Chapter Management**: Write and edit chapters with word count tracking
- **Story Status**: Track draft and published stories

### Monetization
- **Pay-Per-Book**: Users pay ₦100 to unlock each book
- **Wallet Top-ups**: Multiple deposit options (₦200, ₦500, ₦1000, ₦2000)
- **Referral System**: Earn ₦10 when friend signs up, ₦30 when they unlock first book
- **Reward System**: Daily login streaks reward XP and wallet credits

## Tech Stack

- **Frontend**: React Native + TypeScript
- **Backend**: Convex Database & Functions
- **Authentication**: Convex Auth (Email + Password)
- **UI Framework**: Custom design with native components
- **Icons**: Expo Vector Icons
- **Navigation**: React Navigation (Stack + Bottom Tabs)

## Project Structure

```
/project
├── App.tsx                    # Main app entry with navigation
├── convex/                    # Backend functions and schema
│   ├── schema.ts             # Database schema
│   ├── auth.ts               # Authentication setup
│   ├── users.ts              # User management
│   ├── books.ts              # Book operations
│   ├── chapters.ts           # Chapter management
│   ├── wallet.ts             # Wallet and payments
│   ├── gamification.ts       # Streaks, levels, badges
│   ├── social.ts             # Community features
│   └── referrals.ts          # Referral system
├── screens/                   # React Native screens
│   ├── SplashScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── DiscoverScreen.tsx
│   ├── BookDetailsScreen.tsx
│   ├── ReaderScreen.tsx
│   ├── WalletScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── StreakScreen.tsx
│   ├── CommunityFeedScreen.tsx
│   ├── AuthorDashboardScreen.tsx
│   └── CreateStoryScreen.tsx
├── lib/
│   ├── theme.ts              # Design system & colors
│   └── types.ts              # TypeScript types
└── .a0/                       # a0 platform config
└── monetization.yaml     # In-app purchase setup
```

## Getting Started

1. **Install dependencies** - Automatic in a0 runtime
2. **Configure Convex** - Schema is synced automatically
3. **Update `.a0/monetization.yaml`** if using IAP for premium features
4. **Deploy** - Click Deploy button to publish over-the-air updates

## Key Features Explained

### Reading Experience
- Users read first 2 chapters free (preview)
- After preview, unlock book for ₦100
- Comfortable typography (18px, line-height 28)
- Adjustable font size, dark mode, page navigation

### Streak System
- Track daily reading (minimum 5 minutes)
- Earn XP and wallet credits based on streak length
- Reward tiers: Day 1 (₦5), Day 3 (₦10), Day 7 (₦20), Day 14 (₦50), Day 30 (₦100)

### Wallet
- Users can deposit funds via simulated payment
- Funds used to unlock books
- Transaction history tracked

### Gamification
- **XP System**: 10 XP per chapter read, levels every 100 XP
- **Badges**: Earn badges for milestones
- **Daily Challenges**: Optional tasks for bonus XP
- **Leaderboards**: (ready for implementation)

### Community
- Share reading moments
- Like and comment on posts
- Follow authors
- Discover trending content

## API Functions

### Users
- `getCurrentUser()` - Get authenticated user
- `getUserProfile(userId)` - Get public profile
- `updateUserProfile()` - Update user info

### Books
- `listBooks(category?, limit?)` - List published books
- `getBook(bookId)` - Get book details
- `createBook()` - Author creates book
- `publishBook(bookId)` - Publish draft
- `getAuthorBooks(authorId)` - Author's stories

### Wallet
- `getWallet()` - Get balance
- `depositFunds(amount)` - Add funds
- `unlockBook(bookId)` - Purchase book
- `isBookUnlocked(bookId)` - Check ownership
- `getTransactionHistory()` - View transactions

### Gamification
- `getOrCreateStreak()` - Streak info
- `updateReadingProgress()` - Track reading
- `claimStreakReward(day)` - Claim rewards
- `earnBadge(badgeType)` - Award badge
- `getBadges()` - User badges

### Social
- `createPost(content, bookId?)` - Create community post
- `listPosts()` - Feed posts
- `likePost(postId)` - Like post
- `addComment(postId, content)` - Comment
- `createReview(bookId, rating, text)` - Review book
- `followUser(userId)` - Follow author

## Design System

**Colors**
- Primary (Teal): #10B7A6
- Dark: #111827
- Soft Gray: #6B7280
- Light Border: #E5E7EB
- Card Background: #F9FAFB
- White: #FFFFFF

**Typography**
- Headings: 18-22px bold
- Body: 14-16px regular
- Reading: 18px line-height 28

**Components**
- Pill buttons (border-radius: 999px)
- Soft shadows
- 12px border radius for cards
- Safe areas respected

## Future Enhancements

1. **Real Payment Integration**: Stripe or Paystack
2. **Advanced Search**: Full-text search with filters
3. **Reading Analytics**: Personalized insights
4. **Writing Tools**: Rich text editor for authors
5. **Audio Books**: Text-to-speech support
6. **Offline Reading**: Cache chapters
7. **Social Features**: DMs, book clubs
8. **Notifications**: Real-time alerts
9. **Analytics Dashboard**: Author insights
10. **Recommendations**: ML-based suggestions

## Customization

### Change App Name
Edit in `.a0/general.yaml` and App.tsx

### Add More Reward Tiers
Edit `convex/gamification.ts` REWARD_BRACKETS

### Adjust Unlock Price
Change `UNLOCK_PRICE = 100` in `convex/wallet.ts`

### Customize Design
Edit `lib/theme.ts` for colors, spacing, typography

## Notes

- App uses Convex for all backend operations
- Authentication via email/password
- Wallet balance managed server-side
- Reading progress synchronized automatically
- No external payment APIs configured yet (ready for integration)

---

**BlueReads** - Where stories come alive. 📚
