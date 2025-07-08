import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ADMIN_PIN = '1234';

const AdminModeContext = createContext({
  isAdminMode: false,
  toggleAdminMode: () => {},
});

export const AdminModeProvider = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const handlePinSubmit = () => {
    if (pinInput === ADMIN_PIN) {
      setIsAdminMode(true);
      setPinModalVisible(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Invalid PIN');
    }
  };

  const toggleAdminMode = useCallback(() => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      setPinModalVisible(true);
      setPinInput('');
      setPinError('');
    }
  }, [isAdminMode]);

  return (
    <AdminModeContext.Provider value={{ isAdminMode, toggleAdminMode }}>
      {children}
      <Modal
        visible={pinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Admin Access</Text>
            <Text style={styles.modalSubtitle}>Enter PIN to enable admin mode:</Text>
            <TextInput
              style={styles.pinInput}
              value={pinInput}
              onChangeText={setPinInput}
              placeholder="PIN"
              secureTextEntry
              keyboardType="number-pad"
              autoFocus
              maxLength={8}
              onSubmitEditing={handlePinSubmit}
            />
            {!!pinError && <Text style={styles.pinError}>{pinError}</Text>}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setPinModalVisible(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={handlePinSubmit}>
                <Text style={styles.modalBtnText}>Enter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </AdminModeContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#22223b',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  pinInput: {
    width: 120,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#aaa',
    padding: 6,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 4,
    color: '#22223b',
  },
  pinError: {
    color: '#d00',
    fontSize: 13,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#007aff',
    marginHorizontal: 6,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export const useAdminMode = () => useContext(AdminModeContext); 