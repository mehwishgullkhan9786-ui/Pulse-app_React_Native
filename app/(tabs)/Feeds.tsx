import React from "react";
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const FEED_DATA = [
  { id: "1", title: "New Milestone", desc: "User growth exceeded expectations today by 12%.", time: "2m ago", icon: "rocket-outline", color: "#00E5FF" },
  { id: "2", title: "System Ready", desc: "Pulse Engine v3.1 successfully initialized.", time: "15m ago", icon: "chip", color: "#7B61FF" },
  { id: "3", title: "Security Alert", desc: "Unauthorized login attempt blocked from JP.", time: "45m ago", icon: "shield-check-outline", color: "#FF2D78" },
  { id: "4", title: "Revenue Up", desc: "Monthly revenue target reached 3 days early.", time: "2h ago", icon: "cash-multiple", color: "#FFB000" },
  { id: "5", title: "New Update", desc: "Version 3.0.1 is ready for deployment.", time: "5h ago", icon: "download-outline", color: "#00C8FF" },
];

export default function FeedsScreen() {
  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={["#0C101A", "#141124", "#0A0B10"]}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>FEEDS</Text>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#00E5FF" />
        </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {FEED_DATA.map((item) => (
          <View key={item.id} style={[styles.feedCard, { borderTopColor: item.color }]}>
            <LinearGradient colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0)"]} style={StyleSheet.absoluteFillObject} />
            <View style={[styles.iconBox, { borderColor: item.color + "40" }]}>
              <MaterialCommunityIcons name={item.icon as any} size={28} color={item.color} />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardTime}>{item.time}</Text>
              </View>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
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
    paddingTop: 40,
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  headerTitle: {
    fontSize: 24,
    color: "#00E5FF",
    fontWeight: "900",
    letterSpacing: 4,
    fontFamily: "SpaceGrotesk",
  },
  scrollContent: {
    padding: 20,
    gap: 15,
  },
  feedCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "SpaceGrotesk",
  },
  cardTime: {
    color: "#6060A0",
    fontSize: 12,
    fontFamily: "JetBrainsMono",
  },
  cardDesc: {
    color: "#A0A0C0",
    fontSize: 14,
    lineHeight: 20,
  },
});
