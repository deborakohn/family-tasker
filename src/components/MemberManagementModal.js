import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../services/supabase';
import MemberFormSection from './common/MemberFormSection';

export default function MemberManagementModal({
  visible,
  onClose,
  activeUser,
  activeGroup,
  groupMembers,
  onMembersChanged,
  onActiveUserUpdated
}) {
  const [memberFormName, setMemberFormName] = useState('');
  const [memberFormColor, setMemberFormColor] = useState('#4f46e5');
  const [memberFormRole, setMemberFormRole] = useState('member');
  const [editingMemberId, setEditingMemberId] = useState(null);
  const isEditingSelfAdmin = editingMemberId === activeUser?.id && activeUser?.role === 'admin';

  const formatRoleLabel = (role) => {
    if (role === 'admin') return 'Administrador';
    if (role === 'member') return 'Membro';
    return role;
  };

  const resetMemberForm = () => {
    setMemberFormName('');
    setMemberFormColor('#4f46e5');
    setMemberFormRole('member');
    setEditingMemberId(null);
  };

  const handleClose = () => {
    resetMemberForm();
    onClose();
  };

  const openMemberEditor = (member) => {
    setEditingMemberId(member.id);
    setMemberFormName(member.nome || '');
    setMemberFormColor(member.cor || '#4f46e5');
    setMemberFormRole(member.role || 'member');
  };

  const handleSaveMember = async () => {
    if (!memberFormName.trim()) return Alert.alert('Erro', 'Informe o nome do integrante.');

    if (editingMemberId === activeUser?.id && memberFormRole !== 'admin') {
      return Alert.alert('Aviso', 'Você não pode remover seu próprio papel de administrador.');
    }

    try {
      const payload = {
        nome: memberFormName.trim(),
        cor: memberFormColor,
        role: memberFormRole
      };

      if (editingMemberId) {
        const { data, error } = await supabase.from('membros').update(payload).eq('id', editingMemberId).select().single();
        if (error) throw error;

        if (activeUser?.id === editingMemberId) {
          onActiveUserUpdated(data);
        }
      } else {
        const { error } = await supabase.from('membros').insert([{ grupo_id: activeGroup.id, ...payload }]);
        if (error) throw error;
      }

      resetMemberForm();
      await onMembersChanged();
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (memberId === activeUser?.id) return Alert.alert('Aviso', 'Você não pode se deletar!');

    try {
      const { error } = await supabase.from('membros').delete().eq('id', memberId);
      if (error) throw error;

      if (editingMemberId === memberId) {
        resetMemberForm();
      }

      await onMembersChanged();
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Gerenciamento da Família</Text>

          <MemberFormSection
            activeUser={activeUser}
            editingMemberId={editingMemberId}
            memberFormName={memberFormName}
            setMemberFormName={setMemberFormName}
            memberFormColor={memberFormColor}
            setMemberFormColor={setMemberFormColor}
            memberFormRole={memberFormRole}
            setMemberFormRole={setMemberFormRole}
            isEditingSelfAdmin={isEditingSelfAdmin}
            onSaveMember={handleSaveMember}
            onResetForm={resetMemberForm}
          />

          <Text style={styles.label}>Integrantes Atuais:</Text>
          <ScrollView style={{ maxHeight: 180, marginBottom: 14 }}>
            {groupMembers.map(m => (
              <View key={m.id} style={styles.memberListRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: m.cor }} /><Text style={{ fontWeight: 'bold', color: '#374151' }}>{m.nome} ({formatRoleLabel(m.role)})</Text></View>
                {activeUser?.role === 'admin' && (
                  <View style={styles.memberActionsRow}>
                    <TouchableOpacity onPress={() => openMemberEditor(m)}><Text style={{ color: '#4f46e5', fontSize: 13 }}>✎</Text></TouchableOpacity>
                    {m.id !== activeUser.id && (
                      <TouchableOpacity onPress={() => handleDeleteMember(m.id)}><Text style={{ color: '#ef4444', fontSize: 13 }}>✕</Text></TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.btnPrimary} onPress={handleClose}><Text style={styles.btnText}>Fechar Janela</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 16, elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#1f2937', marginBottom: 16, textAlign: 'center' },
  btnPrimary: { backgroundColor: '#4f46e5', padding: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  memberListRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f3f4f6' },
  memberActionsRow: { flexDirection: 'row', gap: 12, alignItems: 'center' }
});