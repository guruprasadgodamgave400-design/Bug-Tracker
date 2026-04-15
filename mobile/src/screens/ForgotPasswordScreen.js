import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../api/axiosConfig';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email || !newPassword) {
      setError("Please fill in both fields");
      return;
    }
    
    setIsSubmit(true);
    setError('');
    
    try {
      const response = await api.put('/auth/reset-password', { email, newPassword });
      Alert.alert("Success", response.data.message || "Password successfully reset!");
      navigation.navigate('Login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to reset password. Please try again later.");
      }
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 30 }}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your account email and your requested new password below.</Text>
      </View>

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Account Email"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setNewPassword}
        value={newPassword}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleReset} disabled={isSubmit}>
         {isSubmit ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Reset Password</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: '#94a3b8', fontSize: 14 }}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#0f172a' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
  input: { backgroundColor: '#1e293b', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  button: { backgroundColor: '#4f46e5', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: '#ef4444', textAlign: 'center', marginBottom: 15 },
});
