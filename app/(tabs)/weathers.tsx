import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
  interpolate,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Weathers() {
  const floatAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(0);
  const [weather , setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading , setLoading] = useState(true);
  const API_KEY = "47ac6d80c8596fd9ddd9df299c5f3691";

  useEffect(() => {
    getWeather();
  }, []);

  const getWeather = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      setWeather(data);

      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Lahore&appid=${API_KEY}&units=metric`);
      const forecastData = await forecastRes.json();
      if (forecastData && forecastData.list) {
        setForecast(forecastData.list.slice(0, 8)); // Set the next 24 hours of data
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getIconName = (mainCondition: string) => {
    switch(mainCondition) {
      case 'Clear': return 'weather-sunny';
      case 'Clouds': return 'weather-cloudy';
      case 'Rain': return 'weather-pouring';
      case 'Snow': return 'weather-snowy';
      case 'Thunderstorm': return 'weather-lightning';
      case 'Drizzle': return 'weather-partly-rainy';
      default: return 'weather-partly-cloudy';
    }
  };


  useEffect(() => {
 
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const floatingIconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(floatAnim.value, [0, 1], [-12, 12]) }],
  }));

  const glowBackgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [0, 1], [0.5, 0.8]),
    transform: [{ scale: interpolate(pulseAnim.value, [0, 1], [0.9, 1.1]) }],
  }));

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={["#0C101A", "#141124", "#0A0B10"]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <Animated.View style={[styles.bgGlow, glowBackgroundStyle]} />

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
       
          <View style={styles.header}>
            <View style={styles.locationContainer}>
              <MaterialCommunityIcons name="map-marker-radius" size={24} color="#00E5FF" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.cityText}>{weather?.name}</Text>
                <Text style={styles.countryText}>{weather?.sys?.country}</Text>
              </View>
            </View>
            
            <View style={styles.profileBtn}>
              <MaterialCommunityIcons name="account-circle" size={45} color="rgba(255, 255, 255, 0.9)" />
            </View>
          </View>

          <View style={styles.heroWrapper}>
            <Animated.View style={[styles.heroIconContainer, floatingIconStyle]}>
               <MaterialCommunityIcons 
                 name={weather?.weather?.[0]?.main === 'Clear' ? "weather-sunny" : weather?.weather?.[0]?.main === 'Clouds' ? "weather-cloudy" : weather?.weather?.[0]?.main === 'Rain' ? "weather-pouring" : "weather-partly-cloudy"} 
                 size={140} 
                 color="#00E5FF" 
                 style={styles.iconDropShadow} 
               />
            </Animated.View>
            
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperatureNumber}>{weather?.main?.temp ? Math.round(weather.main.temp) : "--"}</Text>
              <Text style={styles.temperatureUnit}>°</Text>
            </View>
            
            <Text style={styles.weatherCondition}>{weather?.weather?.[0]?.main || "Loading..."}</Text>
            
            <View style={styles.badgeRow}>
              <View style={styles.glassBadge}>
                <MaterialCommunityIcons name="thermometer" size={16} color="#B4B6C0" />
                <Text style={styles.badgeText}>Feels like {weather?.main?.feels_like ? Math.round(weather.main.feels_like) : "--"}°</Text>
              </View>
              <View style={styles.glassBadge}>
                <MaterialCommunityIcons name="water" size={16} color="#00E5FF" />
                <Text style={styles.badgeText}>{weather?.main?.humidity || "--"}% Hum</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today</Text>
            <Text style={styles.sectionLink}>7 Days ❯</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.hourlyContainer}
            decelerationRate="fast"
          >
            {[
              { 
                 time: "Now", 
                 temp: weather?.main?.temp ? Math.round(weather.main.temp) + "°" : "--°", 
                 icon: getIconName(weather?.weather?.[0]?.main), 
                 active: true, 
                 color: "#00E5FF" 
              },
              ...forecast.slice(0, 5).map((item: any) => {
                 const date = new Date(item.dt * 1000);
                 const timeStr = date.toLocaleTimeString([], {hour: 'numeric', hour12: true});
                 return {
                   time: timeStr,
                   temp: Math.round(item.main.temp) + "°",
                   icon: getIconName(item.weather?.[0]?.main),
                   active: false,
                   color: "#FFB000"
                 };
              })
            ].map((item, idx) => (
              <View key={idx} style={[styles.hourlyCard, item.active && styles.hourlyCardActive]}>
                <Text style={[styles.hourlyTime, item.active && styles.textActive]}>{item.time}</Text>
                <MaterialCommunityIcons name={item.icon as any} size={32} color={item.color} style={{ marginVertical: 12 }} />
                <Text style={[styles.hourlyTemp, item.active && styles.textActive]}>{item.temp}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.gridContainer}>
            <View style={styles.gridCard}>
              <LinearGradient colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0)"]} style={StyleSheet.absoluteFillObject} />
              <MaterialCommunityIcons name="weather-windy" size={28} color="#FF2D70" />
              <Text style={styles.gridValue}>{weather?.wind?.speed ? Math.round(weather.wind.speed * 3.6) : "--"} <Text style={styles.gridUnit}>km/h</Text></Text>
              <Text style={styles.gridLabel}>Wind</Text>
            </View>

            <View style={styles.gridCard}>
              <LinearGradient colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0)"]} style={StyleSheet.absoluteFillObject} />
              <MaterialCommunityIcons name="gauge" size={28} color="#7D5FFF" />
              <Text style={styles.gridValue}>{weather?.main?.pressure || "--"} <Text style={styles.gridUnit}>hPa</Text></Text>
              <Text style={styles.gridLabel}>Pressure</Text>
            </View>

            <View style={styles.gridCard}>
              <LinearGradient colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0)"]} style={StyleSheet.absoluteFillObject} />
              <MaterialCommunityIcons name="eye-outline" size={28} color="#FFB000" />
              <Text style={styles.gridValue}>{weather?.visibility ? (weather.visibility / 1000).toFixed(1) : "--"} <Text style={styles.gridUnit}>km</Text></Text>
              <Text style={styles.gridLabel}>Visibility</Text>
            </View>

            <View style={styles.gridCard}>
              <LinearGradient colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0)"]} style={StyleSheet.absoluteFillObject} />
              <MaterialCommunityIcons name="weather-sunset-up" size={28} color="#FF8C00" />
              <Text style={styles.gridValue} adjustsFontSizeToFit numberOfLines={1}>{weather?.sys?.sunrise ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--"}</Text>
              <Text style={styles.gridLabel}>Sunrise</Text>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0C101A',
  },
  bgGlow: {
    position: 'absolute',
    top: 50,
    left: '10%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    filter: 'blur(50px)', 
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 20,
    marginBottom: 30,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  countryText: {
    fontSize: 14,
    color: '#8A8D9F',
    fontWeight: '600',
    marginTop: 2,
  },
  profileBtn: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "rgba(0, 229, 255, 0.15)",
    borderWidth: 1.5,
    borderColor: "rgba(0, 229, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 12,
  },
  heroWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroIconContainer: {
    marginBottom: -10,
    zIndex: 10,
  },
  iconDropShadow: {
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  temperatureNumber: {
    fontSize: 110,
    fontWeight: '900',
    color: '#FFF',
    lineHeight: 120,
    letterSpacing: -5,
  },
  temperatureUnit: {
    fontSize: 40,
    fontWeight: '600',
    color: '#00E5FF',
    marginTop: 15,
  },
  weatherCondition: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 15,
    letterSpacing: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  glassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeText: {
    color: '#E0E2EB',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A8D9F',
  },
  hourlyContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 15,
  },
  hourlyCard: {
    width: 85,
    paddingVertical: 20,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  hourlyCardActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  hourlyTime: {
    fontSize: 14,
    color: '#8A8D9F',
    fontWeight: '600',
  },
  hourlyTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  textActive: {
    color: '#FFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 15,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  gridCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderTopWidth: 3,
    borderTopColor: "rgba(0, 229, 255, 0.4)",
    overflow: 'hidden',
  },
  gridValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 15,
    marginBottom: 4,
  },
  gridUnit: {
    fontSize: 14,
    color: '#8A8D9F',
    fontWeight: '600',
  },
  gridLabel: {
    fontSize: 13,
    color: '#8A8D9F',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});