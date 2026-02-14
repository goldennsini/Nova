import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "./lib/theme";

import SplashScreen from "./screens/SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import DiscoverScreen from "./screens/DiscoverScreen";
import BookDetailsScreen from "./screens/BookDetailsScreen";
import ReaderScreen from "./screens/ReaderScreen";
import WalletScreen from "./screens/WalletScreen";
import ProfileScreen from "./screens/ProfileScreen";
import StreakScreen from "./screens/StreakScreen";
import CommunityFeedScreen from "./screens/CommunityFeedScreen";
import AuthorDashboardScreen from "./screens/AuthorDashboardScreen";
import CreateStoryScreen from "./screens/CreateStoryScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStackNavigator = createNativeStackNavigator();
const HomeStackNavigator = createNativeStackNavigator();
const DiscoverStackNavigator = createNativeStackNavigator();
const AppStackNavigator = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function AuthStack() {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStackNavigator.Screen name="Splash" component={SplashScreen} />
      <AuthStackNavigator.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStackNavigator.Screen name="Login" component={LoginScreen} />
      <AuthStackNavigator.Screen name="Register" component={RegisterScreen} />
    </AuthStackNavigator.Navigator>
  );
}

function HomeStack() {
  return (
    <HomeStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStackNavigator.Screen name="HomeMain" component={HomeScreen} />
      <HomeStackNavigator.Screen name="BookDetails" component={BookDetailsScreen} />
      <HomeStackNavigator.Screen name="Reader" component={ReaderScreen} />
    </HomeStackNavigator.Navigator>
  );
}

function DiscoverStack() {
  return (
    <DiscoverStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <DiscoverStackNavigator.Screen name="DiscoverMain" component={DiscoverScreen} />
      <DiscoverStackNavigator.Screen name="BookDetails" component={BookDetailsScreen} />
    </DiscoverStackNavigator.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.softGray,
        tabBarStyle: {
          borderTopColor: colors.lightBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DiscoverTab"
        component={DiscoverStack}
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="compass" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CommunityTab"
        component={CommunityFeedScreen}
        options={{
          tabBarLabel: "Community",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="chatbubbles" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StreakTab"
        component={StreakScreen}
        options={{
          tabBarLabel: "Streaks",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="flame" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <NavigationContainer>
        <AuthLoading>
          <LoadingScreen />
        </AuthLoading>

        <Unauthenticated>
          <AuthStack />
        </Unauthenticated>

        <Authenticated>
          <AppStackNavigator.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <AppStackNavigator.Screen
              name="AppTabs"
              component={AppTabs}
              options={{ animationEnabled: false }}
            />
            <AppStackNavigator.Screen
              name="Wallet"
              component={WalletScreen}
              options={{ animationEnabled: true }}
            />
            <AppStackNavigator.Screen
              name="AuthorDashboard"
              component={AuthorDashboardScreen}
              options={{ animationEnabled: true }}
            />
            <AppStackNavigator.Screen
              name="CreateStory"
              component={CreateStoryScreen}
              options={{ animationEnabled: true }}
            />
          </AppStackNavigator.Navigator>
        </Authenticated>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
});