import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { Alert } from "react-native";

export default function AppSetting() {
  const router = useRouter();
  const user = auth.currentUser;

  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailAlerts: false,
    darkMode: true,
    autoUpdate: true,
    hapticFeedback: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().settings) {
            setSettings(docSnap.data().settings);
          }
        } catch (error) {
          console.error("Error fetching app settings:", error);
        }
      }
    };
    fetchSettings();
  }, [user]);

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

  const handleResetSettings = async () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to restore all settings to default?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            const defaults = {
              pushNotifications: true,
              emailAlerts: false,
              darkMode: true,
              autoUpdate: true,
              hapticFeedback: true,
            };
            setSettings(defaults);
            if (user) {
              try {
                const docRef = doc(db, "users", user.uid);
                await updateDoc(docRef, { settings: defaults });
                Alert.alert("Success", "Settings have been reset to default.");
              } catch (error) {
                console.error("Error resetting settings:", error);
              }
            }
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert("Clearing Cache", "Please wait...", [{ text: "OK", style: "default" }]);
    setTimeout(() => {
      Alert.alert("Cleared", "App cache has been cleaned successfully!");
    }, 1500);
  };

  return (
    <View style={styles.maincontainer}>
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
            <TouchableOpacity
              style={styles.headerleft}
              onPress={() => router.push("../Profile")}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color="#FFF"
              />
            </TouchableOpacity>

            <View style={styles.headercenter}>
              <Text style={styles.text}>App Settings</Text>
              <Text style={styles.text1}>Preferences & Display</Text>
            </View>

            <View style={styles.headerright}>
              <MaterialCommunityIcons
                name="cog-outline"
                size={22}
                color="#00E5FF"
              />
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Notifications</Text>

            <View style={styles.cardGroup}>
              <View style={styles.cardRow}>
                <MaterialCommunityIcons
                  name="bell-badge-outline"
                  size={24}
                  color="#00E5FF"
                  style={styles.cardIcon}
                />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Push Notifications</Text>
                  <Text style={styles.cardSubtitle}>
                    Real-time alerts & updates
                  </Text>
                </View>
                <View style={styles.cardAction}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#17585fff" }}
                    thumbColor={
                      settings.pushNotifications ? "#00E5FF" : "#f4f3f4"
                    }
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSetting("pushNotifications")}
                    value={settings.pushNotifications}
                  />
                </View>
              </View>

              <View style={styles.cardRow}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={24}
                  color="#00E5FF"
                  style={styles.cardIcon}
                />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Email Alerts</Text>
                  <Text style={styles.cardSubtitle}>
                    Weekly summaries & news
                  </Text>
                </View>
                <View style={styles.cardAction}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#17585fff" }}
                    thumbColor={settings.emailAlerts ? "#00E5FF" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSetting("emailAlerts")}
                    value={settings.emailAlerts}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>App Preferences</Text>

            <View style={styles.cardGroup}>
              <View style={styles.cardRow}>
                <MaterialCommunityIcons
                  name="moon-waning-crescent"
                  size={24}
                  color="#00E5FF"
                  style={styles.cardIcon}
                />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Dark Theme</Text>
                  <Text style={styles.cardSubtitle}>
                    Power saving & eye care
                  </Text>
                </View>
                <View style={styles.cardAction}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#17585fff" }}
                    thumbColor={settings.darkMode ? "#00E5FF" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSetting("darkMode")}
                    value={settings.darkMode}
                  />
                </View>
              </View>

              <View style={styles.cardRow}>
                <MaterialCommunityIcons
                  name="vibrate"
                  size={24}
                  color="#00E5FF"
                  style={styles.cardIcon}
                />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Haptic Feedback</Text>
                  <Text style={styles.cardSubtitle}>
                    Vibration on tap actions
                  </Text>
                </View>
                <View style={styles.cardAction}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#17585fff" }}
                    thumbColor={settings.hapticFeedback ? "#00E5FF" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSetting("hapticFeedback")}
                    value={settings.hapticFeedback}
                  />
                </View>
              </View>

              <View style={styles.cardRow}>
                <MaterialCommunityIcons
                  name="cloud-download-outline"
                  size={24}
                  color="#00E5FF"
                  style={styles.cardIcon}
                />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Auto Update</Text>
                  <Text style={styles.cardSubtitle}>
                    Keep app version up to date
                  </Text>
                </View>
                <View style={styles.cardAction}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#17585fff" }}
                    thumbColor={settings.autoUpdate ? "#00E5FF" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSetting("autoUpdate")}
                    value={settings.autoUpdate}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Advanced</Text>

            <View style={styles.cardGroup}>
              <TouchableOpacity style={styles.cardRowBtn} onPress={handleClearCache}>
                <MaterialCommunityIcons
                  name="broom"
                  size={24}
                  color="#FF9800"
                  style={[
                    styles.cardIconBtn,
                    { backgroundColor: "rgba(255, 152, 0, 0.15)" },
                  ]}
                />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Clear Cache</Text>
                  <Text style={styles.cardSubtitle}>
                    Free up 124 MB of storage
                  </Text>
                </View>
                <View style={styles.cardAction}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#8A8D9F"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.resetBtn} onPress={handleResetSettings}>
            <MaterialCommunityIcons name="restore" size={20} color="#FF2D78" />
            <Text style={styles.resetText}>RESET ALL SETTINGS</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: "#0C101A",
  },
  container: {
    flex: 1,
    paddingTop: 10,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 30,
    marginTop: 20,
    paddingBottom: 25,
  },
  headerleft: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#192135ff",
    width: 45,
    height: 45,
    borderRadius: 15,
    borderColor: "gray",
    borderWidth: 2,
    padding: 10,
  },
  headercenter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerright: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#192135ff",
    width: 45,
    height: 45,
    borderRadius: 15,
    borderColor: "rgba(0, 229, 255, 0.4)",
    borderWidth: 2,
    padding: 10,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    letterSpacing: 2,
  },
  text1: {
    fontSize: 15,
    color: "#00E5FF",
    letterSpacing: 2,
  },
  sectionContainer: {
    marginBottom: 30,
    marginTop: 20,
  },
  sectionTitle: {
    color: "#8A8D9F",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 15,
    fontFamily: "SpaceGrotesk",
  },
  cardGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 15,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    width: "100%",
    gap: 12,
  },
  cardRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    width: "100%",
    minHeight: 85,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderTopWidth: 3,
    borderTopColor: "#FF2D70",
    overflow: "hidden",
  },
  cardRowBtn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    width: "100%",
    minHeight: 85,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderTopWidth: 3,
    borderTopColor: "#FFB000",
    overflow: "hidden",
  },
  cardIcon: {
    width: 40,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(0, 229, 255, 0.15)",
    textAlign: "center",
    textAlignVertical: "center",
    marginRight: 15,
  },
  cardIconBtn: {
    width: 40,
    height: 42,
    borderRadius: 14,
    textAlign: "center",
    textAlignVertical: "center",
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
    fontFamily: "SpaceGrotesk",
    width: 185,
  },
  cardSubtitle: {
    color: "#8A8D9F",
    fontSize: 13,
    fontFamily: "JetBrainsMono",
  },
  cardAction: {
    justifyContent: "center",
    alignItems: "center",
    
  },
  resetBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 45, 120, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 45, 120, 0.3)",
    gap: 8,
    marginTop: 10,
    width: "70%",
    alignSelf: "center",
    marginBottom: 40,
  },
  resetText: {
    color: "#FF2D78",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 1.5,
    fontFamily: "SpaceGrotesk",
  },
});
