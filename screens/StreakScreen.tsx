import React, { useState } from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
Alert,
ActivityIndicator,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../lib/theme";

const rewardTiers = [
{ day: 1, xp: 10, wallet: 5 },
{ day: 3, xp: 25, wallet: 10 },
{ day: 7, xp: 50, wallet: 20 },
{ day: 14, xp: 100, wallet: 50 },
{ day: 30, xp: 200, wallet: 100 },
];

const StreakScreen = ({ navigation }: any) => {
const streak = useQuery(api.gamification.getOrCreateStreak);
const claimReward = useMutation(api.gamification.claimStreakReward);
const [loading, setLoading] = useState(false);

const handleClaimReward = async (day: number) => {
setLoading(true);
try {
await claimReward({ day });
Alert.alert("Success", `Reward claimed!`);
} catch (error: any) {
Alert.alert("Error", error.message);
} finally {
setLoading(false);
}
};

return (
<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
<View style={styles.header}>
<Text style={styles.title}>Streaks & Rewards</Text>
</View>

<View style={styles.streakCard}>
<Ionicons name="flame" size={60} color={colors.warning} />
<Text style={styles.streakNumber}>{streak?.currentStreak || 0}</Text>
<Text style={styles.streakLabel}>Day Streak</Text>
<Text style={styles.longestStreak}>
Longest: {streak?.longestStreak || 0} days
</Text>
</View>

<View style={styles.levelCard}>
<View style={styles.levelLeft}>
<Text style={styles.levelTitle}>Level {streak?.level || 1}</Text>
<View style={styles.xpBar}>
<View
style={[
styles.xpBarFill,
{ width: `${((streak?.xp || 0) % 100)}%` },
]}
/>
</View>
<Text style={styles.xpText}>
{(streak?.xp || 0) % 100} / 100 XP
</Text>
</View>
<View style={styles.xpBadge}>
<Text style={styles.xpValue}>{streak?.xp || 0}</Text>
<Text style={styles.xpLabel}>Total XP</Text>
</View>
</View>

<View style={styles.section}>
<Text style={styles.sectionTitle}>Daily Rewards</Text>
<Text style={styles.sectionSubtitle}>
Reach these milestones to unlock rewards
</Text>

<View style={styles.rewardsContainer}>
{rewardTiers.map((tier, index) => {
const isUnlocked = (streak?.currentStreak || 0) >= tier.day;
return (
<View
key={index}
style={[
styles.rewardTile,
isUnlocked && styles.rewardTileUnlocked,
]}
>
<View style={styles.rewardHeader}>
<Ionicons
name="flame"
size={24}
color={isUnlocked ? colors.warning : colors.lightBorder}
/>
<Text style={[
styles.rewardDay,
isUnlocked && styles.rewardDayUnlocked,
]}>
Day {tier.day}
</Text>
</View>
<View style={styles.rewardDetails}>
<View style={styles.rewardItem}>
<Ionicons
name="star"
size={16}
color={colors.warning}
/>
<Text style={styles.rewardAmount}>+{tier.xp} XP</Text>
</View>
<View style={styles.rewardItem}>
<Ionicons
name="wallet"
size={16}
color={colors.primary}
/>
<Text style={styles.rewardAmount}>+₦{tier.wallet}</Text>
</View>
</View>
{isUnlocked && (
<TouchableOpacity
style={styles.claimButton}
onPress={() => handleClaimReward(tier.day)}
disabled={loading}
>
<Text style={styles.claimText}>Claim</Text>
</TouchableOpacity>
)}
</View>
);
})}
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
paddingVertical: spacing.lg,
},
title: {
...typography.h1,
color: colors.dark,
},
streakCard: {
marginHorizontal: spacing.lg,
marginVertical: spacing.xl,
backgroundColor: colors.cardBg,
borderRadius: 16,
padding: spacing.xl,
alignItems: "center",
},
streakNumber: {
...typography.h1,
color: colors.warning,
marginTop: spacing.md,
},
streakLabel: {
...typography.body,
color: colors.dark,
marginTop: spacing.sm,
},
longestStreak: {
...typography.sm,
color: colors.softGray,
marginTop: spacing.md,
},
levelCard: {
marginHorizontal: spacing.lg,
marginBottom: spacing.xl,
backgroundColor: colors.primary,
borderRadius: 16,
padding: spacing.lg,
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
},
levelLeft: {
flex: 1,
},
levelTitle: {
...typography.h2,
color: colors.white,
},
xpBar: {
width: "100%",
height: 8,
backgroundColor: "rgba(255,255,255,0.2)",
borderRadius: 4,
marginVertical: spacing.md,
},
xpBarFill: {
height: "100%",
backgroundColor: colors.white,
borderRadius: 4,
},
xpText: {
...typography.sm,
color: "rgba(255,255,255,0.9)",
},
xpBadge: {
backgroundColor: "rgba(255,255,255,0.2)",
borderRadius: 12,
padding: spacing.lg,
alignItems: "center",
},
xpValue: {
...typography.h3,
color: colors.white,
},
xpLabel: {
...typography.xs,
color: "rgba(255,255,255,0.8)",
marginTop: spacing.sm,
},
section: {
paddingHorizontal: spacing.lg,
marginBottom: spacing.xl,
},
sectionTitle: {
...typography.h3,
color: colors.dark,
marginBottom: spacing.sm,
},
sectionSubtitle: {
...typography.sm,
color: colors.softGray,
marginBottom: spacing.lg,
},
rewardsContainer: {
gap: spacing.md,
},
rewardTile: {
backgroundColor: colors.cardBg,
borderRadius: 12,
padding: spacing.lg,
borderWidth: 1,
borderColor: colors.lightBorder,
},
rewardTileUnlocked: {
borderColor: colors.primary,
},
rewardHeader: {
flexDirection: "row",
alignItems: "center",
marginBottom: spacing.md,
gap: spacing.md,
},
rewardDay: {
...typography.body,
color: colors.softGray,
fontWeight: "600",
},
rewardDayUnlocked: {
color: colors.dark,
},
rewardDetails: {
flexDirection: "row",
gap: spacing.lg,
},
rewardItem: {
flexDirection: "row",
alignItems: "center",
gap: spacing.sm,
},
rewardAmount: {
...typography.sm,
color: colors.dark,
fontWeight: "600",
},
claimButton: {
marginTop: spacing.md,
backgroundColor: colors.primary,
paddingVertical: spacing.md,
borderRadius: 8,
alignItems: "center",
},
claimText: {
...typography.sm,
color: colors.white,
fontWeight: "600",
},
});

export default StreakScreen;
