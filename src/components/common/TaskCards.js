import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export function TaskItemCard({
  task,
  responsible,
  isCompleted,
  canCheck,
  isOwnerOrAdmin,
  dateContextStr,
  onToggleComplete,
  onEditTask,
  onDeleteTask
}) {
  return (
    <TouchableOpacity
      activeOpacity={canCheck ? 0.85 : 1}
      disabled={!canCheck}
      onPress={() => onToggleComplete(task.id, dateContextStr)}
      style={[styles.taskCard, { borderLeftColor: responsible.cor || '#6b7280' }, isCompleted && styles.completedCard]}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
          {isCompleted && <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.taskTitle, isCompleted && styles.completedText]}>{task.descricao}</Text>
          <Text style={styles.taskMeta}>Responsável: {responsible.nome}</Text>
        </View>
      </View>
      {isOwnerOrAdmin && (
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <TouchableOpacity onPress={() => onEditTask(task)} style={styles.editBtn}>
            <Text style={{ color: '#4f46e5', fontSize: 13 }}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDeleteTask(task.id)} style={styles.deleteBtn}>
            <Text style={{ color: '#ef4444' }}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function CalendarTimelineCard({
  task,
  responsible,
  isOwnerOrAdmin,
  onEditTask,
  onDeleteTask
}) {
  return (
    <View style={[styles.dayTimelineRow, { borderLeftColor: responsible.cor || '#7c3aed' }]}>
      <Text style={styles.timelineTime}>{task.start_time?.substring(0, 5)}</Text>
      <View style={styles.timelineCardBody}>
        <Text style={styles.calCardTitle}>{task.descricao}</Text>
        <Text style={styles.calCardTime}>Fim: {task.end_time?.substring(0, 5)}</Text>
        <Text style={[styles.calCardUser, { color: responsible.cor || '#7c3aed' }]}>● {responsible.nome}</Text>
      </View>
      {isOwnerOrAdmin && (
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <TouchableOpacity onPress={() => onEditTask(task)} style={styles.editBtn}>
            <Text style={{ color: '#7c3aed', fontWeight: 'bold' }}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDeleteTask(task.id)} style={styles.deleteBtn}>
            <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export function CalendarCompactCard({
  task,
  responsible,
  isOwnerOrAdmin,
  onEditTask,
  onDeleteTask
}) {
  return (
    <View style={[styles.calCard, { borderLeftColor: responsible.cor || '#7c3aed' }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.calCardTitle}>{task.descricao}</Text>
        <Text style={styles.calCardTime}>⏰ {task.start_time?.substring(0, 5)} - {task.end_time?.substring(0, 5)}</Text>
        <Text style={[styles.calCardUser, { color: responsible.cor || '#7c3aed' }]}>● {responsible.nome}</Text>
      </View>
      {isOwnerOrAdmin && (
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <TouchableOpacity onPress={() => onEditTask(task)} style={styles.editBtn}>
            <Text style={{ color: '#7c3aed', fontWeight: 'bold' }}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDeleteTask(task.id)} style={styles.deleteBtn}>
            <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    elevation: 1
  },
  completedCard: { opacity: 0.5 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#9ca3af',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2
  },
  checkboxChecked: { backgroundColor: '#10b981', borderColor: '#10b981' },
  taskTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  completedText: { textDecorationLine: 'line-through', color: '#9ca3af' },
  taskMeta: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  deleteBtn: { padding: 4 },
  editBtn: { padding: 4 },

  calCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    elevation: 1
  },
  calCardTitle: { fontSize: 13, fontWeight: '700', color: '#1f2937' },
  calCardTime: { fontSize: 11, color: '#6b7280', marginTop: 1, fontWeight: '600' },
  calCardUser: { fontSize: 10, fontWeight: 'bold', marginTop: 2 },

  dayTimelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    marginBottom: 4
  },
  timelineTime: { fontSize: 14, fontWeight: '900', color: '#7c3aed', minWidth: 50 },
  timelineCardBody: { flex: 1, marginLeft: 4 }
});