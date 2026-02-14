import React, { useState } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
TextInput,
ScrollView,
Alert,
ActivityIndicator,
} from "react-native";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../lib/theme";

const CreateStoryScreen = ({ navigation }: any) => {
const [title, setTitle] = useState("");
const [category, setCategory] = useState("Romance");
const [summary, setSummary] = useState("");
const [loading, setLoading] = useState(false);
const createBook = useMutation(api.books.createBook);

const categories = [
"Romance",
"Thriller",
"Fantasy",
"Mystery",
"Comedy",
"Drama",
"Action",
];

const handleCreate = async () => {
if (!title.trim() || !summary.trim()) {
Alert.alert("Error", "Please fill in all fields");
return;
}

setLoading(true);
try {
await createBook({
title,
coverImage:
"https://images.unsplash.com/photo-1507842217343-583b20dfc4d4?w=400&h=600&fit=crop",
category,
tags: [category],
summary,
unlockPrice: 100,
});
Alert.alert("Success", "Story created!");
navigation.goBack();
} catch (error: any) {
Alert.alert("Error", error.message);
} finally {
setLoading(false);
}
};

return (
<ScrollView style={styles.container}>
<View style={styles.header}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Ionicons name="arrow-back" size={24} color={colors.dark} />
</TouchableOpacity>
<Text style={styles.title}>Create Story</Text>
<View style={{ width: 40 }} />
</View>

<View style={styles.form}>
<Text style={styles.label}>Story Title</Text>
<TextInput
style={styles.input}
placeholder="Enter your story title"
placeholderTextColor={colors.softGray}
value={title}
onChangeText={setTitle}
editable={!loading}
/>

<Text style={styles.label}>Category</Text>
<ScrollView
horizontal
showsHorizontalScrollIndicator={false}
contentContainerStyle={styles.categoriesContainer}
>
{categories.map((cat) => (
<TouchableOpacity
key={cat}
style={[
styles.categoryOption,
category === cat && styles.categoryOptionActive,
]}
onPress={() => setCategory(cat)}
>
<Text
style={[
styles.categoryText,
category === cat && styles.categoryTextActive,
]}
>
{cat}
</Text>
</TouchableOpacity>
))}
</ScrollView>

<Text style={styles.label}>Summary</Text>
<TextInput
style={[styles.input, styles.summaryInput]}
placeholder="Write a brief summary of your story..."
placeholderTextColor={colors.softGray}
value={summary}
onChangeText={setSummary}
editable={!loading}
multiline
numberOfLines={6}
textAlignVertical="top"
/>

<TouchableOpacity
style={styles.createButton}
onPress={handleCreate}
disabled={loading}
>
{loading ? (
<ActivityIndicator color={colors.white} />
) : (
<>
<Ionicons name="create" size={20} color={colors.white} />
<Text style={styles.createButtonText}>Create Story</Text>
</>
)}
</TouchableOpacity>
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
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
paddingHorizontal: spacing.lg,
paddingVertical: spacing.lg,
},
title: {
...typography.h2,
color: colors.dark,
},
form: {
paddingHorizontal: spacing.lg,
paddingBottom: spacing.xl,
},
label: {
...typography.sm,
color: colors.dark,
fontWeight: "600",
marginTop: spacing.lg,
marginBottom: spacing.md,
},
input: {
borderWidth: 1,
borderColor: colors.lightBorder,
borderRadius: 12,
paddingHorizontal: spacing.md,
paddingVertical: spacing.md,
...typography.body,
color: colors.dark,
backgroundColor: colors.cardBg,
},
summaryInput: {
minHeight: 120,
paddingTop: spacing.md,
},
categoriesContainer: {
gap: spacing.md,
paddingVertical: spacing.md,
},
categoryOption: {
borderWidth: 1,
borderColor: colors.lightBorder,
borderRadius: 999,
paddingHorizontal: spacing.md,
paddingVertical: spacing.sm,
backgroundColor: colors.cardBg,
},
categoryOptionActive: {
backgroundColor: colors.primary,
borderColor: colors.primary,
},
categoryText: {
...typography.sm,
color: colors.dark,
fontWeight: "500",
},
categoryTextActive: {
color: colors.white,
},
createButton: {
backgroundColor: colors.primary,
paddingVertical: spacing.lg,
borderRadius: 12,
flexDirection: "row",
justifyContent: "center",
alignItems: "center",
gap: spacing.md,
marginTop: spacing.xl,
},
createButtonText: {
...typography.body,
color: colors.white,
fontWeight: "600",
},
});

export default CreateStoryScreen;
