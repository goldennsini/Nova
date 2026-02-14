import React, { useState } from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
Image,
ActivityIndicator,
Alert,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, shadow } from "../lib/theme";

const BookDetailsScreen = ({ route, navigation }: any) => {
const { bookId } = route.params;
const book = useQuery(api.books.getBook, { bookId });
const isUnlocked = useQuery(api.wallet.isBookUnlocked, { bookId });
const chapters = useQuery(api.chapters.listChapters, { bookId });
const unlockBook = useMutation(api.wallet.unlockBook);
const [loading, setLoading] = useState(false);

const handleUnlock = async () => {
setLoading(true);
try {
await unlockBook({ bookId });
Alert.alert("Success", "Book unlocked!");
} catch (error: any) {
Alert.alert("Error", error.message);
} finally {
setLoading(false);
}
};

if (!book) return <ActivityIndicator color={colors.primary} />;

const freeChapters = chapters?.filter((ch: any) => ch.isFree) || [];
const totalChapters = chapters?.length || 0;

return (
<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
<View style={styles.header}>
<TouchableOpacity
style={styles.backButton}
onPress={() => navigation.goBack()}
>
<Ionicons name="arrow-back" size={24} color={colors.dark} />
</TouchableOpacity>
</View>

<View style={styles.coverContainer}>
<Image source={{ uri: book.coverImage }} style={styles.cover} />
</View>

<View style={styles.content}>
<Text style={styles.title}>{book.title}</Text>

<View style={styles.stats}>
<View style={styles.stat}>
<Ionicons name="book" size={16} color={colors.primary} />
<Text style={styles.statText}>{totalChapters} chapters</Text>
</View>
<View style={styles.stat}>
<Ionicons name="star" size={16} color={colors.warning} />
<Text style={styles.statText}>4.5</Text>
</View>
</View>

<View style={styles.tagsContainer}>
{book.tags.map((tag: string, index: number) => (
<View key={index} style={styles.tag}>
<Text style={styles.tagText}>{tag}</Text>
</View>
))}
</View>

<View style={styles.section}>
<Text style={styles.sectionTitle}>Summary</Text>
<Text style={styles.summary}>{book.summary}</Text>
</View>

<View style={styles.section}>
<Text style={styles.sectionTitle}>
Chapters ({freeChapters.length} free preview)
</Text>
<View style={styles.chaptersList}>
{chapters?.slice(0, 3).map((chapter: any, index: number) => (
<View key={index} style={styles.chapterItem}>
<View style={styles.chapterHeader}>
<Text style={styles.chapterTitle}>
Chapter {chapter.chapterNumber}: {chapter.title}
</Text>
{!chapter.isFree && !isUnlocked && (
<Ionicons name="lock-closed" size={16} color={colors.softGray} />
)}
</View>
<Text style={styles.wordCount}>{chapter.wordCount} words</Text>
</View>
))}
</View>
</View>

<View style={styles.actions}>
{isUnlocked || freeChapters.length > 0 ? (
<TouchableOpacity
style={styles.primaryButton}
onPress={() =>
navigation.navigate("Reader", {
bookId,
startChapter: 1,
})
}
>
<Ionicons name="play" size={20} color={colors.white} />
<Text style={styles.primaryButtonText}>
{isUnlocked ? "Continue Reading" : "Read Preview"}
</Text>
</TouchableOpacity>
) : null}

{!isUnlocked && freeChapters.length === 0 && (
<TouchableOpacity
style={styles.primaryButton}
onPress={handleUnlock}
disabled={loading}
>
{loading ? (
<ActivityIndicator color={colors.white} />
) : (
<>
<Ionicons name="lock-open" size={20} color={colors.white} />
<Text style={styles.primaryButtonText}>
Unlock for ₦{book.unlockPrice}
</Text>
</>
)}
</TouchableOpacity>
)}

<TouchableOpacity style={styles.secondaryButton}>
<Ionicons name="heart-outline" size={20} color={colors.primary} />
<Text style={styles.secondaryButtonText}>Add to Library</Text>
</TouchableOpacity>
</View>
</View>
</ScrollView>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.white,
},
header: {
paddingHorizontal: spacing.lg,
paddingVertical: spacing.md,
},
backButton: {
width: 40,
height: 40,
borderRadius: 8,
backgroundColor: colors.cardBg,
justifyContent: "center",
alignItems: "center",
},
coverContainer: {
paddingHorizontal: spacing.lg,
marginBottom: spacing.xl,
alignItems: "center",
},
cover: {
width: "70%",
aspectRatio: 0.7,
borderRadius: 12,
...shadow.md,
},
content: {
paddingHorizontal: spacing.lg,
paddingBottom: spacing.xl,
},
title: {
...typography.h2,
color: colors.dark,
marginBottom: spacing.md,
},
stats: {
flexDirection: "row",
marginBottom: spacing.lg,
gap: spacing.lg,
},
stat: {
flexDirection: "row",
alignItems: "center",
gap: spacing.sm,
},
statText: {
...typography.sm,
color: colors.softGray,
},
tagsContainer: {
flexDirection: "row",
flexWrap: "wrap",
gap: spacing.sm,
marginBottom: spacing.lg,
},
tag: {
backgroundColor: colors.cardBg,
paddingHorizontal: spacing.md,
paddingVertical: spacing.sm,
borderRadius: 999,
},
tagText: {
...typography.xs,
color: colors.primary,
fontWeight: "600",
},
section: {
marginBottom: spacing.xl,
},
sectionTitle: {
...typography.h3,
color: colors.dark,
marginBottom: spacing.md,
},
summary: {
...typography.body,
color: colors.softGray,
lineHeight: 24,
},
chaptersList: {
gap: spacing.md,
},
chapterItem: {
backgroundColor: colors.cardBg,
padding: spacing.md,
borderRadius: 8,
},
chapterHeader: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
marginBottom: spacing.sm,
},
chapterTitle: {
...typography.sm,
color: colors.dark,
fontWeight: "600",
flex: 1,
},
wordCount: {
...typography.xs,
color: colors.softGray,
},
actions: {
gap: spacing.md,
},
primaryButton: {
backgroundColor: colors.primary,
paddingVertical: spacing.lg,
borderRadius: 12,
flexDirection: "row",
justifyContent: "center",
alignItems: "center",
gap: spacing.md,
},
primaryButtonText: {
...typography.body,
color: colors.white,
fontWeight: "600",
},
secondaryButton: {
borderWidth: 1,
borderColor: colors.primary,
paddingVertical: spacing.lg,
borderRadius: 12,
flexDirection: "row",
justifyContent: "center",
alignItems: "center",
gap: spacing.md,
},
secondaryButtonText: {
...typography.body,
color: colors.primary,
fontWeight: "600",
},
});

export default BookDetailsScreen;
