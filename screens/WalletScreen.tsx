import React, { useState } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView,
Alert,
ActivityIndicator,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../lib/theme";

const depositAmounts = [100, 500, 1000, 2000];

const WalletScreen = ({ navigation }: any) => {
const wallet = useQuery(api.wallet.getWallet);
const transactions = useQuery(api.wallet.getTransactionHistory, { limit: 10 });
const depositFunds = useMutation(api.wallet.depositFunds);
const [loading, setLoading] = useState(false);

const handleDeposit = async (amount: number) => {
setLoading(true);
try {
await depositFunds({ amount });
Alert.alert("Success", `Added ₦${amount} to your wallet!`);
} catch (error: any) {
Alert.alert("Error", error.message);
} finally {
setLoading(false);
}
};

return (
<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
<View style={styles.header}>
<TouchableOpacity
style={styles.backButton}
onPress={() => navigation.goBack()}
>
<Ionicons name="arrow-back" size={24} color={colors.dark} />
</TouchableOpacity>
<Text style={styles.title}>Wallet</Text>
<View style={{ width: 40 }} />
</View>

<View style={styles.balanceCard}>
<Ionicons name="wallet" size={40} color={colors.white} />
<Text style={styles.balanceLabel}>Current Balance</Text>
<Text style={styles.balance}>₦{wallet?.balance || 0}</Text>
</View>

<View style={styles.section}>
<Text style={styles.sectionTitle}>Quick Deposit</Text>
<View style={styles.depositsGrid}>
{depositAmounts.map((amount) => (
<TouchableOpacity
key={amount}
style={styles.depositButton}
onPress={() => handleDeposit(amount)}
disabled={loading}
>
<Text style={styles.depositText}>+₦{amount}</Text>
</TouchableOpacity>
))}
</View>
</View>

<View style={styles.section}>
<Text style={styles.sectionTitle}>Transaction History</Text>
{transactions && transactions.length > 0 ? (
transactions.map((transaction: any) => (
<View key={transaction._id} style={styles.transactionItem}>
<View style={styles.transactionLeft}>
<View
style={[
styles.transactionIcon,
transaction.type === "deposit"
? styles.depositIcon
: styles.spendIcon,
]}
>
<Ionicons
name={
transaction.type === "deposit"
? "arrow-down"
: "arrow-up"
}
size={16}
color={colors.white}
/>
</View>
<View>
<Text style={styles.transactionTitle}>
{transaction.description}
</Text>
<Text style={styles.transactionDate}>
{new Date(transaction.createdAt).toLocaleDateString()}
</Text>
</View>
</View>
<Text
style={[
styles.transactionAmount,
transaction.amount > 0 &&
styles.transactionAmountPositive,
]}
>
{transaction.amount > 0 ? "+" : ""}₦{transaction.amount}
</Text>
</View>
))
) : (
<Text style={styles.noTransactions}>No transactions yet</Text>
)}
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
backButton: {
width: 40,
height: 40,
justifyContent: "center",
alignItems: "center",
},
title: {
...typography.h2,
color: colors.dark,
},
balanceCard: {
backgroundColor: colors.primary,
marginHorizontal: spacing.lg,
marginVertical: spacing.lg,
paddingVertical: spacing.xl,
paddingHorizontal: spacing.lg,
borderRadius: 16,
alignItems: "center",
},
balanceLabel: {
...typography.sm,
color: "rgba(255,255,255,0.8)",
marginTop: spacing.md,
},
balance: {
...typography.h1,
color: colors.white,
marginTop: spacing.md,
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
depositsGrid: {
flexDirection: "row",
flexWrap: "wrap",
gap: spacing.md,
},
depositButton: {
flex: 1,
minWidth: "48%",
backgroundColor: colors.cardBg,
borderWidth: 2,
borderColor: colors.primary,
borderRadius: 12,
paddingVertical: spacing.lg,
alignItems: "center",
},
depositText: {
...typography.body,
color: colors.primary,
fontWeight: "600",
},
transactionItem: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
paddingVertical: spacing.md,
borderBottomWidth: 1,
borderBottomColor: colors.lightBorder,
},
transactionLeft: {
flexDirection: "row",
alignItems: "center",
flex: 1,
},
transactionIcon: {
width: 40,
height: 40,
borderRadius: 20,
justifyContent: "center",
alignItems: "center",
marginRight: spacing.md,
},
depositIcon: {
backgroundColor: colors.success,
},
spendIcon: {
backgroundColor: colors.error,
},
transactionTitle: {
...typography.sm,
color: colors.dark,
fontWeight: "600",
},
transactionDate: {
...typography.xs,
color: colors.softGray,
marginTop: spacing.xs,
},
transactionAmount: {
...typography.body,
color: colors.dark,
fontWeight: "600",
},
transactionAmountPositive: {
color: colors.success,
},
noTransactions: {
...typography.body,
color: colors.softGray,
textAlign: "center",
paddingVertical: spacing.xl,
},
});

export default WalletScreen;
