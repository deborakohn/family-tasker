import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';

export default function TaskFormModal({
  visible,
  onClose,
  onSave,
  editingTask,
  currentModule,
  taskDesc,
  setTaskDesc,
  groupMembers,
  taskAssignedTo,
  setTaskAssignedTo,
  taskStartTime,
  taskEndTime,
  openTimePicker,
  taskRecurrence,
  setTaskRecurrence,
  selectedWeeklyDays,
  setSelectedWeeklyDays,
  selectedMonthlyDays,
  setSelectedMonthlyDays,
}) {
  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editingTask ? 'Editar Atividade' : `Adicionar ao ${currentModule === 'tarefas' ? 'Quadro' : 'Calendário'}`}</Text>
          <TextInput style={styles.input} placeholder="Descrição da atividade..." value={taskDesc} onChangeText={setTaskDesc} />

          <Text style={styles.label}>Atribuir a:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.membersScroll}>
            {groupMembers.map(member => (
              <TouchableOpacity
                key={member.id}
                onPress={() => setTaskAssignedTo(member.id)}
                style={[
                  styles.selectMemberChip,
                  { backgroundColor: member.cor },
                  taskAssignedTo === member.id && styles.selectMemberChipActive,
                ]}
              >
                <Text style={styles.selectMemberChipText}>{member.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {currentModule === 'calendario' && (
            <View style={styles.timeRow}>
              <View style={styles.timeColumn}>
                <Text style={styles.label}>Hora Início</Text>
                <TouchableOpacity style={styles.input} onPress={() => openTimePicker('start')}>
                  <Text style={styles.timeInputText}>{taskStartTime}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.timeColumn}>
                <Text style={styles.label}>Hora Fim</Text>
                <TouchableOpacity style={styles.input} onPress={() => openTimePicker('end')}>
                  <Text style={styles.timeInputText}>{taskEndTime}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text style={styles.label}>Recorrência</Text>
          <View style={styles.recurrenceRow}>
            {[{ id: 'once', label: 'Única' }, { id: 'daily', label: 'Diária' }, { id: 'weekly', label: 'Semanal' }, { id: 'monthly', label: 'Mensal' }].map(rule => (
              <TouchableOpacity key={rule.id} onPress={() => setTaskRecurrence(rule.id)} style={[styles.recChip, taskRecurrence === rule.id && styles.recChipActive]}>
                <Text style={[styles.recChipText, taskRecurrence === rule.id && styles.recChipTextActive]}>{rule.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {taskRecurrence === 'weekly' && (
            <View style={styles.sectionGap}>
              <Text style={styles.label}>Dias da Semana</Text>
              <View style={styles.weekDaysRow}>
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dayLabel, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedWeeklyDays(
                        selectedWeeklyDays.includes(index)
                          ? selectedWeeklyDays.filter(day => day !== index)
                          : [...selectedWeeklyDays, index]
                      );
                    }}
                    style={[styles.dayCircleBtn, selectedWeeklyDays.includes(index) && styles.dayCircleBtnActive]}
                  >
                    <Text style={[styles.dayCircleBtnText, selectedWeeklyDays.includes(index) && styles.dayCircleBtnTextActive]}>{dayLabel}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {taskRecurrence === 'monthly' && (
            <View style={styles.sectionGap}>
              <Text style={styles.label}>Dias do Mês</Text>
              <ScrollView style={styles.monthScroll} nestedScrollEnabled>
                <View style={styles.monthDaysGrid}>
                  {Array.from({ length: 31 }, (_, index) => index + 1).map(dayNumber => (
                    <TouchableOpacity
                      key={dayNumber}
                      onPress={() => {
                        setSelectedMonthlyDays(
                          selectedMonthlyDays.includes(dayNumber)
                            ? selectedMonthlyDays.filter(day => day !== dayNumber)
                            : [...selectedMonthlyDays, dayNumber]
                        );
                      }}
                      style={[styles.monthDayBoxBtn, selectedMonthlyDays.includes(dayNumber) && styles.monthDayBoxBtnActive]}
                    >
                      <Text style={[styles.monthDayBoxBtnText, selectedMonthlyDays.includes(dayNumber) && styles.monthDayBoxBtnTextActive]}>{dayNumber}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          <TouchableOpacity style={styles.btnSuccess} onPress={onSave}><Text style={styles.btnText}>Salvar</Text></TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 16, elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#1f2937', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 11, fontWeight: '800', color: '#4b5563', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 12, color: '#1f2937' },
  timeInputText: { fontSize: 15, color: '#1f2937', fontWeight: '700' },
  membersScroll: { marginBottom: 12 },
  selectMemberChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 6 },
  selectMemberChipActive: { borderWidth: 3, borderColor: '#000' },
  selectMemberChipText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  timeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  timeColumn: { flex: 1 },
  recurrenceRow: { flexDirection: 'row', gap: 4, marginBottom: 12 },
  recChip: { flex: 1, padding: 8, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, alignItems: 'center' },
  recChipActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  recChipText: { fontSize: 10, fontWeight: 'bold', color: '#4b5563' },
  recChipTextActive: { color: '#fff' },
  sectionGap: { marginBottom: 12 },
  weekDaysRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  dayCircleBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  dayCircleBtnActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  dayCircleBtnText: { fontSize: 11, fontWeight: 'bold', color: '#4b5563' },
  dayCircleBtnTextActive: { color: '#fff' },
  monthScroll: { maxHeight: 90, marginTop: 4 },
  monthDaysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  monthDayBoxBtn: { width: 34, height: 34, backgroundColor: '#f3f4f6', borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  monthDayBoxBtnActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  monthDayBoxBtnText: { fontSize: 11, fontWeight: 'bold', color: '#4b5563' },
  monthDayBoxBtnTextActive: { color: '#fff' },
  btnSuccess: { backgroundColor: '#10b981', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cancelButton: { marginTop: 10 },
  cancelText: { color: '#ef4444', textAlign: 'center', marginTop: 4, fontWeight: 'bold' },
});