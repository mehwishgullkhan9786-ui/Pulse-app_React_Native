import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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

export default function Login() {
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
      ["rgba(0, 255, 178, 0.1)", "rgba(0, 255, 178, 0.2)"],
    ),
  }));

  return (
    <View style={styles.container}>
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

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#0D1F18", "#091410", "#04040A"]}
          locations={[0, 0.6, 1]}
          style={styles.topHalf}
        >
          <View style={styles.iconBoxOuter}>
            <Animated.View style={[styles.glowBall, animatedIconGlow]} />
            <LinearGradient
              colors={["rgba(10, 20, 20, 0.8)", "rgba(0, 0, 0, 0.9)"]}
              style={styles.iconBox}
            >
              <View style={styles.glassShine} />
              <MaterialCommunityIcons name="flash" size={42} color="#FF9F66" />
            </LinearGradient>
          </View>
          <Text style={styles.brandText}>PULSE</Text>
        </LinearGradient>

        <View style={styles.formContent}>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>SIGN IN TO CONTINUE</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>USERNAME</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputIco}>👤</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Mehwish_Gull"
                placeholderTextColor="#6060A0"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputIco}>🔒</Text>
              <TextInput
                style={[styles.inputBox, styles.inputBoxFocused]}
                placeholder="••••••••"
                placeholderTextColor="#6060A0"
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.loginOptions}>
            <View style={styles.rememberRow}>
              <View style={styles.toggle}>
                <View style={styles.toggleInner} />
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.forgotLink}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient
              colors={["#00FFB2", "#00C8FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaBtn}
            >
              <Text style={styles.ctaText}>LOGIN →</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={styles.signupBold}>Register →</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04040A",
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
  body: {
    flexGrow: 1,
  },
  topHalf: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxOuter: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  glowBall: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: "#00FFB2",
    shadowOffset: { width: 0, height: 0 },
  },
  iconBox: {
    width: 85,
    height: 85,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
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
  brandText: {
    fontSize: 56,
    fontWeight: "900",
    color: "#00FFB2",
    letterSpacing: 8,
    fontFamily: "SpaceGrotesk",
  },
  formContent: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#EEEEFF",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    color: "#6060A0",
    letterSpacing: 1.5,
    marginBottom: 36,
    textTransform: "uppercase",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#6060A0",
    marginBottom: 10,
    fontWeight: "bold",
  },
  inputWrap: {
    position: "relative",
    justifyContent: "center",
  },
  inputIco: {
    position: "absolute",
    left: 18,
    fontSize: 18,
    zIndex: 1,
  },
  inputBox: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 16,
    paddingVertical: 18,
    paddingRight: 20,
    paddingLeft: 50,
    color: "#EEEEFF",
    fontSize: 16,
  },
  inputBoxFocused: {
    borderColor: "rgba(0,255,178,0.5)",
  },
  loginOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    marginTop: 10,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toggle: {
    width: 40,
    height: 22,
    borderRadius: 12,
    backgroundColor: "#00FFB2",
    padding: 3,
    justifyContent: "center",
  },
  toggleInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#04040A",
    alignSelf: "flex-end",
  },
  rememberText: {
    fontSize: 14,
    color: "#6060A0",
    fontWeight: "500",
  },
  forgotLink: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00FFB2",
    textDecorationLine: "underline",
  },
  ctaBtn: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  ctaText: {
    fontSize: 18,
    letterSpacing: 3,
    color: "#04040A",
    fontWeight: "900",
  },
  signupText: {
    textAlign: "center",
    fontSize: 14,
    color: "#6060A0",
  },
  signupBold: {
    color: "#00FFB2",
    fontWeight: "bold",
  },
});
