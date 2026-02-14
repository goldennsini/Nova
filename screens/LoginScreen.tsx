import React, { useState } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
TextInput,
Alert,
ActivityIndicator,
KeyboardAvoidingView,
Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthActions } from "@convex-dev/auth/react";
import { colors, typography, spacing } from "../lib/theme";

const LoginScreen = ({ navigation }: any) => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const { signIn } = useAuthActions();

const handleLogin = async () => {
if (!email || !password) {
Alert.alert("Error", "Please fill in all fields");
return;
}

setLoading(true);
try {
await signIn("password", { email, password, flow: "signIn" });
} catch (error: any) {
Alert.alert("Login Failed", error.message || "Please try again");
} finally {
setLoading(false);
}
};

return (
<KeyboardAvoidingView 
style={styles.container}
behavior={Platform.OS === "ios" ? "padding" : "height"}
>
<View style={styles.header}>
<Ionicons name="book" size={50} color={colors.primary} />
<Text style={styles.title}>BlueReads</Text>
</View>

<View style={styles.form}>
<Text style={styles.label}>Email</Text>
<View style={styles.inputContainer}>
<Ionicons name="mail" size={20} color={colors.softGray} />
<TextInput
style={styles.input}
placeholder="your@email.com"
value={email}
onChangeText={setEmail}
editable={!loading}
keyboardType="email-address"
autoCapitalize="none"
placeholderTextColor={colors.lightBorder}
/>
</View>

<Text style={styles.label}>Password</Text>
<View style={styles.inputContainer}>
<Ionicons name="lock-closed" size={20} color={colors.softGray} />
<TextInput
style={styles.input}
placeholder="••••••••"
value={password}
onChangeText={setPassword}
editable={!loading}
secureTextEntry={!showPassword}
placeholderTextColor={colors.lightBorder}
/>
<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
<Ionicons 
name={showPassword ? "eye" : "eye-off"} 
size={20} 
color={colors.softGray} 
/>
</TouchableOpacity>
</View>

<TouchableOpacity>
<Text style={styles.forgotPassword}>Forgot password?</Text>
</TouchableOpacity>

<TouchableOpacity 
style={styles.button}
onPress={handleLogin}
disabled={loading}
>
{loading ? (
<ActivityIndicator color={colors.white} />
) : (
<Text style={styles.buttonText}>Sign In</Text>
)}
</TouchableOpacity>
</View>

<View style={styles.footer}>
<Text style={styles.footerText}>Don't have an account? </Text>
<TouchableOpacity onPress={() => navigation.replace("Register")}>
<Text style={styles.footerLink}>Sign Up</Text>
</TouchableOpacity>
</View>
</KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.white,
paddingHorizontal: spacing.lg,
justifyContent: "space-between",
},
header: {
alignItems: "center",
marginTop: spacing.xl,
marginBottom: spacing.xl,
},
title: {
...typography.h1,
color: colors.dark,
marginTop: spacing.md,
},
form: {
flex: 1,
justifyContent: "center",
},
label: {
...typography.sm,
color: colors.dark,
fontWeight: "600",
marginBottom: spacing.sm,
},
inputContainer: {
flexDirection: "row",
alignItems: "center",
borderWidth: 1,
borderColor: colors.lightBorder,
borderRadius: 12,
paddingHorizontal: spacing.md,
marginBottom: spacing.lg,
height: 50,
backgroundColor: colors.cardBg,
},
input: {
flex: 1,
marginHorizontal: spacing.md,
...typography.body,
color: colors.dark,
},
forgotPassword: {
...typography.sm,
color: colors.primary,
fontWeight: "600",
marginBottom: spacing.xl,
},
button: {
backgroundColor: colors.primary,
paddingVertical: spacing.lg,
borderRadius: 999,
alignItems: "center",
marginBottom: spacing.lg,
minHeight: 50,
justifyContent: "center",
},
buttonText: {
...typography.body,
color: colors.white,
fontWeight: "600",
},
footer: {
flexDirection: "row",
justifyContent: "center",
paddingVertical: spacing.lg,
},
footerText: {
...typography.body,
color: colors.softGray,
},
footerLink: {
...typography.body,
color: colors.primary,
fontWeight: "600",
},
});

export default LoginScreen;
