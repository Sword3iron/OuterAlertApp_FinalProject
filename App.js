import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ThemeProvider from './componentFolder/colorComponent/ThemeContext';

import BottomTabNavigator from './bottomNavigation/BottomNavBar';
import SplashScreen from './screens/Splash';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/SignUp';
import ProfilePage from './screens/Profile';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} screenOptions={{ headerShown: false }}/>
          <Stack.Screen name="Login" component={LoginScreen} screenOptions={{ headerShown: false }}/>
          <Stack.Screen name="SignUp" component={RegisterScreen} screenOptions={{ headerShown: false}}/>
          <Stack.Screen name="HomeTab" component={BottomTabNavigator} screenOptions={{ headerShown: false }}/>
          <Stack.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
} 

