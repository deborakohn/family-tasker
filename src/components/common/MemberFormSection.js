import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MEMBER_COLOR_OPTIONS = ['#4f46e5', '#059669', '#dc2626', '#ea580c', '#0284c7', '#7c3aed', '#d946ef', '#0f766e'];

export default function MemberFormSection({
  activeUser,
  editingMemberId,
  memberFormName,
  setMemberFormName,
  memberFormColor,
  setMemberFormColor,
  memberFormRole,
  setMemberFormRole,
  isEditingSelfAdmin,
  onSaveMember,
  onResetForm,
}) {
  if (activeUser?.role !== 'admin') {
    return null;
  }

  return (
    <View style={styles.formSection}>
      <Text style={styles.label}>{editingMemberId ? 'Editar Integrante' : 'Cadastrar Novo Integrante'}</Text>
      <TextInput style={styles.input} placeholder="Nome do familiar..." value={memberFormName} onChangeText={setMemberFormName} />

      <Text style={styles.label}>Cor do Integrante</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorPickerRow}>
        {MEMBER_COLOR_OPTIONS.map(color => (
          <TouchableOpacity key={color} onPress={() => setMemberFormColor(color)} style={[styles.colorDot, { backgroundColor: color }, memberFormColor === color && styles.colorDotActive]} />
        ))}
      </ScrollView>

      <Text style={styles.label}>Papel</Text>
      <View style={styles.roleRow}>
        <TouchableOpacity
          disabled={isEditingSelfAdmin}
          onPress={() => setMemberFormRole('member')}
          style={[
            styles.roleChip,
            memberFormRole === 'member' && styles.roleChipActive,
            isEditingSelfAdmin && styles.roleChipDisabled,
          ]}
        >
          <Text style={[styles.roleChipText, memberFormRole === 'member' && styles.roleChipTextActive]}>Membro</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMemberFormRole('admin')} style={[styles.roleChip, memberFormRole === 'admin' && styles.roleChipActive]}>
          <Text style={[styles.roleChipText, memberFormRole === 'admin' && styles.roleChipTextActive]}>Administrador</Text>
        </TouchableOpacity>
      </View>
      {isEditingSelfAdmin && <Text style={styles.adminLockHint}>Seu próprio usuário deve permanecer como Administrador.</Text>}

      <TouchableOpacity style={[styles.btnSuccess, { marginTop: 4 }]} onPress={onSaveMember}><Text style={styles.btnText}>{editingMemberId ? 'Salvar Alterações' : 'Adicionar Integrante'}</Text></TouchableOpacity>
      {editingMemberId && (
        <TouchableOpacity onPress={onResetForm} style={{ marginTop: 8 }}><Text style={styles.linkText}>Cancelar Edição</Text></TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formSection: { marginBottom: 14, borderBottomWidth: 1, paddingBottom: 14, borderColor: '#e5e7eb' },
  label: { fontSize: 11, fontWeight: '800', color: '#4b5563', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 12, color: '#1f2937' },
  btnSuccess: { backgroundColor: '#10b981', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  linkText: { color: '#4f46e5', textAlign: 'center', fontSize: 14, fontWeight: '600' },
  colorPickerRow: { gap: 8, marginBottom: 12, paddingVertical: 2 },
  colorDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: 'transparent' },
  colorDotActive: { borderColor: '#111827', transform: [{ scale: 1.08 }] },
  roleRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  roleChip: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, alignItems: 'center', paddingVertical: 8 },
  roleChipActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  roleChipDisabled: { opacity: 0.45 },
  roleChipText: { color: '#4b5563', fontSize: 12, fontWeight: '700' },
  roleChipTextActive: { color: '#fff' },
  adminLockHint: { color: '#6b7280', fontSize: 11, marginTop: -6, marginBottom: 10, fontWeight: '600' },
});