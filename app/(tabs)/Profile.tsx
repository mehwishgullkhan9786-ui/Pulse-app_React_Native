import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { ActivityIndicator } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // Fallback for email if username not found
            setUserData({
              email: user.email,
              username: user.displayName || "User",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("../login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
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
          <View style={styles.profileHeader}>
            <View style={styles.avatarGlow}>
              <View style={styles.avatarContainer}>
                <MaterialCommunityIcons
                  name="account-circle"
                  size={100}
                  color="#00E5FF"
                />
              </View>
            </View>
            {loading ? (
              <ActivityIndicator size="small" color="#00E5FF" />
            ) : (
              <>
                <Text style={styles.profileName}>
                  {userData?.username || "Pulse User"}
                </Text>
                <Text style={styles.profileEmail}>
                  {userData?.email ||
                    auth.currentUser?.email ||
                    "No email reached"}
                </Text>
              </>
            )}
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>PRO USER</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: "rgba(94, 53, 177, 0.15)",
                    borderColor: "rgba(94, 53, 177, 0.4)",
                  },
                ]}
              >
                <Text style={[styles.badgeText, { color: "#5E35B1" }]}>
                  V3 BETA
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1,240</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Efficiency</Text>
            </View>
          </View>

          <View style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>ACCOUNT SETTINGS</Text>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => router.push("../privacy")}
            >
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={24}
                color="#00E5FF"
              />
              <Text style={styles.settingsLabel}>Security & Privacy</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#8A8D9F"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => router.push("../appsetting")}
            >
              <MaterialCommunityIcons
                name="cog-outline"
                size={24}
                color="#00E5FF"
              />
              <Text style={styles.settingsLabel}>App Settings</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#8A8D9F"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => router.push("../notification")}
            >
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color="#00E5FF"
              />
              <Text style={styles.settingsLabel}>Notifications</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#8A8D9F"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>LOGOUT SESSION</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#0C101A",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  avatarGlow: {
    padding: 3,
    borderRadius: 70,
    backgroundColor: "rgba(0, 229, 255, 0.15)",
    borderWidth: 1.5,
    borderColor: "rgba(0, 229, 255, 0.4)",
    marginBottom: 20,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#0C101A",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileName: {
    fontSize: 28,
    color: "#FFF",
    fontWeight: "900",
    letterSpacing: 1.5,
    fontFamily: "SpaceGrotesk",
  },
  profileEmail: {
    fontSize: 14,
    color: "#8A8D9F",
    marginTop: 5,
    fontFamily: "JetBrainsMono",
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "rgba(0, 229, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.4)",
  },
  badgeText: {
    color: "#00E5FF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 25,
    paddingVertical: 25,
    marginBottom: 35,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.06)",
  },
  statValue: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "900",
    fontFamily: "SpaceGrotesk",
  },
  statLabel: {
    color: "#8A8D9F",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "JetBrainsMono",
  },
  settingsGroup: {
    gap: 15,
    marginBottom: 40,
  },
  groupTitle: {
    color: "#8A8D9F",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    marginLeft: 5,
    marginBottom: 5,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  settingsLabel: {
    flex: 1,
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 15,
  },
  logoutBtn: {
    width: "80%",
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 45, 120, 0.4)",
    backgroundColor: "rgba(255, 45, 120, 0.05)",
    alignItems: "center",
    marginLeft: 40,
  },
  logoutText: {
    color: "#FF2D78",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
    fontFamily: "SpaceGrotesk",
  },
});
