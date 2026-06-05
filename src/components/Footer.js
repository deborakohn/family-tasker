import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function AppFooter({ currentModule, switchModule, onAddPress, onMembersPress, onLogout }) {
  return (
    <View style={styles.footerBar}>
      <TouchableOpacity style={styles.footerTab} onPress={() => switchModule('tarefas')}>
        <Text style={{ fontSize: 20, opacity: currentModule === 'tarefas' ? 1 : 0.4 }}>📋</Text>
        <Text style={styles.footerTabText}>Tarefas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerTab} onPress={() => switchModule('calendario')}>
        <Text style={{ fontSize: 20, opacity: currentModule === 'calendario' ? 1 : 0.4 }}>📅</Text>
        <Text style={styles.footerTabText}>Agenda</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerTabCenter} onPress={onAddPress}>
        <View style={[styles.plusButton, { backgroundColor: currentModule === 'tarefas' ? '#059669' : '#7c3aed' }]}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>+</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerTab} onPress={onMembersPress}>
        <Text style={{ fontSize: 20 }}>👥</Text>
        <Text style={styles.footerTabText}>Membros</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerTab} onPress={onLogout}>
        <Text style={{ fontSize: 20 }}>🚪</Text>
        <Text style={styles.footerTabText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerBar: { position: 'absolute', bottom: 0, width: '100%', height: 65, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  footerTab: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  footerTabText: { fontSize: 10, color: '#9ca3af', fontWeight: 'bold', marginTop: 2 },
  footerTabCenter: { flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' },
  plusButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginTop: -24, elevation: 4 }
});