import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, TextInput } from 'react-native';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { Settings, User } from 'lucide-react-native';

export default function DashboardScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useContext(AuthContext);
  
  // Modals State
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/projects', { title: newTitle, description: newDesc });
      setProjectModalVisible(false);
      setNewTitle('');
      setNewDesc('');
      fetchProjects();
    } catch (error) {
      console.error("Failed to create project", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Project', { id: item._id, title: item.title })}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {item.description || 'No description provided.'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Projects</Text>
          <Text style={styles.headerSubtitle}>Welcome back, {user?.name}</Text>
        </View>
        <TouchableOpacity onPress={() => setSettingsModalVisible(true)} style={styles.iconBtn}>
          <Settings color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createBtn} onPress={() => setProjectModalVisible(true)}>
        <Text style={styles.createBtnText}>+ New Project</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 50 }} />
      ) : projects.length === 0 ? (
        <Text style={styles.emptyText}>No projects found. Create one above!</Text>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* CREATE PROJECT MODAL */}
      <Modal animationType="slide" transparent={true} visible={projectModalVisible}>
        <View style={styles.modalBg}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Create Project</Text>
            
            <TextInput style={styles.input} placeholder="Project Title" placeholderTextColor="#aaa" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Description" placeholderTextColor="#aaa" multiline value={newDesc} onChangeText={setNewDesc} />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setProjectModalVisible(false)} disabled={isSubmitting}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreateProject} disabled={isSubmitting || !newTitle}>
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Create</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SETTINGS / PROFILE MODAL */}
      <Modal animationType="fade" transparent={true} visible={settingsModalVisible}>
        <View style={styles.modalBg}>
          <View style={styles.modalView}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
              <Text style={styles.modalTitle}>Profile & Settings</Text>
              <User color="#4f46e5" size={28} />
            </View>
            
            <View style={styles.profileSection}>
              <Text style={styles.profileLabel}>Name</Text>
              <Text style={styles.profileValue}>{user?.name}</Text>
              
              <Text style={styles.profileLabel}>Email</Text>
              <Text style={styles.profileValue}>{user?.email}</Text>
              
              <Text style={styles.profileLabel}>Account Status</Text>
              <Text style={[styles.profileValue, { color: '#22c55e' }]}>Active via Mobile App</Text>
            </View>

            <TouchableOpacity onPress={logout} style={styles.logoutFullBtn}>
              <Text style={styles.logoutText}>Sign Out completely</Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setSettingsModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  iconBtn: { backgroundColor: '#1e293b', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#334155' },
  createBtn: { backgroundColor: '#4f46e5', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#1e293b', padding: 20, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  cardDesc: { fontSize: 14, color: '#94a3b8' },
  emptyText: { color: '#94a3b8', textAlign: 'center', marginTop: 50 },
  
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalView: { width: '90%', backgroundColor: '#1e293b', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 0 },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
  cancelBtn: { padding: 10, marginRight: 15, justifyContent: 'center' },
  cancelBtnText: { color: '#94a3b8', fontSize: 16 },
  submitBtn: { backgroundColor: '#4f46e5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, justifyContent: 'center' },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  profileSection: { backgroundColor: '#0f172a', padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  profileLabel: { color: '#64748b', fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 4 },
  profileValue: { color: '#e2e8f0', fontSize: 16, marginBottom: 15 },
  logoutFullBtn: { backgroundColor: '#ef444420', paddingHorizontal: 15, paddingVertical: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ef444450' },
  logoutText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 },
});
