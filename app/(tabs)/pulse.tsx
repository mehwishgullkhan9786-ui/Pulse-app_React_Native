// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withRepeat,
//   withTiming,
//   withSequence,
//   Easing,
// } from "react-native-reanimated";
// import { savePulseData, getPulseData } from "../../firebaseDbfile";

// const { width } = Dimensions.get("window");

// export default function PulseScreen() {
//   const [pulse, setPulse] = useState(72);
//   const [history, setHistory] = useState([]);
//   const [isSaving, setIsSaving] = useState(false);

//   // Animation values
//   const waveScale = useSharedValue(1);
//   const glowOpacity = useSharedValue(0.3);

//   useEffect(() => {
//     // Heartbeat animation
//     waveScale.value = withRepeat(
//       withSequence(
//         withTiming(1.2, { duration: 200, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
//         withTiming(1, { duration: 500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
//       ),
//       -1,
//       true
//     );

//     glowOpacity.value = withRepeat(
//       withTiming(0.8, { duration: 800 }),
//       -1,
//       true
//     );

//     fetchHistory();

//     // Simulate pulse variation
//     const interval = setInterval(() => {
//       setPulse(prev => Math.max(60, Math.min(100, prev + (Math.random() > 0.5 ? 1 : -1))));
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   const fetchHistory = async () => {
//     const data = await getPulseData();
//     setHistory(data.slice(0, 10)); // Top 10 latest
//   };

//   const handleSave = async () => {
//     setIsSaving(true);
//     await savePulseData("user123", pulse); // Using placeholder userId for now
//     await fetchHistory();
//     setIsSaving(false);
//   };

//   const animatedHeart = useAnimatedStyle(() => ({
//     transform: [{ scale: waveScale.value }],
//   }));

//   const animatedGlow = useAnimatedStyle(() => ({
//     opacity: glowOpacity.value,
//   }));

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={["#0C101A", "#141124", "#0A0B10"]}
//         style={StyleSheet.absoluteFillObject}
//       />

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>PULSE MONITOR</Text>
//           <Text style={styles.headerStatus}>LIVE STATUS: STABLE</Text>
//         </View>

//         {/* Main Pulse Monitor Circle */}
//         <View style={styles.monitorOuter}>
//           <Animated.View style={[styles.glowRing, animatedGlow]} />
//           <LinearGradient
//             colors={["#1A1C3D", "#0A0B10"]}
//             style={styles.monitorInner}
//           >
//             <Animated.View style={animatedHeart}>
//               <MaterialCommunityIcons name="heart-pulse" size={80} color="#FF2D70" />
//             </Animated.View>
//             <View style={styles.pulseValueContainer}>
//               <Text style={styles.pulseValue}>{pulse}</Text>
//               <Text style={styles.pulseUnit}>BPM</Text>
//             </View>
//           </LinearGradient>
//         </View>

//         {/* Action Controls */}
//         <View style={styles.controls}>
//           <TouchableOpacity
//             style={[styles.saveButton, isSaving && styles.buttonDisabled]}
//             onPress={handleSave}
//             disabled={isSaving}
//           >
//             <LinearGradient
//               colors={["#FF2D70", "#D81B60"]}
//               style={styles.buttonGradient}
//             >
//               <MaterialCommunityIcons name="cloud-upload" size={24} color="#FFF" />
//               <Text style={styles.buttonText}>{isSaving ? "SYNCING..." : "SYNC TO CLOUD"}</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>

//         {/* History Log */}
//         <View style={styles.historyContainer}>
//           <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
//           {history.length === 0 ? (
//             <Text style={styles.emptyText}>No data synced yet.</Text>
//           ) : (
//             history.map((item, index) => (
//               <View key={item.id || index} style={styles.historyItem}>
//                 <View style={styles.historyLeft}>
//                   <MaterialCommunityIcons name="heart-flash" size={20} color="#00E5FF" />
//                   <Text style={styles.historyValue}>{item.pulse} BPM</Text>
//                 </View>
//                 <Text style={styles.historyDate}>
//                   {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleTimeString() : "Recent"}
//                 </Text>
//               </View>
//             ))
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0C101A",
//   },
//   scrollContent: {
//     alignItems: "center",
//     paddingTop: 60,
//     paddingBottom: 100,
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 40,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "900",
//     color: "#00E5FF",
//     letterSpacing: 4,
//     fontFamily: "SpaceGroteskBold",
//   },
//   headerStatus: {
//     fontSize: 12,
//     color: "#8A8D9F",
//     letterSpacing: 2,
//     marginTop: 5,
//     fontFamily: "JetBrainsMono",
//   },
//   monitorOuter: {
//     width: 280,
//     height: 280,
//     borderRadius: 140,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 50,
//   },
//   glowRing: {
//     position: "absolute",
//     width: 300,
//     height: 300,
//     borderRadius: 150,
//     backgroundColor: "rgba(255, 45, 112, 0.15)",
//     shadowColor: "#FF2D70",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 30,
//   },
//   monitorInner: {
//     width: 250,
//     height: 250,
//     borderRadius: 125,
//     borderWidth: 2,
//     borderColor: "rgba(255, 45, 112, 0.3)",
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//   },
//   pulseValueContainer: {
//     alignItems: "center",
//     marginTop: 10,
//   },
//   pulseValue: {
//     fontSize: 64,
//     fontWeight: "900",
//     color: "#FFF",
//     fontFamily: "SpaceGroteskBold",
//   },
//   pulseUnit: {
//     fontSize: 14,
//     color: "#FF2D70",
//     letterSpacing: 4,
//     fontWeight: "bold",
//   },
//   controls: {
//     width: "100%",
//     paddingHorizontal: 30,
//     marginBottom: 40,
//   },
//   saveButton: {
//     width: "100%",
//     borderRadius: 16,
//     overflow: "hidden",
//     elevation: 10,
//     shadowColor: "#FF2D70",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
//   buttonGradient: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 18,
//     gap: 10,
//   },
//   buttonText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "bold",
//     letterSpacing: 2,
//   },
//   historyContainer: {
//     width: "100%",
//     paddingHorizontal: 30,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     color: "#8A8D9F",
//     letterSpacing: 2,
//     marginBottom: 20,
//     fontWeight: "bold",
//   },
//   historyItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.03)",
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "rgba(255, 255, 255, 0.05)",
//   },
//   historyLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   historyValue: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   historyDate: {
//     color: "#6060A0",
//     fontSize: 12,
//     fontFamily: "JetBrainsMono",
//   },
//   emptyText: {
//     color: "#6060A0",
//     textAlign: "center",
//     marginTop: 20,
//     fontFamily: "JetBrainsMono",
//   },
// });
