import React, { useEffect } from "react";
import {
View,
Text,
StyleSheet,
Animated,
useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../lib/theme";

const SplashScreen = ({ navigation }: any) => {
const opacity = new Animated.Value(0);
const scale = new Animated.Value(0.8);

useEffect(() => {
Animated.parallel([
Animated.timing(opacity, {
toValue: 1,
duration: 800,
useNativeDriver: true,
}),
Animated.timing(scale, {
toValue: 1,
duration: 800,
useNativeDriver: true,
}),
]).start();

const timer = setTimeout(() => {
navigation.replace("Onboarding");
}, 2500);

return () => clearTimeout(timer);
}, [navigation]);

return (
<View style={styles.container}>
<Animated.View
style={[
styles.content,
{ opacity, transform: [{ scale }] },
]}
>
<View style={styles.iconContainer}>
<Ionicons name="book" size={60} color={colors.primary} />
</View>
<Text style={styles.title}>BlueReads</Text>
<Text style={styles.subtitle}>Discover Stories. Share Passion.</Text>
</Animated.View>
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.white,
justifyContent: "center",
alignItems: "center",
},
content: {
alignItems: "center",
},
iconContainer: {
marginBottom: spacing.lg,
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
});

export default SplashScreen;
