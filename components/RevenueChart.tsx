import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const DATA = [
  { month: "JAN", value: 38, colors: ["#00674d", "#019c6b"], glow: false },
  { month: "FEB", value: 52, colors: ["#00674d", "#019c6b"], glow: false },
  { month: "MAR", value: 42, colors: ["#00674d", "#019c6b"], glow: false },
  { month: "APR", value: 65, colors: ["#821a3c", "#d12d5a"], glow: false },
  { month: "MAY", value: 58, colors: ["#00674d", "#019c6b"], glow: false },
  { month: "JUN", value: 85, colors: ["#00ffcc", "#008a6e"], glow: true },
  { month: "JUL", value: 48, colors: ["#4c3db2", "#7a5fff"], glow: false },
];

export default function RevenueChart() {
  const maxBarHeight = 110;

  return (
    <View style={styles.container}>
    
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="triangle" size={10} color="#00ffcc" style={styles.triangleIcon} />
          <Text style={styles.headerText}>MONTHLY REVENUE</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.yearText}>2025</Text>
          <MaterialCommunityIcons name="arrow-right" size={14} color="#7e5aff" />
        </View>
      </View>

     
      <View style={styles.card}>
        <View style={styles.chartArea}>
          {DATA.map((item, index) => {
            const barHeight = (item.value / 100) * maxBarHeight;
            
            return (
              <View key={index} style={styles.barColumn}>
                <View style={styles.barContainer}>
                  {item.glow && (
                    <View style={styles.glowRoot}>
                      <View style={styles.peakGlow} />
                    </View>
                  )}
                  <LinearGradient
                    colors={item.colors as [string, string]}
                    style={[styles.bar, { height: barHeight }]}
                  />
                </View>
                <Text style={styles.monthLabel}>{item.month}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "94%",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  triangleIcon: {
    transform: [{ rotate: "90deg" }],
    marginRight: 10,
  },
  headerText: {
    color: "rgba(98, 98, 158, 0.9)",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 3.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  yearText: {
    color: "#7e5aff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
    marginRight: 8,
  },
  card: {
    backgroundColor: "#0d0d12",
    borderRadius: 24,
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1.5,
    height: 180,
    justifyContent: "flex-end",
  },
  chartArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "100%",
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
  },
  barContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 18,
    position: "relative",
  },
  bar: {
    width: 28,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  glowRoot: {
    position: "absolute",
    top: -25,
    left: -15,
    right: -15,
    bottom: -10,
    zIndex: -1,
    alignItems: "center",
    justifyContent: "center",
  },
  peakGlow: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 255, 204, 0.15)",
    shadowColor: "#00ffcc",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 20,
  },
  monthLabel: {
    color: "#62629e",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});
