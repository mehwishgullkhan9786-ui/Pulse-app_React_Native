import { Switch, StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Image, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";


const Privacy = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const [settings, setSettings] = useState({
    biometric: false,
    location: true,
    dataSharing: false,
    adsTracking: false,
  });

  useEffect(() => {
    const fetchPrivacySettings = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().privacy) {
            setSettings(docSnap.data().privacy);
          }
        } catch (error) {
          console.error("Error fetching privacy settings:", error);
        }
      }
    };
    fetchPrivacySettings();
  }, [user]);

  const toggleSetting = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: newValue }));

    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
          [`privacy.${key}`]: newValue,
        });
      } catch (error) {
        console.error("Error updating privacy setting:", error);
      }
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you absolutely sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (user) {
              try {
                // Delete user document from Firestore
                await deleteDoc(doc(db, "users", user.uid));
                // Delete user from Firebase Auth
                await user.delete();
                console.log("Account deleted successfully");
                router.replace("../login");
              } catch (error: any) {
                console.error("Error deleting account:", error);
                if (error.code === "auth/requires-recent-login") {
                  Alert.alert(
                    "Security Notice",
                    "For security reasons, you must have logged in recently to delete your account. Please log out and log in again, then try deleting your account."
                  );
                } else {
                  Alert.alert("Error", "Could not delete account. Please try again.");
                }
              }
            }
          },
        },
      ]
    );
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
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color="#FFF"
              />
            </TouchableOpacity>

            <View style={styles.headercenter}>
              <Text style={styles.text}>Security</Text>
              <Text style={styles.text1}>Privacy & Protection</Text>
            </View>

            <View style={styles.headerright}>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={22}
                color="#00E5FF"
              />
            </View>
          </View>

          <View style={styles.privacycontainer1}>
            <View style={styles.privacycontainer2}>
              <View style={styles.privacyleft}>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={24}
                  color="#00E5FF"
                />
              </View>
              <View style={styles.privacyright}>
                <Text style={styles.text3}>Your Account is Protected</Text>
                <Text style={styles.text4}>
                  All security measures are up to date and active.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.loginsecuritycontainer}>
            <Text style={styles.text5}>Login & Security</Text>

            <View style={styles.loginsecurity}>
              {/* Div 1 */}
              <TouchableOpacity
                style={styles.loginsecuritydiv}
                onPress={() => router.push("../changepassword")}
              >
                <MaterialCommunityIcons
                  name="form-textbox-password"
                  size={22}
                  color="#00E5FF"
                  style={styles.loginsecurityicon}
                />

                <View style={styles.loginsecurityrcenter}>
                  <Text style={styles.text3}>Change Password</Text>
                  <Text style={styles.text4}>Action Required</Text>
                </View>

                <View style={styles.loginsecurityright}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#8A8D9F"
                  />
                </View>
              </TouchableOpacity>

              {/* Div 2 */}

              <TouchableOpacity
                style={styles.loginsecuritydiv}
                onPress={() => router.push("../twofactor")}
              >
                <MaterialCommunityIcons
                  name="two-factor-authentication"
                  size={22}
                  color="#00E5FF"
                  style={styles.loginsecurityicon}
                />

                <View style={styles.loginsecurityrcenter}>
                  <Text style={styles.text3}>Two Factor Authentication</Text>
                  <Text style={styles.text4}>Secure your account</Text>
                </View>

                <View style={styles.loginsecurityright}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#8A8D9F"
                  />
                </View>
              </TouchableOpacity>

              {/* Div 3 */}
              <View style={styles.loginsecuritydiv}>
                <MaterialCommunityIcons
                  name="fingerprint"
                  size={22}
                  color="#00E5FF"
                  style={styles.loginsecurityicon}
                />

                <View style={styles.loginsecurityrcenter}>
                  <Text style={styles.text3}>Biometric Login</Text>
                  <Text style={styles.text4}>Use Face ID / Touch ID</Text>
                </View>

                <View style={styles.loginsecurityright}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#17585fff" }}
                    thumbColor={settings.biometric ? "#00E5FF" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSetting("biometric")}
                    value={settings.biometric}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.datasection}>
            <Text style={styles.text5}>Data & Privacy</Text>

            <View style={styles.loginsecurity}>
              {/* Div 1 */}
              <View style={styles.loginsecuritydiv}>
                <MaterialCommunityIcons
                  name="map-marker-radius-outline"
                  size={22}
                  color="#00E5FF"
                  style={styles.loginsecurityicon}
                />

                <View style={styles.loginsecurityrcenter}>
                  <Text style={styles.text3}>Location Services</Text>
                  <Text style={styles.text4}>
                    Allow app to use your location
                  </Text>
                </View>

                <View style={styles.loginsecurityright}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#17585fff" }}
                    thumbColor={settings.location ? "#00E5FF" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSetting("location")}
                    value={settings.location}
                  />
                </View>
              </View>

              {/* Div 2 */}
              <View style={styles.loginsecuritydiv}>
                <MaterialCommunityIcons
                  name="database-outline"
                  size={22}
                  color="#00E5FF"
                  style={styles.loginsecurityicon}
                />

                <View style={styles.loginsecurityrcenter}>
                  <Text style={styles.text3}>Data Sharing</Text>
                  <Text style={styles.text4}>
                    Share anonymized data for improvements
                  </Text>
                </View>

                <View style={styles.loginsecurityright}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#17585fff" }}
                    thumbColor={settings.dataSharing ? "#00E5FF" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSetting("dataSharing")}
                    value={settings.dataSharing}
                  />
                </View>
              </View>

              <View style={styles.loginsecuritydiv}>
                <MaterialCommunityIcons
                  name="fingerprint"
                  size={22}
                  color="#00E5FF"
                  style={styles.loginsecurityicon}
                />

                {/* Div 3 */}
                <View style={styles.loginsecurityrcenter}>
                  <Text style={styles.text3}>Add Tracking</Text>
                  <Text style={styles.text4}>
                    Received targeted advertisements
                  </Text>
                </View>

                <View style={styles.loginsecurityright}>
                  <Switch
                    trackColor={{ false: "#767577", true: "#17585fff" }}
                    thumbColor={settings.adsTracking ? "#00E5FF" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSetting("adsTracking")}
                    value={settings.adsTracking}
                  />
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
            <MaterialCommunityIcons
              name="delete-outline"
              size={20}
              color="#FF2D78"
            />
            <Text style={styles.deleteText}>DELETE ACCOUNT</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Privacy;

