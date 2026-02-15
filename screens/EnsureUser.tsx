import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function EnsureUser({ children }: { children: React.ReactNode }) {
  const currentUser = useQuery(api.users.getCurrentUser);
  const createUserIfNotExists = useMutation(api.users.createUserIfNotExists);

  useEffect(() => {
    if (currentUser === null) {
      createUserIfNotExists();
    }
  }, [currentUser, createUserIfNotExists]);

  // While convex is loading, currentUser will be undefined
  if (currentUser === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}