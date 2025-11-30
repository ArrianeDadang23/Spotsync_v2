import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext'; 
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface UserData {
  firstName?: string;
  lastName?: string;
  profileURL?: string;
  [key: string]: any;
}

function UserLostProcedureScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const auth = getAuth();
  const user = auth.currentUser;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [currentUser]);

  const handleGotIt = () => {
    router.push(`/ReportLostItemScreen`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.mainTitle}>Item Lost Procedures</Text>

          <MaterialCommunityIcons
            name="exclamation-thick" 
            size={70}
            color="orange"
            style={styles.icon}
          />

          <View style={styles.remindersBox}>
            <Text style={styles.remindersText}>
              <Text style={{ fontWeight: 'bold' }}>Reminders:</Text> To ensure that any lost item is returned only to the rightful owner and handled with transparency and security, all items found must be surrendered to the Office of Student Affairs (OSA).
            </Text>
          </View>

          <Text style={styles.stepsTitle}>Step by Step</Text>

          <Text style={styles.stepText}>
            1. When the owner sees their lost item listed in the system, they must proceed to fill out the Lost Item Claim Form.
          </Text>
          <Text style={styles.stepText}>
            2. The form requires a detailed description of the item, the estimated date and location it was lost, and any unique identifiers.
          </Text>
          <Text style={styles.stepText}>
            3. After submitting the form, the system will display a match percentage based on how closely the provided details align with the found item.
          </Text>
          <Text style={styles.stepText}>
            4. The owner must then go to the Office of Student Affairs (OSA) for the second phase of verification.
          </Text>
          <Text style={styles.stepText}>
            5. During the visit to OSA, the owner must present valid identification, proof of ownership, and the AI match result shown by the system.
          </Text>
          <Text style={styles.stepText}>
            6. If the OSA verifies the claim and approves it, the item will be released to the rightful owner and the system will mark the item as "Claimed."
          </Text>

          <TouchableOpacity style={styles.gotItButton} onPress={handleGotIt}>
            <Text style={styles.gotItButtonText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  contentContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#FFFFFF', 
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  icon: {
    marginBottom: 15,
  },
  remindersBox: {
    width: '100%',
    padding: 15,
    backgroundColor: '#FFF3CD', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEEBA',
    marginBottom: 20,
  },
  remindersText: {
    fontSize: 16,
    color: '#856404',
    lineHeight: 22,
  },
  stepsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    alignSelf: 'flex-start', 
  },
  stepText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'left', 
    width: '100%', 
  },
  gotItButton: {
    backgroundColor: '#007AFF', 
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
  },
  gotItButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserLostProcedureScreen;