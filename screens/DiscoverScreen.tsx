import React, { useState } from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
FlatList,
Image,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../lib/theme";

const categories = [
"All",
"Romance",
"Thriller",
"Fantasy",
"Mystery",
"Comedy",
"Drama",
"Action",
"Horror",
];

const DiscoverScreen = ({ navigation }: any) => {
const [selectedCategory, setSelectedCategory] = useState("All");
const books = useQuery(api.books.listBooks, {
category: selectedCategory === "All" ? undefined : selectedCategory,
limit: 20,
});

return (
<View style={styles.container}>
<View style={styles.header}>
<Text style={styles.title}>Discover</Text>
</View>

<ScrollView 
horizontal 
showsHorizontalScrollIndicator={false}
contentContainerStyle={styles.categoriesContainer}
style={styles.categoriesScroll}
>
{categories.map((category) => (
<TouchableOpacity
key={category}
style={[
styles.categoryChip,
selectedCategory === category && styles.categoryChipActive,
]}
onPress={() => setSelectedCategory(category)}
>
<Text
style={[
styles.categoryChipText,
selectedCategory === category && styles.categoryChipTextActive,
]}
>
{category}
</Text>
</TouchableOpacity>
))}
</ScrollView>

<FlatList
data={books || []}
renderItem={({ item }: { item: any }) => (
<TouchableOpacity
style={styles.bookRow}
onPress={() =>
navigation.navigate("BookDetails", { bookId: item._id })
}
>
<Image
source={{ uri: item.coverImage }}
style={styles.bookThumbnail}
/>
<View style={styles.bookInfo}>
<Text style={styles.bookTitle} numberOfLines={2}>
{item.title}
</Text>
<View style={styles.tagsContainer}>
{item.tags.slice(0, 2).map((tag: string, index: number) => (
<Text key={index} style={styles.tag}>
{tag}
</Text>
))}
</View>
</View>
<Ionicons
name="chevron-forward"
size={24}
color={colors.lightBorder}
/>
</TouchableOpacity>
)}
keyExtractor={(item) => item._id}
scrollEnabled={true}
contentContainerStyle={styles.listContent}
/>
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.white,
},
header: {
paddingHorizontal: spacing.lg,
paddingVertical: spacing.lg,
},
title: {
...typography.h1,
color: colors.dark,
},
categoriesScroll: {
marginBottom: spacing.lg,
},
categoriesContainer: {
paddingHorizontal: spacing.lg,
gap: spacing.md,
},
categoryChip: {
backgroundColor: colors.cardBg,
paddingHorizontal: spacing.md,
paddingVertical: spacing.sm,
borderRadius: 999,
borderWidth: 1,
borderColor: colors.lightBorder,
},
categoryChipActive: {
backgroundColor: colors.primary,
borderColor: colors.primary,
},
categoryChipText: {
...typography.sm,
color: colors.dark,
fontWeight: "500",
},
categoryChipTextActive: {
color: colors.white,
},
listContent: {
paddingHorizontal: spacing.lg,
},
bookRow: {
flexDirection: "row",
alignItems: "center",
marginBottom: spacing.lg,
},
bookThumbnail: {
width: 60,
height: 90,
borderRadius: 8,
marginRight: spacing.lg,
},
bookInfo: {
flex: 1,
},
bookTitle: {
...typography.body,
color: colors.dark,
fontWeight: "600",
marginBottom: spacing.sm,
},
tagsContainer: {
flexDirection: "row",
gap: spacing.sm,
},
tag: {
...typography.xs,
color: colors.primary,
backgroundColor: colors.cardBg,
paddingHorizontal: spacing.sm,
paddingVertical: spacing.xs,
borderRadius: 4,
},
});

export default DiscoverScreen;
