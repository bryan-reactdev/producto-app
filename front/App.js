import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import Home from "./src/screens/HomeScreen/Home";
import Scan from "./src/screens/ScanScreen/Scan";
import Groups from "./src/screens/ProductsScreen/Groups";
import AddProduct from "./src/screens/AddProductScreen/AddProduct";
import { AdminProvider } from './src/contexts/AdminContext';
import AllProducts from "./src/screens/ProductsScreen/AllProducts";
import ProductAssign from "./src/screens/ProductsScreen/ProductAssign";

const Stack = createNativeStackNavigator();

export default function App(){
  const [fontsLoaded] = useFonts({
    'secondary-regular': require('./assets/fonts/Kollektif.ttf'),
    'secondary-bold': require('./assets/fonts/Kollektif-Bold.ttf'),
    'primary-regular': require('./assets/fonts/INTEGRAL-regular.otf'),
    'primary-medium': require('./assets/fonts/INTEGRAL-medium.otf'),
    'primary-bold': require('./assets/fonts/INTEGRAL-bold.otf'),
    'primary-demibold': require('./assets/fonts/INTEGRAL-demibold.otf'),
    'primary-extrabold': require('./assets/fonts/INTEGRAL-extrabold.otf'),
    'primary-heavy': require('./assets/fonts/INTEGRAL-heavy.otf'),
  });

  if (!fontsLoaded) {
    return null; // or <AppLoading /> if using expo-app-loading
  }

  return(
    <AdminProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown:false,  presentation: "transparentModal" 
          }}
        >
          <Stack.Screen name = "Home" component={Home}/>
          <Stack.Screen name = "Scan" component={Scan}/>
          <Stack.Screen name = "AllProducts" component={AllProducts}/>
          <Stack.Screen name = "ProductAssign" component={ProductAssign}/>
          <Stack.Screen name = "Groups" component={Groups}/>
          <Stack.Screen name = "AddProduct" component={AddProduct}/>
        </Stack.Navigator>
      </NavigationContainer>
    </AdminProvider>
  )
}