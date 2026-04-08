import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const pulseValue = useSharedValue(0);

  useEffect(() => {
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedIconGlow = useAnimatedStyle(() => ({
    shadowRadius: interpolate(pulseValue.value, [0, 1], [15, 35]),
    shadowOpacity: interpolate(pulseValue.value, [0, 1], [0.3, 0.6]),
    transform: [{ scale: interpolate(pulseValue.value, [0, 1], [0.98, 1.05]) }],
    backgroundColor: interpolateColor(
      pulseValue.value,
      [0, 1],
      ["rgba(0, 229, 255, 0.1)", "rgba(0, 229, 255, 0.2)"],
    ),
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0C101A", "#141124", "#0A0B10"]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.gridContainer}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLineH, { top: i * 50 }]} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLineV, { left: i * 50 }]} />
          ))}
        </View>
      </View>

      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconBoxOuter}>
            <Animated.View style={[styles.glowBall, animatedIconGlow]} />
            <LinearGradient
              colors={["rgba(20, 25, 35, 0.95)", "rgba(10, 15, 20, 0.98)"]}
              style={styles.iconBox}
            >
              <View style={styles.glassShine} />
              <MaterialCommunityIcons name="flash" size={42} color="#00E5FF" />
            </LinearGradient>
          </View>

          <Text style={styles.welcomeText}>WELCOME TO</Text>
          <Text style={styles.brandText}>PULSE</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>
            Experience the next generation of digital connectivity and
            precision.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("../signup")}
            style={styles.ctaButton}
          >
            <LinearGradient
              colors={["#00E5FF", "#5E35B1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>GET STARTED</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color="#000"
              />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("../login")}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C101A",
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  gridLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#FFFFFF",
    opacity: 0.2,
  },
  gridLineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#FFFFFF",
    opacity: 0.2,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  iconBoxOuter: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  glowBall: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  iconBox: {
    width: 85,
    height: 85,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    overflow: "hidden",
  },
  glassShine: {
    position: "absolute",
    top: -20,
    left: -20,
    width: 40,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    transform: [{ rotate: "45deg" }],
  },
  welcomeText: {
    fontSize: 14,
    color: "#6060A0",
    letterSpacing: 4,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  brandText: {
    fontSize: 68,
    fontWeight: "900",
    color: "#00E5FF",
    letterSpacing: 8,
    marginTop: 10,
    textShadowColor: "rgba(0, 229, 255, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: "#FF2D70",
    marginTop: 20,
    borderRadius: 2,
    shadowColor: "#FF2D70",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  tagline: {
    color: "#8A8D9F",
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
    lineHeight: 24,
    maxWidth: 280,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  ctaButton: {
    width: "100%",
    height: 65,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  buttonText: {
    color: "#04040A",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 4,
  },
  loginLink: {
    padding: 10,
  },
  loginText: {
    color: "#6060A0",
    fontSize: 14,
  },
  loginBold: {
    color: "#00E5FF",
    fontWeight: "bold",
  },
});
