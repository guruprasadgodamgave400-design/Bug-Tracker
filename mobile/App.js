import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProjectBoardScreen from './src/screens/ProjectBoardScreen';
import TicketDetailScreen from './src/screens/TicketDetailScreen';
import { ActivityIndicator, View, Image, Text } from 'react-native';

import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <Image source={require('./assets/icon.png')} style={{ width: 100, height: 100, marginBottom: 20 }} resizeMode="contain" />
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Bug Tracker</Text>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  const MyTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#0f172a',
      card: '#1e293b',
      text: '#fff',
      border: '#334155',
    },
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
        {user == null ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
            <Stack.Screen 
              name="Project" 
              component={ProjectBoardScreen} 
              options={({ route }) => ({ title: route.params.title, headerBackTitle: 'Back' })}
            />
            <Stack.Screen 
              name="TicketDetail" 
              component={TicketDetailScreen} 
              options={{ title: 'Ticket Details', headerBackTitle: 'Back' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Navigation />
    </AuthProvider>
  );
}
