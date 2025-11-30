import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar, 
  Alert, 
} from 'react-native';
import { useRouter } from 'expo-router'; 
import { getAuth } from 'firebase/auth'; 
import Header from '../components/Header'; 

export default function GuestReportPage() {
  const router = useRouter(); 
  const auth = getAuth(); 
  const currentUser = auth.currentUser; 

  const handleChoice = (type: 'lost' | 'found') => {
    if (!currentUser?.uid) {
      console.error("No user is signed in");
      Alert.alert("Error", "No user session found. Please restart the app."); 
      return;
    }

    const userId = currentUser.uid;

    if (type === "lost") {
      router.replace(`/GuestReportLostScreen`); 
    } else if (type === "found") {
      router.replace(`/GuestReportFoundScreen`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#143447" /> 
       <View style={styles.headerPlaceholder}>
            <Text style={styles.headerText}>SpotSync</Text>
       </View>

      <View style={styles.container}>
        <Text style={styles.title}>
          When losing something doesn’t mean it’s gone forever
        </Text>
        <Text style={styles.subtitle}>Please choose what you want to report:</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.lostButton]}
            onPress={() => handleChoice("lost")}
            activeOpacity={0.7} 
          >
            <Text style={styles.buttonText}>I Lost an Item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.foundButton]}
            onPress={() => handleChoice("found")}
            activeOpacity={0.7}
          >            <Text style={[styles.buttonText, styles.foundButtonText]}>I Found an Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#143447', 
  },
  headerPlaceholder: {
      height: 190,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
   },
   headerText: {
       fontSize: 50,
       fontWeight: 'bold',
       color: '#143447',
   },
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center', 
    paddingHorizontal: 30, 
    paddingBottom: 40, 
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15, 
    lineHeight: 34, 
  },
  subtitle: {
    fontSize: 16,
    color: '#BDDDFC',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%', 
    alignItems: 'center', 
  },
  button: {
    flexDirection: 'row',
    width: '90%', 
    paddingVertical: 18,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, 
    shadowColor: "#000", 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lostButton: {
    backgroundColor: '#FF6347', 
  },
  foundButton: {
    backgroundColor: '#FFFFFF', 
    borderWidth: 1,
    borderColor: '#143447',
  },
  buttonText: {
    color: '#ffffffff', 
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  foundButtonText: {
     color: '#143447', 
  },
  
});