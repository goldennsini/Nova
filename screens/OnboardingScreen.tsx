import React, { useState } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView,
Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../lib/theme";

const slides = [
{
icon: "book",
title: "Discover Amazing Stories",
description: "Explore thousands of books across all genres and find your next favorite read.",
},
{
icon: "eye",
title: "Read Free Previews",
description: "Start reading books for free and unlock them when you're ready to continue.",
},
{
icon: "lock-open",
title: "Unlock any Book for ₦100",
description: "Affordable access to unlimited reading. Support independent authors.",
},
];

const OnboardingScreen = ({ navigation }: any) => {
const [currentSlide, setCurrentSlide] = useState(0);
const { width } = Dimensions.get("window");

const handleNext = () => {
if (currentSlide < slides.length - 1) {
setCurrentSlide(currentSlide + 1);
} else {
navigation.replace("Login");
}
};

const handleSkip = () => {
navigation.replace("Login");
};

const slide = slides[currentSlide];

return (
<View style={styles.container}>
<View style={styles.header}>
<TouchableOpacity onPress={handleSkip}>
<Text style={styles.skipText}>Skip</Text>
</TouchableOpacity>
</View>

<View style={styles.slideContainer}>
<View style={styles.iconContainer}>
<Ionicons name={slide.icon as any} size={80} color={colors.primary} />
</View>
<Text style={styles.title}>{slide.title}</Text>
<Text style={styles.description}>{slide.description}</Text>
</View>

<View style={styles.indicatorsContainer}>
{slides.map((_, index) => (
<View
key={index}
style={[
styles.indicator,
currentSlide === index && styles.indicatorActive,
]}
/>
))}
</View>

<TouchableOpacity style={styles.button} onPress={handleNext}>
<Text style={styles.buttonText}>
{currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
</Text>
<Ionicons name="arrow-forward" size={20} color={colors.white} />
</TouchableOpacity>
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.white,
paddingHorizontal: spacing.lg,
},
header: {
flexDirection: "row",
justifyContent: "flex-end",
paddingVertical: spacing.lg,
},
skipText: {
...typography.body,
color: colors.primary,
fontWeight: "600",
},
slideContainer: {
flex: 1,
justifyContent: "center",
alignItems: "center",
},
iconContainer: {
marginBottom: spacing.xl,
},
title: {
...typography.h2,
color: colors.dark,
marginBottom: spacing.md,
textAlign: "center",
},
description: {
...typography.body,
color: colors.softGray,
textAlign: "center",
lineHeight: 26,
},
indicatorsContainer: {
flexDirection: "row",
justifyContent: "center",
marginBottom: spacing.xl,
gap: spacing.sm,
},
indicator: {
width: 8,
height: 8,
borderRadius: 4,
backgroundColor: colors.lightBorder,
},
indicatorActive: {
backgroundColor: colors.primary,
width: 24,
},
button: {
backgroundColor: colors.primary,
paddingVertical: spacing.lg,
borderRadius: 999,
flexDirection: "row",
justifyContent: "center",
alignItems: "center",
gap: spacing.md,
marginBottom: spacing.xl,
},
buttonText: {
...typography.body,
color: colors.white,
fontWeight: "600",
},
});

export default OnboardingScreen;
