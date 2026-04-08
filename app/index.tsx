import React, { useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const pulseValue = useSharedValue(0);
  const rotateValue = useSharedValue(0);
  const floatValue = useSharedValue(0);

  useEffect(() => {
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    rotateValue.value = withRepeat(
      withTiming(360, { duration: 3500, easing: Easing.linear }),
      -1,
      false,
    );

    floatValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    const timer = setTimeout(() => {
      router.replace("../HomeScreen");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const animatedRotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  const animatedIconGlow = useAnimatedStyle(() => ({
    shadowRadius: interpolate(pulseValue.value, [0, 1], [20, 60]),
    shadowOpacity: interpolate(pulseValue.value, [0, 1], [0.3, 0.7]),
    transform: [{ scale: interpolate(pulseValue.value, [0, 1], [0.95, 1.15]) }],
    backgroundColor: interpolateColor(
      pulseValue.value,
      [0, 1],
      ["rgba(0, 255, 178, 0.1)", "rgba(0, 255, 178, 0.25)"],
    ),
  }));

  const animatedFloating = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatValue.value, [0, 1], [-10, 10]) },
    ],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0C101A", "#141124", "#0A0B10"]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={StyleSheet.absoluteFill}>
        {[...Array(10)].map((_, i) => (
          <View
            key={`v-${i}`}
            style={[styles.gridLineV, { left: (width / 10) * i }]}
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <View
            key={`h-${i}`}
            style={[styles.gridLineH, { top: (height / 15) * i }]}
          />
        ))}
      </View>

      <Animated.View style={[styles.mainContainer, animatedFloating]}>
        <View style={styles.ringWrapper}>
          <Animated.View style={[styles.rotatingSurface, animatedRotation]}>
            <View style={styles.quadrow}>
              <LinearGradient
                colors={["#00E5FF", "#5E35B1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quad}
              />
              <LinearGradient
                colors={["#5E35B1", "#020205"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quad}
              />
            </View>
            <View style={styles.quadrow}>
              <LinearGradient
                colors={["#020205", "#00E5FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quad}
              />
              <LinearGradient
                colors={["#00E5FF", "#00E5FF"]}
                style={styles.quad}
              />
            </View>
          </Animated.View>

          <View style={styles.innerContent}>
            <View style={styles.contentContainer}>
              <View style={styles.iconBoxOuter}>
                <Animated.View style={[styles.glowBall, animatedIconGlow]} />
                <LinearGradient
                  colors={["rgba(20, 25, 35, 0.95)", "rgba(10, 15, 20, 0.98)"]}
                  style={styles.iconBox}
                >
                  <View style={styles.glassShine} />
                  <MaterialCommunityIcons
                    name="flash"
                    size={42}
                    color="#00E5FF"
                  />
                </LinearGradient>
              </View>

              <View>
                <Text style={styles.brandTextGlow}>PULSE</Text>
                <Text style={styles.brandText}>PULSE</Text>
              </View>

              <View style={styles.versionRow}>
                <Text style={styles.versionText}>v3.0.0 — INITIALIZING</Text>
                <View style={styles.loadingBar}>
                  <Animated.View
                    style={[styles.loadingFill, { width: "60%" }]}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C101A",
    justifyContent: "center",
    alignItems: "center",
  },
  gridLineV: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(0, 255, 178, 0.03)",
  },
  gridLineH: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "rgba(0, 255, 178, 0.03)",
  },
  mainContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringWrapper: {
    width: 365,
    height: 365,
    borderRadius: 182.5,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  rotatingSurface: {
    width: 650,
    height: 650,
    position: "absolute",
  },
  quadrow: {
    flex: 1,
    flexDirection: "row",
  },
  quad: {
    flex: 1,
  },
  innerContent: {
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "#0C101A",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxOuter: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  glowBall: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  iconBox: {
    width: 85,
    height: 85,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderTopWidth: 2,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    overflow: "hidden",
  },
  glassShine: {
    position: "absolute",
    top: -20,
    left: -20,
    width: 50,
    height: 150,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    transform: [{ rotate: "45deg" }],
  },
  brandTextGlow: {
    position: "absolute",
    fontSize: 68,
    fontWeight: "900",
    color: "rgba(0, 229, 255, 0.15)",
    letterSpacing: 10,
    fontFamily: "SpaceGrotesk",
    top: -2,
    left: -2,
  },
  brandText: {
    fontSize: 68,
    fontWeight: "900",
    color: "#00E5FF",
    letterSpacing: 10,
    fontFamily: "SpaceGrotesk",
    textShadowColor: "rgba(0, 229, 255, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  versionRow: {
    marginTop: 25,
    alignItems: "center",
  },
  versionText: {
    color: "#8A8D9F",
    fontSize: 10,
    letterSpacing: 6,
    fontWeight: "700",
    fontFamily: "JetBrainsMono",
    marginBottom: 8,
  },
  loadingBar: {
    width: 120,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 1,
    overflow: "hidden",
  },
  loadingFill: {
    height: "100%",
    backgroundColor: "#00E5FF",
    opacity: 0.6,
  },
});
