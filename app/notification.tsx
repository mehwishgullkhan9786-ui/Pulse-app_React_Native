import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function NotificationsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Security Alert",
      message: "Unrecognized sign-in from new device.",
      time: "2 mins ago",
      icon: "shield-alert-outline",
      color: "#FF2D78",
      isNew: true,
    },
    {
      id: 2,
      title: "System Update",
      message: "Version 2.4.1 is now available to install.",
      time: "1 hour ago",
      icon: "cloud-download-outline",
      color: "#00E5FF",
      isNew: true,
    },
    {
      id: 3,
      title: "Action Required",
      message: "Your password will expire in 3 days.",
      time: "5 hours ago",
      icon: "key-outline",
      color: "#FF9800",
      isNew: false,
    },
    {
      id: 4,
      title: "Weekly Summary",
      message: "Your activity report for this week is ready.",
      time: "Yesterday",
      icon: "chart-box-outline",
      color: "#00E5FF",
      isNew: false,
    },
    {
      id: 5,
      title: "Maintenance Scheduled",
      message: "Servers will be down from 2 AM to 4 AM EST.",
      time: "2 days ago",
      icon: "wrench-outline",
      color: "#8A8D9F",
      isNew: false,
    },
  ]);

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isNew: false } : notif,
      ),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isNew: false })),
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
              onPress={() => router.push("../Profile")}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color="#FFF"
              />
            </TouchableOpacity>

            <View style={styles.headercenter}>
              <Text style={styles.text}>Notifications</Text>
              <Text style={styles.text1}>Recent Activity</Text>
            </View>

            <TouchableOpacity
              style={styles.headerright}
              onPress={handleMarkAllAsRead}
            >
              <MaterialCommunityIcons
                name="check-all"
                size={22}
                color="#00E5FF"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recent Notifications</Text>
              <TouchableOpacity onPress={handleMarkAllAsRead}>
                <Text style={styles.markReadText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardGroup}>
              {notifications.map((notif) => (
                <TouchableOpacity
                  key={notif.id}
                  style={[
                    styles.cardRow, 
                    { borderTopColor: notif.color },
                    notif.isNew && styles.cardRowUnread
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleMarkAsRead(notif.id)}
                >
                  <LinearGradient colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0)"]} style={StyleSheet.absoluteFillObject} />
                  
                  <View
                    style={[
                      styles.cardIcon,
                      { backgroundColor: `${notif.color}15`, borderColor: `${notif.color}40` },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={notif.icon as any}
                      size={24}
                      color={notif.color}
                    />
                  </View>

                  <View style={styles.cardTextContainer}>
                    <View style={styles.titleRow}>
                      <Text
                        style={[
                          styles.cardTitle,
                          notif.isNew && styles.cardTitleUnread,
                        ]}
                      >
                        {notif.title}
                      </Text>
                      {notif.isNew && <View style={[styles.newBadge, { backgroundColor: notif.color }]} />}
                    </View>
                    <Text style={styles.cardSubtitle} numberOfLines={2}>
                      {notif.message}
                    </Text>
                    <Text style={styles.timeText}>{notif.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    width: "100%",
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
  text: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 2,
    fontFamily: "SpaceGrotesk",
  },
  text1: {
    fontSize: 12,
    color: "#00E5FF",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  sectionContainer: {
    marginTop: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#8A8D9F",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  markReadText: {
    color: "#00E5FF",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
  cardGroup: {
    gap: 15,
    width: "100%",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    width: "100%",
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderTopWidth: 3,
    overflow: "hidden",
  },
  cardRowUnread: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
  },
  cardTextContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardTitle: {
    color: "#A0A0B0",
    fontSize: 16,
    fontWeight: "700",
  },
  cardTitleUnread: {
    color: "#FFF",
  },
  newBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardSubtitle: {
    color: "#8A8D9F",
    fontSize: 13,
    lineHeight: 18,
  },
  timeText: {
    color: "#6060A0",
    fontSize: 11,
    marginTop: 8,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});

