import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import TrafficChart from "../../components/TrafficChart";
import RevenueChart from "../../components/RevenueChart";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const translateX = useSharedValue(SCREEN_WIDTH);

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserName(docSnap.data().username);
          } else {
            setUserName(user.displayName || "User");
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      }
      setLoading(false);
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-SCREEN_WIDTH * 2, {
        duration: 12000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const headlineItems = [
    "🚀 MILESTONE: 2.4K ACTIVE USERS REACHED",
    "💸 REVENUE TRENDING UP 12% THIS MONTH",
    "⚡ SYSTEM UPTIME AT 99.9%",
    "📈 GROWTH PROJECTED AT 84% FOR Q2",
    "NEW SYSTEM UPDATE V2.0.4 IS NOW LIVE",
  ];

  const fullText = headlineItems.join("  |  ");

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={["#0C101A", "#141124", "#0A0B10"]}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greetingText}>Welcome back,</Text>
              {loading ? (
                <ActivityIndicator size="small" color="#00E5FF" style={{ alignSelf: 'flex-start', marginTop: 5 }} />
              ) : (
                <Text style={styles.nameText}>{userName || "Pulse User"}</Text>
              )}
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.profileBtn}
                onPress={() => router.push("/Profile")}
              >
                <MaterialCommunityIcons
                  name="account-circle"
                  size={45}
                  color="rgba(255, 255, 255, 0.9)"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headline}>
            <Animated.View style={[styles.tickerContainer, animatedStyle]}>
              <Text style={styles.headlineText}>{fullText}</Text>
            </Animated.View>
          </View>

          {/* Div 1    */}
          <View style={styles.dashboardcontainer}>
            <View style={[styles.dashboarddiv, { borderTopColor: "#00E5FF", borderTopWidth: 3 }]}>
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0)"]}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.dashboarddivleft}>
                <MaterialCommunityIcons
                  name="trending-up"
                  size={35}
                  color="#00E5FF"
                  style={styles.dashboarddivleftIconWrapper}
                />
                <Text style={styles.dashboarddivleftText1}>84%</Text>
                <Text style={styles.dashboarddivleftText2}>Growth</Text>
              </View>
              <View
                style={[
                  styles.dashboarddivright,
                  { backgroundColor: "rgba(0, 229, 255, 0.15)" },
                ]}
              >
                <Text
                  style={[styles.dashboarddivrightText, { color: "#00E5FF" }]}
                >
                  {" "}
                  <MaterialCommunityIcons
                    name="arrow-up"
                    size={15}
                    color="#00E5FF"
                  />
                  12%
                </Text>
              </View>
            </View>

            {/* Div 2    */}
            <View style={[styles.dashboarddiv, { borderTopColor: "#FF2D70", borderTopWidth: 3 }]}>
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0)"]}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.dashboarddivleft}>
                <Text
                  style={{
                    fontSize: 30,
                    height: 35,
                    marginTop: 15,
                    marginBottom: 10,
                  }}
                >
                  💸
                </Text>
                <Text style={styles.dashboarddivleftText1}>$12K</Text>
                <Text style={styles.dashboarddivleftText2}>Revenue</Text>
              </View>
              <View
                style={[
                  styles.dashboarddivright,
                  { backgroundColor: "rgba(255, 45, 112, 0.15)" },
                ]}
              >
                <Text
                  style={[styles.dashboarddivrightText, { color: "#FF2D70" }]}
                >
                  {" "}
                  <MaterialCommunityIcons
                    name="arrow-up"
                    size={15}
                    color="#FF2D70"
                  />
                  8%
                </Text>
              </View>
            </View>

            {/* Div 3    */}
            <View style={[styles.dashboarddiv, { borderTopColor: "#FFB000", borderTopWidth: 3 }]}>
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0)"]}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.dashboarddivleft}>
                <Text
                  style={{
                    fontSize: 30,
                    height: 35,
                    marginTop: 15,
                    marginBottom: 10,
                  }}
                >
                  👥
                </Text>
                <Text style={styles.dashboarddivleftText1}>2.4K</Text>
                <Text style={styles.dashboarddivleftText2}>Users</Text>
              </View>
              <View
                style={[
                  styles.dashboarddivright,
                  { backgroundColor: "rgba(255, 176, 0, 0.15)" },
                ]}
              >
                <Text
                  style={[styles.dashboarddivrightText, { color: "#FFB000" }]}
                >
                  {" "}
                  <MaterialCommunityIcons
                    name="arrow-down"
                    size={15}
                    color="#FFB000"
                  />
                  3%
                </Text>
              </View>
            </View>

            {/* Div 4    */}
            <View style={[styles.dashboarddiv, { borderTopColor: "#7D5FFF", borderTopWidth: 3 }]}>
              <LinearGradient
                colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0)"]}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.dashboarddivleft}>
                <Text
                  style={{
                    fontSize: 26,
                    height: 35,
                    marginTop: 15,
                    marginBottom: 10,
                  }}
                >
                  ⚡
                </Text>
                <Text style={styles.dashboarddivleftText1}>98%</Text>
                <Text style={styles.dashboarddivleftText2}>Uptime</Text>
              </View>
              <View
                style={[
                  styles.dashboarddivright,
                  { backgroundColor: "rgba(125, 95, 255, 0.15)" },
                ]}
              >
                <Text
                  style={[styles.dashboarddivrightText, { color: "#7D5FFF" }]}
                >
                  {" "}
                  <MaterialCommunityIcons
                    name="arrow-up"
                    size={15}
                    color="#7D5FFF"
                  />
                  21%
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.traffic}>
            <Text style={styles.trafficText1}>
              {" "}
              <MaterialCommunityIcons
                name="chart-pie"
                size={16}
                color="#00E5FF"
              />{" "}
              TRAFFIC SOURCES
            </Text>
            <Text style={styles.trafficText2}>
              ALL{" "}
              <MaterialCommunityIcons
                name="arrow-right"
                size={16}
                color="#8A8D9F"
              />
            </Text>
          </View>

          <TrafficChart />

          <RevenueChart />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

import { Platform } from "react-native";
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#0C101A",
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 40 : 10,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
  },
  headerLeft: {
    flexDirection: "column",
  },
  greetingText: {
    fontSize: 14,
    color: "#8A8D9F",
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  nameText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 1,
  },
  headerRight: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileBtn: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "rgba(0, 229, 255, 0.15)",
    borderWidth: 1.5,
    borderColor: "rgba(0, 229, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 12,
  },
  headline: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 18,
    height: 45,
    width: "88%",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  tickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 2000,
  },
  headlineText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#00E5FF",
    paddingHorizontal: 20,
  },
  dashboardcontainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
  },
  dashboarddiv: {
    flexDirection: "row",
    borderRadius: 25,
    padding: 16,
    height: 160,
    width: "47%",
    borderColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.02)",
    overflow: "hidden",
  },
  dashboarddivleft: {
    flex: 1,
    justifyContent: "space-between",
  },
  dashboarddivleftIconWrapper: {
    marginTop: 5,
    marginBottom: 10,
  },
  dashboarddivleftText1: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 5,
  },
  dashboarddivleftText2: {
    fontSize: 13,
    letterSpacing: 1.5,
    color: "#8A8D9F",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  dashboarddivright: {
    position: "absolute",
    right: 12,
    top: 15,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dashboarddivrightText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  traffic: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 10,
    width: "100%",
    marginTop: 10,
  },
  trafficText1: {
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#FFF",
    fontWeight: "700",
  },
  trafficText2: {
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#8A8D9F",
    fontWeight: "700",
  },
});
