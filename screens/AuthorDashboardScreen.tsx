import React from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../lib/theme";

const AuthorDashboardScreen = ({ navigation }: any) => {
return (
<ScrollView style={styles.container}>
<View style={styles.header}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Ionicons name="arrow-back" size={24} color={colors.dark} />
</TouchableOpacity>
<Text style={styles.title}>Author Dashboard</Text>
<View style={{ width: 40 }} />
</View>

<View style={styles.statsGrid}>
<View style={styles.statCard}>
<Ionicons name="eye" size={32} color={colors.primary} />
<Text style={styles.statNumber}>1.2K</Text>
<Text style={styles.statLabel}>Total Reads</Text>
</View>
<View style={styles.statCard}>
<Ionicons name="heart" size={32} color={colors.warning} />
<Text style={styles.statNumber}>356</Text>
<Text style={styles.statLabel}>Total Likes</Text>
</View>
</View>

<View style={styles.section}>
<View style={styles.sectionHeader}>
<Text style={styles.sectionTitle}>Your Stories</Text>
<TouchableOpacity>
<Text style={styles.seeAll}>See all</Text>
</TouchableOpacity>
</View>

<View style={styles.storyCard}>
<Ionicons name="book" size={40} color={colors.primary} />
<View style={styles.storyInfo}>
<Text style={styles.storyTitle}>Your First Story</Text>
<Text style={styles.storyStatus}>Draft</Text>
</View>
<Ionicons
name="chevron-forward"
size={24}
color={colors.lightBorder}
/>
</View>
</View>

<View style={styles.section}>
<TouchableOpacity
style={styles.createButton}
onPress={() => navigation.navigate("CreateStory")}
>
<Ionicons name="add-circle" size={24} color={colors.white} />
<Text style={styles.createButtonText}>Create New Story</Text>
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
statsGrid: {
flexDirection: "row",
paddingHorizontal: spacing.lg,
gap: spacing.md,
marginBottom: spacing.xl,
},
statCard: {
flex: 1,
backgroundColor: colors.cardBg,
borderRadius: 12,
padding: spacing.lg,
alignItems: "center",
},
statNumber: {
...typography.h2,
color: colors.primary,
marginTop: spacing.md,
},
statLabel: {
...typography.xs,
color: colors.softGray,
marginTop: spacing.sm,
},
section: {
paddingHorizontal: spacing.lg,
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
storyCard: {
flexDirection: "row",
alignItems: "center",
backgroundColor: colors.cardBg,
borderRadius: 12,
padding: spacing.lg,
gap: spacing.lg,
},
storyInfo: {
flex: 1,
},
storyTitle: {
...typography.body,
color: colors.dark,
fontWeight: "600",
},
storyStatus: {
...typography.xs,
color: colors.warning,
marginTop: spacing.xs,
},
createButton: {
backgroundColor: colors.primary,
paddingVertical: spacing.lg,
borderRadius: 12,
flexDirection: "row",
justifyContent: "center",
alignItems: "center",
gap: spacing.md,
},
createButtonText: {
...typography.body,
color: colors.white,
fontWeight: "600",
},
});

export default AuthorDashboardScreen;
