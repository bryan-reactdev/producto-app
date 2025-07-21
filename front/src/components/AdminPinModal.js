// front/src/components/AdminPinModal.js
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { SPACING, BORDER_RADIUS, COLORS } from '../StyleConstants';
import * as Animatable from 'react-native-animatable';

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
      <View style={styles.overlay}>
        <Animatable.View
          animation="fadeInUp"
          duration={650}
          delay={40}
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
          onResponderStart={e => e.stopPropagation && e.stopPropagation()}
        >
          <Text style={styles.title}>Enter Admin PIN</Text>
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={setPin}
            placeholder="PIN"
            secureTextEntry
            keyboardType="number-pad"
            autoFocus
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={handleClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: COLORS.backgroundPrimary || '#fff',
    borderRadius: BORDER_RADIUS.base || 12,
    padding: SPACING.lg || 24,
    alignItems: 'center',
  },
  modal: {
    width: 300,
    backgroundColor: COLORS.backgroundPrimary || '#fff',
    borderRadius: BORDER_RADIUS.base || 12,
    padding: SPACING.lg || 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: SPACING.md || 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.borderPrimary || '#ccc',
    borderRadius: BORDER_RADIUS.sm || 8,
    padding: SPACING.sm || 8,
    marginBottom: SPACING.sm || 8,
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: COLORS.textDelete || 'red',
    marginBottom: SPACING.sm || 8,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm || 8,
  },
  button: {
    backgroundColor: COLORS.buttonPrimary || '#007AFF',
    borderRadius: BORDER_RADIUS.sm || 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  buttonText: {
    color: COLORS.textPrimaryContrast || '#fff',
    fontWeight: 'bold',
  },
}); 