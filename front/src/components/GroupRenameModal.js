import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput,
  TouchableOpacity, ActivityIndicator,
  TouchableWithoutFeedback, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../screens/AddProductScreen/AddProductStyle';
import { COLORS } from '../StyleConstants';
import { getErrorMessage, retryWithBackoff } from '../utils/errorHandling';
import ErrorMessage from './ErrorMessage';
import * as Animatable from 'react-native-animatable';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://31.220.51.108:3000';

export default function GroupRenameModal({ visible, onClose, group, onRenamed }) {
  const [name, setName] = useState(group?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (visible && group) {
      setName(group.name);
      setError('');
      setSuccess(false);
    }
    if (!visible) {
      setName('');
      setError('');
      setSuccess(false);
    }
  }, [visible, group]);

  const handleRename = async () => {
    if (!name.trim()) {
      setError('Please enter a group name.');
      setSuccess(false);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await retryWithBackoff(() =>
        fetch(`${API_BASE}/api/groups/${group.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim() }),
        })
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(getErrorMessage(err) || 'Failed to rename group');
      }

      setSuccess(true);
      if (onRenamed) onRenamed(name.trim());
      onClose();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={handleClose}>
        <SafeAreaView style={modalStyles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animatable.View
              animation="fadeInUp"
              duration={650}
              delay={40}
              style={modalStyles.modalCard}
              onStartShouldSetResponder={() => true}
              onResponderStart={e => e.stopPropagation && e.stopPropagation()}
            >
              <Text style={styles.inputLabel}>Rename Group</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new group name"
                  value={name}
                  onChangeText={setName}
                  autoFocus
                />
              </View>
              {success && <Text style={{ color: COLORS.textSuccess, marginBottom: 8 }}>Group renamed!</Text>}
              {error && <ErrorMessage message={error} style={{ marginBottom: 8 }} />}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleClose}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={handleRename}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.registerButtonText}>Save</Text>}
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalCard: {
    width: '90%',
    backgroundColor: COLORS.backgroundPrimary || '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
