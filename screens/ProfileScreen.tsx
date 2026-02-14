import React from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView,
Image,
} from "react-native";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../lib/theme";

const ProfileScreen = ({ navigation }: any) => {
const currentUser = useQuery(api.users.getCurrentUser);
const wallet = useQuery(api.wallet.getWallet);
const streak = useQuery(api.gamification.getOrCreateStreak);
const badges = useQuery(api.gamification.getBadges);
const { signOut } = useAuthActions();

return (
<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
<View style={styles.header}>
<Text style={styles.title}>Profile</Text>
</View>

<View style={styles.profileCard}>
<View style={styles.profileImageContainer}>
{currentUser?.profileImage ? (
<Image
source={{ uri: currentUser.profileImage }}
style={styles.profileImage}
/>
) : (
<View style={styles.profileImagePlaceholder}>
<Ionicons name="person" size={40} color={colors.white} />
</View>
)}
</View>
<Text style={styles.username}>{currentUser?.username}</Text>
<Text style={styles.email}>{currentUser?.email}</Text>
</View>

<View style={styles.statsGrid}>
<View style={styles.statBox}>
<Text style={styles.statValue}>{streak?.currentStreak || 0}</Text>
<Text style={styles.statLabel}>Streak Days</Text>
</View>
<View style={styles.statBox}>
<Text style={styles.statValue}>{streak?.level || 1}</Text>
<Text style={styles.statLabel}>Level</Text>
</View>
<View style={styles.statBox}>
<Text style={styles.statValue}>₦{wallet?.balance || 0}</Text>
<Text style={styles.statLabel}>Balance</Text>
</View>
</View>

<View style={styles.section}>
<Text style={styles.sectionTitle}>Badges ({badges?.length || 0})</Text>
<View style={styles.badgesContainer}>
{badges && badges.length > 0 ? (
badges.map((badge: any, index: number) => (
<View key={index} style={styles.badgeItem}>
<Ionicons name="star" size={24} color={colors.warning} />
<Text style={styles.badgeLabel}>{badge.badgeType}</Text>
</View>
))
) : (
<Text style={styles.noBadges}>No badges yet</Text>
)}
</View>
</View>

<View style={styles.section}>
<TouchableOpacity
style={styles.menuItem}
onPress={() => navigation.navigate("Wallet")}
>
<Ionicons name="wallet" size={20} color={colors.primary} />
<Text style={styles.menuText}>Manage Wallet</Text>
<Ionicons
name="chevron-forward"
size={20}
color={colors.lightBorder}
/>
</TouchableOpacity>

<TouchableOpacity
style={styles.menuItem}
onPress={() => navigation.navigate("AuthorDashboard")}
>
<Ionicons name="create" size={20} color={colors.primary} />
<Text style={styles.menuText}>Author Dashboard</Text>
<Ionicons
name="chevron-forward"
size={20}
color={colors.lightBorder}
/>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem}>
<Ionicons name="settings" size={20} color={colors.primary} />
<Text style={styles.menuText}>Settings</Text>
<Ionicons
name="chevron-forward"
size={20}
color={colors.lightBorder}
/>
</TouchableOpacity>

<TouchableOpacity style={styles.menuItem}>
<Ionicons name="help-circle" size={20} color={colors.primary} />
<Text style={styles.menuText}>Help & Support</Text>
<Ionicons
name="chevron-forward"
size={20}
color={colors.lightBorder}
/>
</TouchableOpacity>

<TouchableOpacity
style={[styles.menuItem, styles.logoutItem]}
onPress={() => signOut()}
>
<Ionicons name="log-out" size={20} color={colors.error} />
<Text style={[styles.menuText, { color: colors.error }]}>Sign Out</Text>
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
paddingHorizontal: spacing.lg,
paddingVertical: spacing.lg,
},
title: {
...typography.h1,
color: colors.dark,
},
profileCard: {
alignItems: "center",
marginVertical: spacing.xl,
},
profileImageContainer: {
marginBottom: spacing.lg,
},
profileImage: {
width: 100,
height: 100,
borderRadius: 50,
},
profileImagePlaceholder: {
width: 100,
height: 100,
borderRadius: 50,
backgroundColor: colors.primary,
justifyContent: "center",
alignItems: "center",
},
username: {
...typography.h2,
color: colors.dark,
},
email: {
...typography.sm,
color: colors.softGray,
marginTop: spacing.sm,
},
statsGrid: {
flexDirection: "row",
paddingHorizontal: spacing.lg,
gap: spacing.md,
marginBottom: spacing.xl,
},
statBox: {
flex: 1,
backgroundColor: colors.cardBg,
borderRadius: 12,
padding: spacing.lg,
alignItems: "center",
},
statValue: {
...typography.h2,
color: colors.primary,
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
sectionTitle: {
...typography.h3,
color: colors.dark,
marginBottom: spacing.lg,
},
badgesContainer: {
flexDirection: "row",
flexWrap: "wrap",
gap: spacing.md,
},
badgeItem: {
backgroundColor: colors.cardBg,
borderRadius: 12,
padding: spacing.lg,
alignItems: "center",
width: "31%",
},
badgeLabel: {
...typography.xs,
color: colors.dark,
marginTop: spacing.sm,
textAlign: "center",
},
noBadges: {
...typography.body,
color: colors.softGray,
textAlign: "center",
width: "100%",
paddingVertical: spacing.lg,
},
menuItem: {
flexDirection: "row",
alignItems: "center",
paddingVertical: spacing.lg,
borderBottomWidth: 1,
borderBottomColor: colors.lightBorder,
gap: spacing.md,
},
menuText: {
...typography.body,
color: colors.dark,
flex: 1,
fontWeight: "500",
},
logoutItem: {
borderBottomWidth: 0,
marginTop: spacing.lg,
},
});

export default ProfileScreen;
