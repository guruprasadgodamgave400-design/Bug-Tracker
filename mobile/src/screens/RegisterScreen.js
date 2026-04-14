import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Bug } from 'lucide-react-native';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    setIsSubmit(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View style={styles.logoContainer}>
          <Bug color="#6366f1" size={48} />
        </View>
        <Text style={styles.title}>Create Account</Text>
      </View>

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        autoCapitalize="words"
        onChangeText={setName}
      />
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
      
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isSubmit}>
         {isSubmit ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
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
  errorText: { color: '#ef4444', textAlign: 'center', marginBottom: 15 },
  linkContainer: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#94a3b8', fontSize: 14 }
});
