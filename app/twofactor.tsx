import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  PhoneAuthProvider,
  signInWithPhoneNumber,
  updatePhoneNumber,
  linkWithCredential,
} from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { signOut } from "firebase/auth";

export default function TwoFactorScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  const [isEnabled, setIsEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [smsNumber, setSmsNumber] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState(1); // 1: Number entry, 2: OTP entry
  const [verificationId, setVerificationId] = useState("");
  const recaptchaVerifier = useRef<any>(null);

  useEffect(() => {
    const fetch2FAData = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().privacy) {
            const data = docSnap.data().privacy;
            setIsEnabled(data.twoFactorEnabled || false);
            setSmsEnabled(data.smsEnabled || false);
            setSmsNumber(data.smsNumber || "");
            setRecoveryCodes(data.recoveryCodes || []);
          }
        } catch (error) {
          console.error("Error fetching 2FA data:", error);
        }
      }
    };
    fetch2FAData();
  }, [user]);

  const toggleSwitch = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);

    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
          "privacy.twoFactorEnabled": newValue,
        });
      } catch (error) {
        console.error("Error updating 2FA status:", error);
      }
    }
  };

  const handleSmsSetup = () => {
    setStep(1);
    setPhoneNumber("");
    setOtpCode("");
    setModalVisible(true);
  };

  const sendOtp = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert("Invalid Number", "Please enter a valid phone number.");
      return;
    }

    const fullPhoneNumber = `+92${phoneNumber}`;
    setIsSending(true);

    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const vid = await phoneProvider.verifyPhoneNumber(
        fullPhoneNumber,
        recaptchaVerifier.current!
      );
      setVerificationId(vid);
      setIsSending(false);
      setStep(2);
      Alert.alert("Code Sent", `A verification code has been sent to ${fullPhoneNumber}`);
    } catch (error: any) {
      setIsSending(false);
      console.error("Error sending OTP:", error);
      
      let message = "Failed to send code. Please try again.";
      if (error.code === "auth/invalid-phone-number") {
        message = "The phone number is invalid.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many requests. Please try again later.";
      }
      
      Alert.alert("Error", message);
    }
  };

  const verifyOtp = async () => {
    if (otpCode.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit code.");
      return;
    }

    setIsVerifying(true);

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otpCode);
      
      if (user) {
        // Link the phone number to the current user account
        // This effectively "verifies" the number and saves it to the user's profile
        await linkWithCredential(user, credential);
        
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
          "privacy.smsEnabled": true,
          "privacy.smsNumber": `+92${phoneNumber}`,
          "privacy.twoFactorEnabled": true,
        });
        
        setSmsEnabled(true);
        setSmsNumber(`+92${phoneNumber}`);
        setIsEnabled(true);
      }
      
      setIsVerifying(false);
      setModalVisible(false);
      Alert.alert("Success", "Phone Verification enabled successfully!");
      
    } catch (error: any) {
      setIsVerifying(false);
      console.error("Error verifying OTP:", error);
      
      let message = "Invalid code. Please try again.";
      if (error.code === "auth/credential-already-in-use") {
        message = "This phone number is already linked to another account.";
      } else if (error.code === "auth/invalid-verification-code") {
        message = "The code you entered is incorrect.";
      }
      
      Alert.alert("Error", message);
    }
  };

  const handleRecoveryCodes = async () => {
    if (recoveryCodes.length > 0) {
      Alert.alert(
        "Backup Codes",
        `Your active recovery codes:\n\n${recoveryCodes.join("\n")}`,
        [
          { text: "Done" },
          {
            text: "Regenerate",
            style: "destructive",
            onPress: generateNewCodes,
          },
        ],
      );
    } else {
      generateNewCodes();
    }
  };

  const generateNewCodes = async () => {
    const newCodes = Array.from({ length: 8 }, () =>
      Math.random().toString(36).substring(2, 12).toUpperCase(),
    );
    setRecoveryCodes(newCodes);
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
          "privacy.recoveryCodes": newCodes,
        });
        Alert.alert(
          "Codes Generated",
          "Please save these codes in a safe place:\n\n" + newCodes.join("\n"),
        );
      } catch (error) {
        console.error("Error saving recovery codes:", error);
      }
    }
  };

  const handleGlobalSignout = async () => {
    try {
      await signOut(auth);
      router.replace("../login");
    } catch (error) {
      console.error("Error signing out:", error);
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
                <Text style={styles.text}>Security Auth</Text>
                <Text style={styles.text1}>2-Factor Authentication</Text>
              </View>

              <View style={styles.headerright}>
                <MaterialCommunityIcons
                  name="shield-lock-outline"
                  size={22}
                  color="#00E5FF"
                />
              </View>
            </View>

            <View style={styles.iconWrapper}>
              <View style={styles.iconGlow}>
                <MaterialCommunityIcons
                  name="shield-check-outline"
                  size={50}
                  color="#00E5FF"
                />
              </View>
              <Text style={styles.formTitle}>Enhanced Security</Text>
              <Text style={styles.formSubtitle}>
                Protect your account with an additional layer of verification.
              </Text>
            </View>

            <View style={styles.datasection}>
              <Text style={styles.text5}>Configured Methods</Text>
              <View style={styles.loginsecurity}>
                <TouchableOpacity style={styles.loginsecuritydiv}>
                  <MaterialCommunityIcons
                    name="cellphone-key"
                    size={22}
                    color="#00E5FF"
                    style={styles.loginsecurityicon}
                  />
                  <View style={styles.loginsecurityrcenter}>
                    <Text style={styles.text3}>Authenticator App</Text>
                    <Text style={styles.text4}>Active / Recommended</Text>
                  </View>
                  <View style={styles.loginsecurityright}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="#00E5FF"
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginsecuritydiv}
                  onPress={handleSmsSetup}
                >
                  <MaterialCommunityIcons
                    name="message-text-outline"
                    size={22}
                    color="#00E5FF"
                    style={styles.loginsecurityicon}
                  />
                  <View style={styles.loginsecurityrcenter}>
                    <Text style={styles.text3}>Phone Verification</Text>
                    <Text style={styles.text4}>
                      {smsEnabled
                        ? `Active: ${smsNumber.replace(/.(?=.{2})/g, "*")}`
                        : "Not Configured"}
                    </Text>
                  </View>
                  <View style={styles.loginsecurityright}>
                    <MaterialCommunityIcons
                      name={smsEnabled ? "check-circle" : "chevron-right"}
                      size={24}
                      color={smsEnabled ? "#00E5FF" : "#8A8D9F"}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginsecuritydiv}
                  onPress={handleRecoveryCodes}
                >
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={22}
                    color="#5E35B1"
                    style={styles.loginsecurityicon}
                  />
                  <View style={styles.loginsecurityrcenter}>
                    <Text style={styles.text3}>Recovery Codes</Text>
                    <Text style={styles.text4}>
                      {recoveryCodes.length > 0
                        ? `${recoveryCodes.length} codes available`
                        : "Backup Method"}
                    </Text>
                  </View>
                  <View style={styles.loginsecurityright}>
                    <MaterialCommunityIcons
                      name={
                        recoveryCodes.length > 0
                          ? "shield-check"
                          : "chevron-right"
                      }
                      size={24}
                      color={recoveryCodes.length > 0 ? "#5E35B1" : "#8A8D9F"}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.datasection}>
              <Text style={styles.text5}>Preferences</Text>
              <View style={styles.loginsecurity}>
                <View style={styles.loginsecuritydiv}>
                  <MaterialCommunityIcons
                    name="login-variant"
                    size={22}
                    color="#00E5FF"
                    style={styles.loginsecurityicon}
                  />
                  <View style={styles.loginsecurityrcenter}>
                    <Text style={styles.text3}>Require on Login</Text>
                    <Text style={styles.text4}>Verify every session</Text>
                  </View>
                  <Switch
                    trackColor={{ false: "#767577", true: "#17585fff" }}
                    thumbColor={isEnabled ? "#00E5FF" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                </View>

                <TouchableOpacity
                  style={styles.loginsecuritydiv}
                  onPress={handleGlobalSignout}
                >
                  <MaterialCommunityIcons
                    name="power"
                    size={22}
                    color="#FF2D78"
                    style={styles.loginsecurityicon}
                  />
                  <View style={styles.loginsecurityrcenter}>
                    <Text style={styles.text3}>Global Signout</Text>
                    <Text style={styles.text4}>Secure all devices</Text>
                  </View>
                  <View style={styles.loginsecurityright}>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color="#8A8D9F"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footerSpacing} />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Verification Modal */}
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={auth.app.options}
          attemptInvisibleVerification={true}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {step === 1 ? "Connect Phone" : "Verify OTP"}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="#8A8D9F"
                  />
                </TouchableOpacity>
              </View>

              {step === 1 ? (
                <View style={styles.modalBody}>
                  <Text style={styles.modalSub}>
                    Enter your phone number to receive a secure verification
                    code.
                  </Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.prefix}>+92</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="300 1234567"
                      placeholderTextColor="#444"
                      keyboardType="numeric"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      maxLength={10}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={sendOtp}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <ActivityIndicator color="#000" />
                    ) : (
                      <Text style={styles.modalBtnText}>SEND CODE</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.modalBody}>
                  <Text style={styles.modalSub}>
                    We've sent a 6-digit code to +92 {phoneNumber}. Use 123456
                    for testing.
                  </Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.modalInput, styles.otpInput]}
                      placeholder="0 0 0 0 0 0"
                      placeholderTextColor="#444"
                      keyboardType="numeric"
                      value={otpCode}
                      onChangeText={setOtpCode}
                      maxLength={6}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={verifyOtp}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <ActivityIndicator color="#000" />
                    ) : (
                      <Text style={styles.modalBtnText}>VERIFY & ACTIVATE</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.resendBtn}
                    onPress={() => setStep(1)}
                  >
                    <Text style={styles.resendText}>Edit phone number?</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
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
    gap: 18,
    paddingBottom: 25,
    padding: 20,
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
  iconWrapper: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 10,
  },
  iconGlow: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(0, 229, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0, 229, 255, 0.3)",
    marginBottom: 20,
  },
  formTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "SpaceGrotesk",
    marginBottom: 8,
  },
  formSubtitle: {
    color: "#8A8D9F",
    fontSize: 13,
    fontFamily: "JetBrainsMono",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  datasection: {
    flex: 1,
    marginTop: 10,
    marginBottom: 20,
  },
  text5: {
    color: "#8A8D9F",
    fontSize: 17,
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
    borderTopColor: "#00E5FF",
    position: "relative",
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
  loginsecurityright: {
    justifyContent: "center",
    alignItems: "center",
  },
  toggleActive: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#00E5FF",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  footerSpacing: {
    height: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#141124",
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.2)",
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "SpaceGrotesk",
  },
  modalBody: {
    alignItems: "center",
  },
  modalSub: {
    color: "#8A8D9F",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.2)",
    marginBottom: 25,
    paddingHorizontal: 15,
    width: "100%",
  },
  prefix: {
    color: "#00E5FF",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  modalInput: {
    flex: 1,
    height: 60,
    color: "#FFF",
    fontSize: 18,
    fontFamily: "JetBrainsMono",
  },
  otpInput: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 8,
  },
  modalBtn: {
    width: "100%",
    height: 55,
    backgroundColor: "#00E5FF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalBtnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
  resendBtn: {
    marginTop: 20,
  },
  resendText: {
    color: "#6060A0",
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
