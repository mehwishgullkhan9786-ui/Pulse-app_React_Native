import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

export default function TestDB() {
  const [status, setStatus] = useState('Idle');
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const testFirestore = async () => {
    setStatus('Testing...');
    addLog('Starting Firestore connection test...');
    try {
      addLog('Attempting to add document to "test_connection" collection...');
      const docRef = await addDoc(collection(db, 'test_connection'), {
        test: true,
        timestamp: serverTimestamp(),
        message: 'Hello from Pulse App!'
      });
      addLog(`Success! Document written with ID: ${docRef.id}`);
      setStatus('Success');
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      console.error('Firestore Test Error:', error);
      setStatus('Failed');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0C101A', '#141124']} style={styles.header}>
        <Text style={styles.title}>Database Tester</Text>
        <Text style={styles.status}>Status: {status}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={testFirestore}>
          <Text style={styles.buttonText}>Run Connection Test</Text>
        </TouchableOpacity>

        <Text style={styles.logTitle}>Logs:</Text>
        <ScrollView style={styles.logContainer}>
          {log.map((item, index) => (
            <Text key={index} style={styles.logText}>{item}</Text>
          ))}
          {log.length === 0 && <Text style={styles.emptyLog}>No logs yet. Press the button to start.</Text>}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C101A',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    color: '#EEEEFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: '#00E5FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logTitle: {
    color: '#6060A0',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  logContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 10,
  },
  logText: {
    color: '#EEEEFF',
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  emptyLog: {
    color: '#6060A0',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  }
});
