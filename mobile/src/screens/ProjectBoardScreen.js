import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput } from 'react-native';
import api from '../api/axiosConfig';

export default function ProjectBoardScreen({ route, navigation }) {
  const { id } = route.params;
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const { data } = await api.get(`/tickets/project/${id}`);
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [id]);

  const handleCreateTicket = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/tickets', {
        title: newTitle,
        description: newDesc,
        project: id,
        priority: 'Medium',
        status: 'To Do'
      });
      setModalVisible(false);
      setNewTitle('');
      setNewDesc('');
      fetchTickets();
    } catch (error) {
      console.error("Failed to create ticket", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const advanceStatus = async (ticket) => {
    let nextStatus = ticket.status;
    if (ticket.status === 'To Do') nextStatus = 'In Progress';
    else if (ticket.status === 'In Progress') nextStatus = 'Done';
    else if (ticket.status === 'Done') nextStatus = 'To Do';

    setTickets(tickets.map(t => t._id === ticket._id ? { ...t, status: nextStatus } : t));

    try {
      await api.put(`/tickets/${ticket._id}`, { status: nextStatus });
    } catch {
      // Refresh on failure
    }
  };

  const getStatusColor = (status) => {
    if (status === 'To Do') return '#64748b'; 
    if (status === 'In Progress') return '#3b82f6';
    if (status === 'Done') return '#22c55e';
    return '#64748b';
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TicketDetail', { ticket: item })}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.priorityLabel}>{item.priority}</Text>
      </View>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {item.description || "No description"}
      </Text>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20', borderColor: getStatusColor(item.status) + '50' }]}
          onPress={() => advanceStatus(item)}
        >
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </TouchableOpacity>
        <Text style={styles.tapTip}>Tap to advance</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.createBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.createBtnText}>+ Create Ticket</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 50 }} />
      ) : tickets.length === 0 ? (
        <Text style={styles.emptyText}>No tickets mapped to this project yet.</Text>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* CREATE TICKET MODAL */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalBg}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>New Ticket</Text>
            
            <TextInput style={styles.input} placeholder="Task Title" placeholderTextColor="#aaa" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Summary (Optional)" placeholderTextColor="#aaa" multiline value={newDesc} onChangeText={setNewDesc} />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)} disabled={isSubmitting}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreateTicket} disabled={isSubmitting || !newTitle}>
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  createBtn: { backgroundColor: '#4f46e5', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#1e293b', padding: 20, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', flex: 1, marginRight: 10 },
  priorityLabel: { fontSize: 10, fontWeight: 'bold', color: '#f59e0b', backgroundColor: '#f59e0b20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  cardDesc: { fontSize: 13, color: '#94a3b8', marginBottom: 15 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  tapTip: { fontSize: 10, color: '#64748b' },
  emptyText: { color: '#94a3b8', textAlign: 'center', marginTop: 50 },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalView: { width: '90%', backgroundColor: '#1e293b', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  input: { backgroundColor: '#0f172a', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  cancelBtn: { padding: 10, marginRight: 15, justifyContent: 'center' },
  cancelBtnText: { color: '#94a3b8', fontSize: 16 },
  submitBtn: { backgroundColor: '#4f46e5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, justifyContent: 'center' },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
