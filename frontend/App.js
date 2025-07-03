import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './src/screens/MainScreen';
import ScanScreen from './src/screens/ScanScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import ProductsListScreen from './src/screens/ProductsListScreen';

// Create a stack navigator
const Stack = createNativeStackNavigator();

// Main App component with navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="ProductsList" component={ProductsListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
