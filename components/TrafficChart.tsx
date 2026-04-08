import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DATA = [
  { label: "Organic", value: 40, color: "#00ffa3" },
  { label: "Social", value: 28, color: "#ff2d70" },
  { label: "Direct", value: 20, color: "#7d5fff" },
  { label: "Paid", value: 12, color: "#ffb000" },
];

export default function TrafficChart() {
  let currentAngle = 0;

  return (
    <View style={styles.card}>
      <View style={styles.circleWrapper}>
        <View style={styles.trackCircle} />

        {DATA.map((item, index) => {
          const totalSegmentAngle = (item.value / 100) * 360;
          const startAngle = currentAngle;
          currentAngle += totalSegmentAngle;

          const viewsNeeded = Math.ceil(totalSegmentAngle / 90);
          const views = [];

          for (let i = 0; i < viewsNeeded; i++) {
            const rotation =
              i === viewsNeeded - 1
                ? startAngle + totalSegmentAngle - 90
                : startAngle + i * 90;

            views.push(
              <View
                key={`${index}-${i}`}
                style={[
                  styles.segment,
                  {
                    borderTopColor: item.color,
                    transform: [{ rotate: `${rotation}deg` }],
                  },
                ]}
              />,
            );
          }
          return views;
        })}

        <View style={styles.innerCircle}>
          <Text style={styles.totalValue}>100</Text>
          <Text style={styles.totalLabel}>TOTAL</Text>
        </View>
      </View>

      <View style={styles.legendContainer}>
        {DATA.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={styles.legendLeft}>
              <MaterialCommunityIcons
                name="rhombus"
                size={12}
                color={item.color}
                style={styles.legendIcon}
              />

              <Text style={styles.legendLabel}>{item.label}</Text>

              <View style={styles.progressBarWrapper}>
                <View style={styles.progressBarBackground} />
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      backgroundColor: item.color,
                      width: `${item.value}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <Text style={styles.legendPercentage}>{item.value}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    padding: 20,
    width: "94%",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    marginTop: 15,
    alignSelf: "center",
  },

  circleWrapper: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  trackCircle: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },

  segment: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: "transparent",
    borderTopColor: "#fff",
  },

  innerCircle: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#020205",
    justifyContent: "center",
    alignItems: "center",
  },

  totalValue: {
    color: "#00ffa3",
    fontSize: 26,
    fontWeight: "bold",
  },

  totalLabel: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },

  legendContainer: {
    flex: 1,
    marginLeft: 15,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  legendIcon: {
    marginRight: 6,
  },

  legendLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
    width: 60,
  },

  progressBarWrapper: {
    height: 4,
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 4,
    overflow: "hidden",
  },

  progressBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },

  legendPercentage: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    width: 35,
    textAlign: "right",
  },
});
