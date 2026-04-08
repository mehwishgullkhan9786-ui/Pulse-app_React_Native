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
import { Link } from "expo-router";
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
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const router = useRouter();
  
  const pulseValue = useSharedValue(0);
  const aura1X = useSharedValue(0);
  const aura1Y = useSharedValue(0);
  const aura2X = useSharedValue(SCREEN_WIDTH);
  const aura2Y = useSharedValue(300);

  useEffect(() => {
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    aura1X.value = withRepeat(withTiming(SCREEN_WIDTH, { duration: 15000 }), -1, true);
    aura1Y.value = withRepeat(withTiming(400, { duration: 12000 }), -1, true);
    aura2X.value = withRepeat(withTiming(0, { duration: 18000 }), -1, true);
    aura2Y.value = withRepeat(withTiming(-100, { duration: 14000 }), -1, true);
  }, []);

  const aura1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: aura1X.value }, { translateY: aura1Y.value }],
  }));

  const aura2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: aura2X.value }, { translateY: aura2Y.value }],
  }));

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

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !username) {
      alert("Please enter all the fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      console.log("Saving user data to Firestore with UID:", user.uid);
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date(),
        settings: {
          pushNotifications: true,
          emailAlerts: false,
          darkMode: true,
        },
        privacy: {
          biometric: false,
          location: true,
          dataSharing: false,
          adsTracking: false,
          twoFactorEnabled: false,
        }
      });

      console.log("User properties saved to Firestore successfully");

      alert("Account created successfully! Please login.");
      router.replace("../login");
    } catch (error: any) {
      console.error("Critical Signup Error:", error);
      let errorMessage = "Registration failed.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }

      alert(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Dynamic Aura Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={[styles.auraBall, { backgroundColor: 'rgba(0, 229, 255, 0.15)', top: 100, left: -50 }, aura1Style]} />
        <Animated.View style={[styles.auraBall, { backgroundColor: 'rgba(94, 53, 177, 0.15)', bottom: 100, right: -50 }, aura2Style]} />
        
        <View style={styles.gridContainer}>
          {Array.from({ length: 25 }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLineH, { top: i * 40 }]} />
          ))}
          {Array.from({ length: 25 }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLineV, { left: i * 40 }]} />
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#0C101A", "#141124", "#0C101A"]}
          locations={[0, 0.6, 1]}
          style={styles.topHalf}
        >
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
          <Text style={styles.brandText}>PULSE</Text>
        </LinearGradient>

        <View style={styles.formContent}>
          <Text style={styles.heading}>Welcome to Pulse</Text>
          <Text style={styles.subheading}>SIGN UP TO CONTINUE</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>USERNAME</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputIco}>👤</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter your Username"
                placeholderTextColor="#6060A0"
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputIco}>
                <MaterialCommunityIcons
                  name="email"
                  size={20}
                  color="#2473dbff"
                />
              </Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter your Email"
                placeholderTextColor="#6060A0"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputIco}>🔒</Text>
              <TextInput
                style={[styles.inputBox]}
                placeholder="••••••••"
                placeholderTextColor="#6060A0"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputIco}>🔒</Text>
              <TextInput
                style={[styles.inputBox]}
                placeholder="••••••••"
                placeholderTextColor="#6060A0"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          {/* <View style={styles.loginOptions}>
            <View style={styles.rememberRow}>
              <View style={styles.toggle}>
                <View style={styles.toggleInner} />
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.forgotLink}>Forgot password?</Text>
            </TouchableOpacity>
          </View> */}

          <TouchableOpacity activeOpacity={0.8} onPress={handleSignup}>
            <LinearGradient
              colors={["#00E5FF", "#5E35B1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaBtn}
            >
              <Text style={styles.ctaText}>
                CREATE ACCOUNT{" "}
                <MaterialCommunityIcons
                  name="shield-plus-outline"
                  size={22}
                  color="#000"
                />
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Link href="../login">
              <Text style={styles.loginBold}>Login here</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
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
  auraBall: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    filter: 'blur(80px)', 
    opacity: 0.4,
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
    marginBottom: 10,
  },
  glowBall: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
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
  brandText: {
    fontSize: 56,
    fontWeight: "900",
    color: "#00E5FF",
    letterSpacing: 8,
    fontFamily: "SpaceGrotesk",
    textShadowColor: "rgba(0, 229, 255, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
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
    marginTop: -20,
  },
  subheading: {
    fontSize: 14,
    color: "#6060A0",
    letterSpacing: 1.5,
    marginBottom: 36,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#8A8D9F",
    marginBottom: 12,
    fontWeight: "900",
    paddingLeft: 4,
  },
  inputWrap: {
    position: "relative",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    height: 60,
  },
  inputWrapFocused: {
    borderColor: "rgba(0, 229, 255, 0.4)",
    backgroundColor: "rgba(255,255,255,0.06)",
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputIco: {
    position: "absolute",
    left: 20,
    fontSize: 18,
    zIndex: 1,
  },
  inputBox: {
    width: "100%",
    paddingRight: 20,
    paddingLeft: 55,
    color: "#FFF",
    fontSize: 16,
    height: "100%",
    fontFamily: "JetBrainsMono",
  },
  ctaBtn: {
    width: "100%",
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 10,
  },
  ctaText: {
    fontSize: 16,
    letterSpacing: 3,
    color: "#000",
    fontWeight: "900",
    fontFamily: "SpaceGrotesk",
  },
  loginText: {
    textAlign: "center",
    fontSize: 14,
    color: "#8A8D9F",
    fontWeight: "600",
  },
  loginBold: {
    color: "#00E5FF",
    fontWeight: "800",
  },
});
