import React, { useState, useEffect } from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
Image,
ActivityIndicator,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../lib/theme";

const HomeScreen = ({ navigation }: any) => {
const currentUser = useQuery(api.users.getCurrentUser);
const walletData = useQuery(api.wallet.getWallet);
const books = useQuery(api.books.listBooks, { limit: 10 });
const streak = useQuery(api.gamification.getOrCreateStreak);

const categories = [
"Romance",
"Thriller",
"Fantasy",
"Mystery",
"Comedy",
"Drama",
"Action",
];

return (
<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
<View style={styles.header}>
<View>
<Text style={styles.greeting}>Hi, {currentUser?.username || "Reader"}</Text>
<Text style={styles.date}>
{new Date().toLocaleDateString("en-US", {
weekday: "long",
month: "short",
day: "numeric",
})}
</Text>
</View>
<TouchableOpacity 
style={styles.walletPill}
onPress={() => navigation.navigate("Wallet")}
>
<Ionicons name="wallet" size={16} color={colors.white} />
<Text style={styles.walletText}>₦{walletData?.balance || 0}</Text>
</TouchableOpacity>
</View>

<View style={styles.streakCard}>
<Ionicons name="flame" size={32} color={colors.warning} />
<View style={styles.streakInfo}>
<Text style={styles.streakLabel}>Reading Streak</Text>
<Text style={styles.streakValue}>{streak?.currentStreak || 0} days</Text>
</View>
<View style={styles.levelBadge}>
<Text style={styles.levelText}>Level {streak?.level || 1}</Text>
</View>
</View>

<View style={styles.searchSection}>
<TouchableOpacity style={styles.searchBar}>
<Ionicons name="search" size={20} color={colors.softGray} />
<Text style={styles.searchPlaceholder}>Search books, authors...</Text>
</TouchableOpacity>
</View>

<View style={styles.categoriesSection}>
<ScrollView 
horizontal 
showsHorizontalScrollIndicator={false}
contentContainerStyle={styles.categoriesContainer}
>
{categories.map((category) => (
<TouchableOpacity 
key={category}
style={styles.categoryPill}
onPress={() => navigation.navigate("DiscoverTab")}
>
<Text style={styles.categoryText}>{category}</Text>
</TouchableOpacity>
))}
</ScrollView>
</View>

<View style={styles.section}>
<View style={styles.sectionHeader}>
<Text style={styles.sectionTitle}>Featured Books</Text>
<TouchableOpacity>
<Text style={styles.seeAll}>See all</Text>
</TouchableOpacity>
</View>

{books ? (
<View style={styles.booksGrid}>
{books.slice(0, 4).map((book) => (
<TouchableOpacity
key={book._id}
style={styles.bookCard}
onPress={() =>
navigation.navigate("BookDetails", { bookId: book._id })
}
>
<View style={styles.bookCoverContainer}>
<Image
source={{ uri: book.coverImage }}
style={styles.bookCover}
/>
</View>
<Text style={styles.bookTitle} numberOfLines={2}>
{book.title}
</Text>
<Text style={styles.bookCategory}>{book.category}</Text>
</TouchableOpacity>
))}
</View>
) : (
<ActivityIndicator color={colors.primary} />
)}
</View>

<View style={styles.section}>
<View style={styles.sectionHeader}>
<Text style={styles.sectionTitle}>Continue Reading</Text>
</View>
<View style={styles.continueCard}>
<Ionicons name="book" size={40} color={colors.primary} />
<Text style={styles.continueText}>No books in progress</Text>
<Text style={styles.continueSubtext}>Start reading to see your progress here</Text>
</View>
</View>
</ScrollView>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.white,
paddingHorizontal: spacing.lg,
},
header: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
marginTop: spacing.lg,
marginBottom: spacing.xl,
},
greeting: {
...typography.h2,
color: colors.dark,
},
date: {
...typography.sm,
color: colors.softGray,
marginTop: spacing.xs,
},
walletPill: {
backgroundColor: colors.primary,
flexDirection: "row",
alignItems: "center",
paddingHorizontal: spacing.md,
paddingVertical: spacing.sm,
borderRadius: 999,
gap: spacing.sm,
},
walletText: {
...typography.sm,
color: colors.white,
fontWeight: "600",
},
streakCard: {
backgroundColor: colors.cardBg,
borderRadius: 12,
padding: spacing.lg,
flexDirection: "row",
alignItems: "center",
marginBottom: spacing.xl,
},
streakInfo: {
flex: 1,
marginLeft: spacing.lg,
},
streakLabel: {
...typography.sm,
color: colors.softGray,
},
streakValue: {
...typography.h3,
color: colors.dark,
marginTop: spacing.xs,
},
levelBadge: {
backgroundColor: colors.primary,
paddingHorizontal: spacing.md,
paddingVertical: spacing.sm,
borderRadius: 999,
},
levelText: {
...typography.xs,
color: colors.white,
fontWeight: "600",
},
searchSection: {
marginBottom: spacing.xl,
},
searchBar: {
backgroundColor: colors.cardBg,
borderRadius: 12,
paddingHorizontal: spacing.md,
height: 48,
flexDirection: "row",
alignItems: "center",
},
searchPlaceholder: {
...typography.body,
color: colors.softGray,
marginLeft: spacing.md,
},
categoriesSection: {
marginBottom: spacing.xl,
},
categoriesContainer: {
gap: spacing.md,
},
categoryPill: {
backgroundColor: colors.cardBg,
paddingHorizontal: spacing.md,
paddingVertical: spacing.sm,
borderRadius: 999,
borderWidth: 1,
borderColor: colors.lightBorder,
},
categoryText: {
...typography.sm,
color: colors.dark,
fontWeight: "500",
},
section: {
marginBottom: spacing.xl,
},
sectionHeader: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
marginBottom: spacing.lg,
},
sectionTitle: {
...typography.h3,
color: colors.dark,
},
seeAll: {
...typography.sm,
color: colors.primary,
fontWeight: "600",
},
booksGrid: {
flexDirection: "row",
flexWrap: "wrap",
gap: spacing.md,
},
bookCard: {
width: "48%",
},
bookCoverContainer: {
aspectRatio: 0.7,
marginBottom: spacing.md,
},
bookCover: {
width: "100%",
height: "100%",
borderRadius: 8,
},
bookTitle: {
...typography.sm,
color: colors.dark,
fontWeight: "600",
marginBottom: spacing.xs,
},
bookCategory: {
...typography.xs,
color: colors.softGray,
},
continueCard: {
backgroundColor: colors.cardBg,
borderRadius: 12,
padding: spacing.lg,
alignItems: "center",
justifyContent: "center",
},
continueText: {
...typography.body,
color: colors.dark,
fontWeight: "600",
marginTop: spacing.md,
},
continueSubtext: {
...typography.sm,
color: colors.softGray,
marginTop: spacing.sm,
},
});

export default HomeScreen;
