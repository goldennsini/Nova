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
ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthActions } from "@convex-dev/auth/react";
import { colors, typography, spacing } from "../lib/theme";

const RegisterScreen = ({ navigation }: any) => {
const [email, setEmail] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const { signIn } = useAuthActions();

const handleRegister = async () => {
if (!email || !username || !password || !confirmPassword) {
Alert.alert("Error", "Please fill in all fields");
return;
}

if (password !== confirmPassword) {
Alert.alert("Error", "Passwords don't match");
return;
}

if (password.length < 6) {
Alert.alert("Error", "Password must be at least 6 characters");
return;
}

setLoading(true);
try {
await signIn("password", { email, password, flow: "signUp" });
// TODO: Save username to user profile after sign up
} catch (error: any) {
Alert.alert("Registration Failed", error.message || "Please try again");
} finally {
setLoading(false);
}
};

return (
<KeyboardAvoidingView 
style={styles.container}
behavior={Platform.OS === "ios" ? "padding" : "height"}
>
<ScrollView contentContainerStyle={styles.scrollContent}>
<View style={styles.header}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Ionicons name="arrow-back" size={24} color={colors.dark} />
</TouchableOpacity>
</View>

<View style={styles.titleContainer}>
<Text style={styles.title}>Create Account</Text>
<Text style={styles.subtitle}>Join BlueReads today</Text>
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

<Text style={styles.label}>Username</Text>
<View style={styles.inputContainer}>
<Ionicons name="person" size={20} color={colors.softGray} />
<TextInput
style={styles.input}
placeholder="Choose your username"
value={username}
onChangeText={setUsername}
editable={!loading}
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

<Text style={styles.label}>Confirm Password</Text>
<View style={styles.inputContainer}>
<Ionicons name="lock-closed" size={20} color={colors.softGray} />
<TextInput
style={styles.input}
placeholder="••••••••"
value={confirmPassword}
onChangeText={setConfirmPassword}
editable={!loading}
secureTextEntry
placeholderTextColor={colors.lightBorder}
/>
</View>

<TouchableOpacity 
style={styles.button}
onPress={handleRegister}
disabled={loading}
>
{loading ? (
<ActivityIndicator color={colors.white} />
) : (
<Text style={styles.buttonText}>Create Account</Text>
)}
</TouchableOpacity>
</View>

<View style={styles.footer}>
<Text style={styles.footerText}>Already have an account? </Text>
<TouchableOpacity onPress={() => navigation.replace("Login")}>
<Text style={styles.footerLink}>Sign In</Text>
</TouchableOpacity>
</View>
</ScrollView>
</KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.white,
},
scrollContent: {
paddingHorizontal: spacing.lg,
paddingVertical: spacing.lg,
},
header: {
marginBottom: spacing.lg,
},
titleContainer: {
marginBottom: spacing.xl,
},
title: {
...typography.h1,
color: colors.dark,
marginBottom: spacing.sm,
},
subtitle: {
...typography.body,
color: colors.softGray,
},
form: {
marginBottom: spacing.xl,
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
button: {
backgroundColor: colors.primary,
paddingVertical: spacing.lg,
borderRadius: 999,
alignItems: "center",
marginTop: spacing.lg,
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

export default RegisterScreen;
