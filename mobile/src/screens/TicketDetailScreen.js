import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../api/axiosConfig';

export default function TicketDetailScreen({ route }) {
  const { ticket } = route.params;
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comments/ticket/${ticket._id}`);
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ticket._id]);

  const handlePostComment = async () => {
    if (!text.trim()) return;
    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/comments/ticket/${ticket._id}`, { text });
      setComments([...comments, data]);
      setText('');
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.user?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.authorName}>{item.user?.name || 'Unknown User'}</Text>
        <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item._id}
        renderItem={renderComment}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={styles.ticketDetails}>
            <Text style={styles.ticketTitle}>{ticket.title}</Text>
            <View style={styles.badges}>
              <Text style={styles.priorityLabel}>{ticket.priority}</Text>
              <Text style={styles.statusLabel}>{ticket.status}</Text>
            </View>
            <Text style={styles.ticketDesc}>{ticket.description || 'No description provided.'}</Text>
            <Text style={styles.sectionTitle}>Comments</Text>
            {loading && <ActivityIndicator size="small" color="#4f46e5" style={{ marginTop: 20 }} />}
            {!loading && comments.length === 0 && <Text style={styles.emptyText}>No comments yet.</Text>}
          </View>
        }
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#94a3b8"
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handlePostComment} disabled={isSubmitting || !text.trim()}>
          {isSubmitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.sendBtnText}>Post</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  ticketDetails: { marginBottom: 20 },
  ticketTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  badges: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  priorityLabel: { fontSize: 12, fontWeight: 'bold', color: '#f59e0b', backgroundColor: '#f59e0b20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },
  statusLabel: { fontSize: 12, fontWeight: 'bold', color: '#3b82f6', backgroundColor: '#3b82f620', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },
  ticketDesc: { fontSize: 14, color: '#94a3b8', marginBottom: 30, lineHeight: 22 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  commentCard: { backgroundColor: '#1e293b', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  authorName: { flex: 1, color: '#e2e8f0', fontWeight: 'bold', fontSize: 14 },
  dateText: { color: '#64748b', fontSize: 12 },
  commentText: { color: '#cbd5e1', fontSize: 14, lineHeight: 20 },
  emptyText: { color: '#64748b', fontStyle: 'italic' },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: '#1e293b', borderTopWidth: 1, borderColor: '#334155', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#0f172a', color: '#fff', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#334155', maxHeight: 100 },
  sendBtn: { backgroundColor: '#4f46e5', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, marginLeft: 10, justifyContent: 'center' },
  sendBtnText: { color: '#fff', fontWeight: 'bold' }
});