const styles = StyleSheet.create({
  maincontainer: {
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

  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 30,
    marginTop: 20,
    paddingBottom: 20,
    // borderBottomColor: "rgba(255,255,255,0.06)",
    // borderBottomWidth: 1,
  },
  headerleft: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 20,
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
    marginTop: 20,
  },
  headerright: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 20,
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
  privacycontainer1: {
    flex: 1,
  },
  privacycontainer2: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderTopWidth: 3,
    borderTopColor: "#7D5FFF",
    marginBottom: 30,
    overflow: "hidden",
  },
  privacyleft: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "rgba(125, 95, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  privacyright: {
    flex: 1,
  },
  text3: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  text4: {
    color: "#8A8D9F",
    fontSize: 13,
  },

  loginsecuritycontainer: {
    flex: 1,
  },
  text5: {
    color: "#8A8D9F",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 12,
  },

  loginsecurity: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    width: "100%",
    height: "auto",
    gap: 12,
  },
  loginsecuritydiv: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    width: "100%",
    minHeight: 90,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderTopWidth: 3,
    borderTopColor: "#7D5FFF",
    overflow: "hidden",
  },

  loginsecurityicon: {
    width: 40,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(0, 229, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    padding: 10,
  },

  loginsecurityrcenter: {
    marginRight: 10,
    width: 140,
  },

  loginsecurityright: {
    justifyContent: "center",
    alignItems: "center",
  },

  datasection: {
    flex: 1,
    marginTop: 30,
  },

  deleteBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255, 45, 120, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 45, 120, 0.3)",
    gap: 8,
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
    marginBottom: 40,
  },
  deleteText: {
    color: "#FF2D78",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
