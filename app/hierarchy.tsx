import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
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

    formOpacity.value = withTiming(1, { duration: 1000 });
    formTranslateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.back(1)),
    });
  }, []);

  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);

  const animatedFormStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
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

  // Form State
  const [member1, setMember1] = useState("");
  const [member2, setMember2] = useState("");
  const [member3, setMember3] = useState("");
  const [registeredGroups, setRegisteredGroups] = useState<any[]>([]);

  const handleExecute = () => {
    if (!member1 && !member2 && !member3) {
      Alert.alert("Error", "Please enter at least one member.");
      return;
    }

    const newGroup = {
      id: Date.now().toString(),
      parent: "System Admin", // Placeholder
      timestamp: new Date().toLocaleTimeString(),
      members: [member1, member2, member3].filter((m) => m !== ""),
    };

    setRegisteredGroups([newGroup, ...registeredGroups]);

    // Clear inputs
    setMember1("");
    setMember2("");
    setMember3("");
  };

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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
      >
        <SafeAreaView style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <Text style={styles.headerText}>NETWORK HIERARCHY</Text>
              <View style={styles.headerUnderline} />
            </View>

            <Animated.View style={[styles.formContainer, animatedFormStyle]}>
              <Text style={styles.formHeaderText}>Register Child Members</Text>

              <View style={styles.form}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.labeltext}>Member 1 (Primary)</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="account-child-outline"
                      size={20}
                      color="#00E5FF"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter member name"
                      placeholderTextColor="#6060A0"
                      value={member1}
                      onChangeText={setMember1}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.labeltext}>Member 2 (Secondary)</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="account-child-outline"
                      size={20}
                      color="#00E5FF"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter member name"
                      placeholderTextColor="#6060A0"
                      value={member2}
                      onChangeText={setMember2}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.labeltext}>Member 3 (Tertiary)</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="account-child-outline"
                      size={20}
                      color="#00E5FF"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter member name"
                      placeholderTextColor="#6060A0"
                      value={member3}
                      onChangeText={setMember3}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.submitButton}
                  onPress={handleExecute}
                >
                  <LinearGradient
                    colors={["#00E5FF", "#5E35B1"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>REGISTER GROUP</Text>
                    <MaterialCommunityIcons
                      name="sync"
                      size={20}
                      color="#04040A"
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {registeredGroups.length > 0 && (
              <View style={styles.streamSection}>
                <Text style={styles.streamTitle}>REAL-TIME DATA STREAM</Text>
                {registeredGroups.map((group) => (
                  <View key={group.id} style={styles.groupCard}>
                    <View style={styles.cardHeader}>
                      <MaterialCommunityIcons
                        name="family-tree"
                        size={24}
                        color="#00E5FF"
                      />
                      <View>
                        <Text style={styles.cardParentText}>
                          Parent: {group.parent}
                        </Text>
                        <Text style={styles.cardTimeText}>
                          {group.timestamp}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardDivider} />
                    <View style={styles.membersList}>
                      {group.members.map((member: string, idx: number) => (
                        <View key={idx} style={styles.memberBadge}>
                          <Text style={styles.memberBadgeText}>{member}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
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
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#00E5FF",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  headerUnderline: {
    width: 60,
    height: 3,
    backgroundColor: "#FF2D70",
    marginTop: 10,
    borderRadius: 2,
    shadowColor: "#FF2D70",
    shadowRadius: 10,
    shadowOpacity: 0.5,
    elevation: 5,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "rgba(20, 17, 36, 0.4)",
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  formHeaderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 30,
    letterSpacing: 1,
  },
  form: {
    width: "100%",
    gap: 25,
  },
  inputWrapper: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.15)",
    height: 58,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#FFFFFF",
    fontSize: 16,
  },
  labeltext: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#8A8D9F",
    marginBottom: 10,
    fontWeight: "800",
    paddingLeft: 4,
  },
  submitButton: {
    width: "100%",
    height: 60,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 15,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  buttonText: {
    color: "#04040A",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
  streamSection: {
    marginTop: 40,
    width: "100%",
  },
  streamTitle: {
    fontSize: 12,
    color: "#00E5FF",
    letterSpacing: 3,
    fontWeight: "900",
    marginBottom: 20,
    textAlign: "center",
  },
  groupCard: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 15,
  },
  cardParentText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cardTimeText: {
    color: "#6060A0",
    fontSize: 12,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 15,
  },
  membersList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  memberBadge: {
    backgroundColor: "rgba(0, 229, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.1)",
  },
  memberBadgeText: {
    color: "#00E5FF",
    fontSize: 13,
    fontWeight: "600",
  },
});
