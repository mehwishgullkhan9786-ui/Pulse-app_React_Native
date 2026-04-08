import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
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
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const user = auth.currentUser;

  const pulseValue = useSharedValue(0);
  const aura1X = useSharedValue(0);
  const aura1Y = useSharedValue(0);
  const aura2X = useSharedValue(SCREEN_WIDTH);
  const aura2Y = useSharedValue(300);

  const [settings, setSettings] = useState({
      pushNotifications: true,
      emailAlerts: false,
      darkMode: true,
      autoUpdate: true,
      hapticFeedback: true,
    });

    const toggleSetting = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: newValue }));

    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
          [`settings.${key}`]: newValue,
        });
      } catch (error) {
        console.error("Error updating app setting:", error);
      }
    }
  };

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

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("User logged in successfully", userCredential.user);
      router.push("../(tabs)");
    } catch (error: any) {
      console.log("Error logging in", error);
      let errorMessage = "Invalid email or password.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid login credentials.";
      }
      alert(errorMessage);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent to your email!");
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      alert("Error sending reset link. Please check your email.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={[styles.auraBall, { backgroundColor: 'rgba(0, 229, 255, 0.15)', top: 100, left: -50 }, aura1Style]} />
        <Animated.View style={[styles.auraBall, { backgroundColor: 'rgba(94, 53, 177, 0.15)', bottom: 100, right: -50 }, aura2Style]} />
        
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
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>SIGN IN TO CONTINUE</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputIco}>👤</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter your email"
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

          <View style={styles.loginOptions}>
            <View style={styles.rememberRow}>
              <View style={styles.cardAction}>
                             <Switch
                               trackColor={{ false: "#767577", true: "#17585fff" }}
                               thumbColor={settings.autoUpdate ? "#00E5FF" : "#f4f3f4"}
                               ios_backgroundColor="#3e3e3e"
                               onValueChange={() => toggleSetting("autoUpdate")}
                               value={settings.autoUpdate}
                             />
                           </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </View>
           
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotLink}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
            <LinearGradient
              colors={["#00E5FF", "#5E35B1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaBtn}
            >
              <Text style={styles.ctaText}>
                LOGIN{" "}
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={20}
                  color="#000"
                />
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.socialSpacer}>
            <View style={styles.sepLine} />
            <Text style={styles.sepText}>OR CONTINUE WITH</Text>
            <View style={styles.sepLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <MaterialCommunityIcons name="google" size={24} color="#FFF" />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <MaterialCommunityIcons name="apple" size={24} color="#FFF" />
              <Text style={styles.socialBtnText}>Apple</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.signupText}>
            Don&apos;t have an account?{" "}
            <Link href="../signup">
              <Text style={styles.signupBold}>Join the Pulse</Text>
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
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    filter: "blur(80px)",
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
    marginTop: 0,
    fontFamily: "SpaceGrotesk",
  },
  subheading: {
    fontSize: 14,
    color: "#6060A0",
    letterSpacing: 1.5,
    marginBottom: 36,
    textTransform: "uppercase",
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 12,
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
    left: 18,
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
  loginOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    marginTop: 15,
  gap:40,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
 

  rememberText: {
    fontSize: 14,
    color: "#8A8D9F",
    fontWeight: "600",

  },
  forgotLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00E5FF",
    letterSpacing: 0.5,
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
  },
  ctaText: {
    fontSize: 16,
    letterSpacing: 3,
    color: "#000",
    fontWeight: "900",
    fontFamily: "SpaceGrotesk",
  },
  socialSpacer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 10,
  },
  sepLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  sepText: {
    color: "#8A8D9F",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  socialRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 55,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  socialBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "SpaceGrotesk",
  },
  signupText: {
    textAlign: "center",
    fontSize: 14,
    color: "#8A8D9F",
    fontWeight: "600",
  },
  signupBold: {
    color: "#00E5FF",
    fontWeight: "800",
  },
  cardAction: {
    justifyContent: "center",
    alignItems: "center",
    
  },
});
