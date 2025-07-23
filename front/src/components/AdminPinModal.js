import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput,
  StyleSheet, TouchableOpacity
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SPACING, BORDER_RADIUS, COLORS } from '../StyleConstants';
import styles from '../screens/AddProductScreen/AddProductStyle';
import ErrorMessage from './ErrorMessage';

export default function AdminPinModal({ visible, onSubmit, onClose }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const ok = await onSubmit(pin);
    if (!ok) {
      setError('Incorrect PIN');
    } else {
      setPin('');
      setError('');
      onClose();
    }
  };

  const handleClose = () => {
    setPin('');
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <Animatable.View
          animation="fadeInUp"
          duration={650}
          delay={40}
          style={modalStyles.modalCard}
          onStartShouldSetResponder={() => true}
          onResponderStart={e => e.stopPropagation && e.stopPropagation()}
        >
          <Text style={styles.inputLabel}>Enter Admin PIN</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={pin}
              onChangeText={setPin}
              placeholder="PIN"
              secureTextEntry
              keyboardType="number-pad"
              autoFocus
            />
          </View>
          {error && <ErrorMessage message={error} style={{ marginBottom: 8 }} />}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleSubmit}
            >
              <Text style={styles.registerButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    backgroundColor: COLORS.backgroundPrimary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
