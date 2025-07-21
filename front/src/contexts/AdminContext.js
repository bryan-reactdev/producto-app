// front/src/contexts/AdminContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AdminContext = createContext({
  isAdmin: false,
  setIsAdmin: () => {},
  checkPinAndEnable: async (pin) => false,
  disableAdmin: () => {},
});

const ADMIN_KEY = 'isAdmin';
const ADMIN_PIN = '1234'; // TODO: Replace with env/config

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync(ADMIN_KEY);
      setIsAdmin(stored === 'true');
    })();
  }, []);

  const checkPinAndEnable = async (pin) => {
    if (pin === ADMIN_PIN) {
      setIsAdmin(true);
      await SecureStore.setItemAsync(ADMIN_KEY, 'true');
      return true;
    }
    return false;
  };

  const disableAdmin = async () => {
    setIsAdmin(false);
    await SecureStore.deleteItemAsync(ADMIN_KEY);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin, checkPinAndEnable, disableAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext); 