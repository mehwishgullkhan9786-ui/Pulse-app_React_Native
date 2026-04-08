import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

export default function ChangePassword() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureText, setSecureText] = useState({
    current: true,
    new: true,
    confirm: true,
  });

  const toggleSecure = (field: "current" | "new" | "confirm") => {
    setSecureText((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Security Check", "New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Mismatch", "New password and confirmation do not match.");
      return;
    }

    if (!user || !user.email) {
      Alert.alert("Error", "User not found or not logged in.");
      return;
    }

    try {
      // Re-authentication is required to update password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // After successful re-authentication, update the password
      await updatePassword(user, newPassword);

      Alert.alert(
        "Success!", 
        "Your password has been updated securely.",
        [{ text: "OK", onPress: () => router.back() }]
      );
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Password Update Error:", error);
      let errorMessage = "Could not update password.";
      if (error.code === "auth/wrong-password") {
        errorMessage = "Current password is incorrect.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "The new password is too weak.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      }
      Alert.alert("Change Failed", errorMessage);
    }
  };

  return (
    <View style={styles.maincontainer}>
      <LinearGradient
        colors={["#0C101A", "#141124", "#0A0B10"]}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
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
                <Text style={styles.headerText}>Password</Text>
                <Text style={styles.headerSubtext}>Change Password</Text>
              </View>
  
              <View style={styles.headerright}>
                <MaterialCommunityIcons
                  name="shield-lock-outline"
                  size={22}
                  color="#00E5FF"
                />
              </View>
            </View>
          
            <View style={styles.formContainer}>
              <View style={styles.iconWrapper}>
                <View style={styles.iconGlow}>
                  <MaterialCommunityIcons name="lock-reset" size={50} color="#00E5FF" />
                </View>
                <Text style={styles.formTitle}>Secure Your Account</Text>
                <Text style={styles.formSubtitle}>Use a strong password combining letters, numbers, and special characters.</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="lock-outline" size={20} color="#8A8D9F" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter current password"
                    placeholderTextColor="#565A6E"
                    secureTextEntry={secureText.current}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                  />
                  <TouchableOpacity onPress={() => toggleSecure("current")} style={styles.eyeIcon}>
                    <MaterialCommunityIcons name={secureText.current ? "eye-off-outline" : "eye-outline"} size={20} color="#8A8D9F" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.inputWrapper}>
                  <MaterialCommunityIcons name="lock-check-outline" size={20} color="#00E5FF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter new password"
                    placeholderTextColor="#565A6E"
                    secureTextEntry={secureText.new}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity onPress={() => toggleSecure("new")} style={styles.eyeIcon}>
                    <MaterialCommunityIcons name={secureText.new ? "eye-off-outline" : "eye-outline"} size={20} color="#8A8D9F" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <View style={[styles.inputWrapper, { marginBottom: 30 }]}>
                  <MaterialCommunityIcons name="lock-check-outline" size={20} color="#00E5FF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm new password"
                    placeholderTextColor="#565A6E"
                    secureTextEntry={secureText.confirm}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => toggleSecure("confirm")} style={styles.eyeIcon}>
                    <MaterialCommunityIcons name={secureText.confirm ? "eye-off-outline" : "eye-outline"} size={20} color="#8A8D9F" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.updateBtn} 
                activeOpacity={0.8}
                onPress={handleUpdatePassword}
              >
                <LinearGradient
                  colors={["#00E5FF", "#0088FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBtn}
                >
                  <Text style={styles.updateBtnText}>UPDATE PASSWORD</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
                <Text style={styles.cancelBtnText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    paddingTop: 20,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    paddingBottom: 25,
  },
  headerleft: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  headercenter: {
    alignItems: "center",
  },
  headerright: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "rgba(0, 229, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.3)",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 2,
    fontFamily: "SpaceGrotesk",
  },
  headerSubtext: {
    fontSize: 12,
    color: "#00E5FF",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  formContainer: {
    marginTop: 10,
  },
  iconWrapper: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(0, 229, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0, 229, 255, 0.4)",
    marginBottom: 20,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  formTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "900",
    fontFamily: "SpaceGrotesk",
    marginBottom: 8,
  },
  formSubtitle: {
    color: "#8A8D9F",
    fontSize: 14,
    fontFamily: "JetBrainsMono",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    color: "#8A8D9F",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
    marginLeft: 5,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1.5,
    borderColor: "rgba(138, 141, 159, 0.2)",
    borderRadius: 18,
    height: 65,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
    fontFamily: "JetBrainsMono",
    height: "100%",
  },
  eyeIcon: {
    padding: 10,
  },
  updateBtn: {
    width: "90%",
    height: 60,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 15,
    alignSelf: "center",
  },
  gradientBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  updateBtnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
    fontFamily: "SpaceGrotesk",
  },
  cancelBtn: {
    width: "90%",
    height: 60,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(138, 141, 159, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  cancelBtnText: {
    color: "#8A8D9F",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1.5,
    fontFamily: "SpaceGrotesk",
  },
});
