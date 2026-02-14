import React, { useState } from "react";
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
TextInput,
FlatList,
Alert,
ActivityIndicator,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../lib/theme";

const CommunityFeedScreen = ({ navigation }: any) => {
const [postText, setPostText] = useState("");
const [loading, setLoading] = useState(false);
const posts = useQuery(api.social.listPosts, { limit: 20 });
const createPost = useMutation(api.social.createPost);
const likePost = useMutation(api.social.likePost);

const handleCreatePost = async () => {
if (!postText.trim()) {
Alert.alert("Error", "Post cannot be empty");
return;
}

setLoading(true);
try {
await createPost({ content: postText });
setPostText("");
Alert.alert("Success", "Post created!");
} catch (error: any) {
Alert.alert("Error", error.message);
} finally {
setLoading(false);
}
};

const handleLike = async (postId: string) => {
try {
await likePost({ postId });
} catch (error) {
console.error(error);
}
};

return (
<View style={styles.container}>
<View style={styles.header}>
<Text style={styles.title}>Community</Text>
</View>

<View style={styles.postInputContainer}>
<View style={styles.inputWrapper}>
<TextInput
style={styles.input}
placeholder="Share your thoughts..."
placeholderTextColor={colors.softGray}
value={postText}
onChangeText={setPostText}
multiline
editable={!loading}
/>
<TouchableOpacity
style={styles.sendButton}
onPress={handleCreatePost}
disabled={loading}
>
{loading ? (
<ActivityIndicator color={colors.white} />
) : (
<Ionicons name="send" size={20} color={colors.white} />
)}
</TouchableOpacity>
</View>
</View>

<FlatList
data={posts || []}
renderItem={({ item }: { item: any }) => (
<View style={styles.postCard}>
<View style={styles.postHeader}>
<View style={styles.userAvatar}>
<Ionicons name="person-circle" size={40} color={colors.primary} />
</View>
<View style={styles.postMeta}>
<Text style={styles.userName}>User</Text>
<Text style={styles.postTime}>
{new Date(item.createdAt).toLocaleDateString()}
</Text>
</View>
</View>

<Text style={styles.postContent}>{item.content}</Text>

<View style={styles.postActions}>
<TouchableOpacity
style={styles.actionButton}
onPress={() => handleLike(item._id)}
>
<Ionicons name="heart-outline" size={18} color={colors.softGray} />
<Text style={styles.actionText}>{item.likes}</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.actionButton}>
<Ionicons name="chatbubble-outline" size={18} color={colors.softGray} />
<Text style={styles.actionText}>0</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.actionButton}>
<Ionicons name="share-social-outline" size={18} color={colors.softGray} />
</TouchableOpacity>
</View>
</View>
)}
keyExtractor={(item) => item._id}
scrollEnabled={true}
contentContainerStyle={styles.feedContent}
/>
</View>
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
postInputContainer: {
borderBottomWidth: 1,
borderBottomColor: colors.lightBorder,
padding: spacing.lg,
},
inputWrapper: {
flexDirection: "row",
alignItems: "flex-end",
gap: spacing.md,
},
input: {
flex: 1,
backgroundColor: colors.cardBg,
borderRadius: 12,
paddingHorizontal: spacing.md,
paddingVertical: spacing.md,
...typography.body,
color: colors.dark,
maxHeight: 100,
},
sendButton: {
backgroundColor: colors.primary,
width: 44,
height: 44,
borderRadius: 22,
justifyContent: "center",
alignItems: "center",
},
feedContent: {
paddingHorizontal: spacing.lg,
},
postCard: {
backgroundColor: colors.cardBg,
borderRadius: 12,
padding: spacing.lg,
marginVertical: spacing.md,
},
postHeader: {
flexDirection: "row",
alignItems: "center",
marginBottom: spacing.lg,
},
userAvatar: {
marginRight: spacing.md,
},
postMeta: {
flex: 1,
},
userName: {
...typography.sm,
color: colors.dark,
fontWeight: "600",
},
postTime: {
...typography.xs,
color: colors.softGray,
marginTop: spacing.xs,
},
postContent: {
...typography.body,
color: colors.dark,
lineHeight: 22,
marginBottom: spacing.lg,
},
postActions: {
flexDirection: "row",
justifyContent: "space-around",
borderTopWidth: 1,
borderTopColor: colors.lightBorder,
paddingTopVertical: spacing.md,
marginTop: spacing.lg,
},
actionButton: {
flexDirection: "row",
alignItems: "center",
gap: spacing.sm,
},
actionText: {
...typography.xs,
color: colors.softGray,
},
});

export default CommunityFeedScreen;
