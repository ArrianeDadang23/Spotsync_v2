import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PLACEHOLDER_COLOR = "#A9A9A9";

interface GuestRatingModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => Promise<void>; 
  isSubmitting: boolean;
}

function GuestRatingModal({ show, onClose, onSubmit, isSubmitting }: GuestRatingModalProps) {
  const router = useRouter(); 
  const [rating, setRating] = useState<number>(0); 
  const [feedback, setFeedback] = useState<string>("");

  const handleStarPress = (index: number) => {
    setRating(index + 1);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Rating Required", "Please select a star rating before submitting.");
      return;
    }
    
    await onSubmit(rating, feedback); 
    
    setRating(0);
    setFeedback("");
    
    router.replace('/GuestReportScreen'); 
  };

  return (
    <Modal
      visible={show}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose} 
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose} 
      >
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <Text style={styles.modalTitle}>Rate Match Accuracy</Text>

          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                <MaterialCommunityIcons
                  name={index < rating ? "star" : "star-outline"}
                  size={40}
                  color={index < rating ? "#FFD700" : "#ccc"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.feedbackInput}
            placeholder="Optional: Provide feedback on the matches..."
            placeholderTextColor={PLACEHOLDER_COLOR}
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
            editable={!isSubmitting}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} disabled={isSubmitting}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton, 
                isSubmitting && styles.buttonDisabled,
                rating === 0 && styles.buttonDisabled 
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting || rating === 0} 
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Rating</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 25,
    width: '90%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', 
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10, 
  },
  feedbackInput: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top', 
    marginBottom: 20,
    fontSize: 16,
    color: '#333', 
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between', 
  },
  closeButton: {
    backgroundColor: '#6c757d', 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1, 
    marginRight: 5, 
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF', 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1, 
    marginLeft: 5, 
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#AECBFA', 
    opacity: 0.7,
  },
});

export default GuestRatingModal;