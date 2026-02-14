import React, { useState, useEffect } from "react";
import {
View,
Text,
StyleSheet,
TouchableOpacity,
ScrollView,
Modal,
Slider,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../lib/theme";

const ReaderScreen = ({ route, navigation }: any) => {
const { bookId, startChapter = 1 } = route.params;
const [currentChapter, setCurrentChapter] = useState(startChapter);
const [fontSize, setFontSize] = useState(18);
const [darkMode, setDarkMode] = useState(false);
const [showSettings, setShowSettings] = useState(false);
const [minutesRead, setMinutesRead] = useState(0);

const chapters = useQuery(api.chapters.listChapters, { bookId });
const chapter = useQuery(api.chapters.getChapter, {
chapterId: chapters?.[currentChapter - 1]?._id || "",
});
const updateProgress = useMutation(api.gamification.updateReadingProgress);

useEffect(() => {
const timer = setInterval(() => {
setMinutesRead((prev) => prev + 1);
}, 60000);

return () => clearInterval(timer);
}, []);

useEffect(() => {
if (minutesRead > 0 && minutesRead % 5 === 0) {
updateProgress({
bookId,
chapterId: chapter?._id || "",
minutesRead: 5,
}).catch(console.error);
}
}, [minutesRead]);

if (!chapter) return null;

const bgColor = darkMode ? "#1a1a1a" : colors.white;
const textColor = darkMode ? colors.white : colors.dark;

return (
<View style={[styles.container, { backgroundColor: bgColor }]}>
<View style={[styles.header, { backgroundColor: bgColor }]}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Ionicons name="arrow-back" size={24} color={textColor} />
</TouchableOpacity>
<Text style={[styles.chapterTitle, { color: textColor }]}>
Chapter {currentChapter}
</Text>
<TouchableOpacity onPress={() => setShowSettings(true)}>
<Ionicons name="settings" size={24} color={textColor} />
</TouchableOpacity>
</View>

<ScrollView
contentContainerStyle={styles.content}
style={{ backgroundColor: bgColor }}
>
<Text
style={[
styles.chapterText,
{
fontSize,
color: textColor,
lineHeight: fontSize * 1.6,
},
]}
>
{chapter.content}
</Text>
</ScrollView>

<View style={[styles.footer, { backgroundColor: bgColor }]}>
<TouchableOpacity
disabled={currentChapter === 1}
onPress={() => setCurrentChapter(Math.max(1, currentChapter - 1))}
>
<Ionicons
name="chevron-back"
size={28}
color={currentChapter === 1 ? colors.lightBorder : textColor}
/>
</TouchableOpacity>
<Text style={[styles.chapterNumber, { color: textColor }]}>
{currentChapter} / {chapters?.length || 0}
</Text>
<TouchableOpacity
disabled={currentChapter === (chapters?.length || 0)}
onPress={() =>
setCurrentChapter(
Math.min(chapters?.length || 0, currentChapter + 1)
)
}
>
<Ionicons
name="chevron-forward"
size={28}
color={
currentChapter === (chapters?.length || 0)
? colors.lightBorder
: textColor
}
/>
</TouchableOpacity>
</View>

<Modal
visible={showSettings}
animationType="slide"
transparent
onRequestClose={() => setShowSettings(false)}
>
<View style={styles.modal}>
<View
style={[styles.modalContent, { backgroundColor: bgColor }]}
>
<View style={styles.modalHeader}>
<Text style={[styles.modalTitle, { color: textColor }]}>
Reader Settings
</Text>
<TouchableOpacity onPress={() => setShowSettings(false)}>
<Ionicons name="close" size={24} color={textColor} />
</TouchableOpacity>
</View>

<View style={styles.setting}>
<Text style={[styles.settingLabel, { color: textColor }]}>
Font Size: {fontSize}
</Text>
<Slider
style={styles.slider}
minimumValue={14}
maximumValue={24}
step={1}
value={fontSize}
onValueChange={setFontSize}
/>
</View>

<View style={styles.setting}>
<Text style={[styles.settingLabel, { color: textColor }]}>
Dark Mode
</Text>
<TouchableOpacity
style={[
styles.toggle,
darkMode && styles.toggleActive,
]}
onPress={() => setDarkMode(!darkMode)}
>
<Ionicons
name={darkMode ? "moon" : "sunny"}
size={20}
color={colors.white}
/>
</TouchableOpacity>
</View>
</View>
</View>
</Modal>
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
},
header: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
paddingHorizontal: spacing.lg,
paddingVertical: spacing.md,
borderBottomWidth: 1,
borderBottomColor: colors.lightBorder,
},
chapterTitle: {
...typography.body,
fontWeight: "600",
},
content: {
padding: spacing.lg,
},
chapterText: {
...typography.reading,
color: colors.dark,
},
footer: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
paddingHorizontal: spacing.lg,
paddingVertical: spacing.md,
borderTopWidth: 1,
borderTopColor: colors.lightBorder,
},
chapterNumber: {
...typography.sm,
fontWeight: "600",
},
modal: {
flex: 1,
backgroundColor: "rgba(0,0,0,0.5)",
justifyContent: "flex-end",
},
modalContent: {
borderTopLeftRadius: 16,
borderTopRightRadius: 16,
padding: spacing.lg,
paddingBottom: spacing.xl,
},
modalHeader: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
marginBottom: spacing.xl,
},
modalTitle: {
...typography.h3,
},
setting: {
marginBottom: spacing.xl,
},
settingLabel: {
...typography.body,
fontWeight: "600",
marginBottom: spacing.md,
},
slider: {
width: "100%",
height: 40,
},
toggle: {
width: 50,
height: 50,
borderRadius: 25,
backgroundColor: colors.lightBorder,
justifyContent: "center",
alignItems: "center",
},
toggleActive: {
backgroundColor: colors.primary,
},
});

export default ReaderScreen;
