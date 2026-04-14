import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setIsSubmit(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmit(false);
    }
  };

  const handleDemo = async () => {
    setIsSubmit(true);
    try {
      const random = Math.floor(Math.random() * 10000);
      await login(`demo${random}@example.com`, 'password').catch(async () => {});
    } catch (e) {}
    setIsSubmit(false);
  }

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View style={[styles.logoContainer, { padding: 0, overflow: 'hidden' }]}>
          <Image source={require('../../assets/icon.png')} style={{ width: 80, height: 80 }} resizeMode="cover" />
        </View>
        <Text style={styles.title}>Bug Tracker</Text>
      </View>

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isSubmit}>
         {isSubmit ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#0f172a' },
  logoContainer: { padding: 15, backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.2)' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  input: { backgroundColor: '#1e293b', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  button: { backgroundColor: '#4f46e5', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  secondaryButton: { backgroundColor: 'transparent', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 15, borderWidth: 1, borderColor: '#4f46e5' },
  secondaryButtonText: { color: '#4f46e5', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: '#ef4444', textAlign: 'center', marginBottom: 15 },
});
