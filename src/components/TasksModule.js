import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import TimelineColumnsView from './common/TimelineColumnsView';
import SharedMonthView from './common/SharedMonthView';
import MonthCellBadges from './common/MonthCellBadges';
import WeeklyColumnHeader from './common/WeeklyColumnHeader';
import { TaskItemCard } from './common/TaskCards';
import {
  canCheckTask,
  canManageTask,
  filterTasksByModuleAndMember,
  getResponsibleMember,
  isTaskActiveOnDate
} from '../utils/taskRules';

export default function TasksModule({
  tasks,
  groupMembers,
  currentView,
  selectedDate,
  activeUser,
  activeMemberFilter,
  handleDeleteTask,
  toggleTaskComplete,
  setSelectedDate,
  setCurrentView,
  onEditTask
}) {
  
  const activeTasks = filterTasksByModuleAndMember(tasks, 'tarefas', activeMemberFilter);

  // --- RENDERS CONDICIONAIS ---
  
  // 1. Visão Diária: Kanban por Integrante
  const renderDayView = () => {
    // Quando filtramos por um membro específico, faz sentido exibir apenas a coluna dele no Kanban
    const filteredMembers = activeMemberFilter === 'all' 
      ? groupMembers 
      : groupMembers.filter(m => m.id === activeMemberFilter);

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        {filteredMembers.map(member => {
          const memberTasks = activeTasks.filter(t => t.assigned_to === member.id && isTaskActiveOnDate(t, selectedDate));
          return (
            <View key={member.id} style={styles.kanbanColumn}>
              <View style={styles.columnHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={[styles.statusDot, { backgroundColor: member.cor || '#4f46e5' }]} />
                  <Text style={styles.columnTitle}>{member.nome}</Text>
                </View>
                <Text style={styles.columnCounter}>{memberTasks.length}</Text>
              </View>
              <ScrollView contentContainerStyle={{ gap: 10 }} showsVerticalScrollIndicator={false}>
                {memberTasks.length === 0 ? (
                  <Text style={styles.emptyText}>Sem pendências</Text>
                ) : (
                  memberTasks.map(task => renderTaskCard(task, selectedDate))
                )}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  // 2. Visão Semanal: Linha do tempo horizontal do mês inteiro
  const renderWeekView = () => {
    return (
      <TimelineColumnsView
        selectedDate={selectedDate}
        renderDayColumn={({ day, month, dateStr, dateObj, isSelected }) => {
          const dayTasks = activeTasks.filter(t => isTaskActiveOnDate(t, dateStr));

          return (
            <View key={day} style={[styles.kanbanColumn, isSelected && styles.highlightedColumn]}>
              <WeeklyColumnHeader dateObj={dateObj} day={day} month={month} accentColor="#4f46e5" />
              <ScrollView contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={false}>
                {dayTasks.length === 0 ? (
                  <Text style={styles.emptyText}>Livre</Text>
                ) : (
                  dayTasks.map(task => renderTaskCard(task, dateStr))
                )}
              </ScrollView>
            </View>
          );
        }}
      />
    );
  };

  // 3. Visão Mensal: Calendário Grid integrado ao MonthGrid comum
  const renderMonthView = () => {
    return (
      <SharedMonthView
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setCurrentView={setCurrentView}
        renderCellContent={(currentLoopDateStr) => {
          const dayTasks = activeTasks.filter(t => isTaskActiveOnDate(t, currentLoopDateStr));

          return (
            <MonthCellBadges
              items={dayTasks}
              groupMembers={groupMembers}
              dateStr={currentLoopDateStr}
              fallbackColor="#6b7280"
              moreTextColor="#059669"
              moreLabel="itens"
              getItemText={(task) => task.descricao}
              isItemDone={(task, dateStr) => (task.completed_dates || []).includes(dateStr)}
            />
          );
        }}
      />
    );
  };

  const renderTaskCard = (task, dateContextStr) => {
    const responsible = getResponsibleMember(task, groupMembers, { nome: 'Membro', cor: '#6b7280' });
    const isCompleted = (task.completed_dates || []).includes(dateContextStr);
    const canCheck = canCheckTask(task, activeUser);
    const isOwnerOrAdmin = canManageTask(task, activeUser);

    return (
      <TaskItemCard
        key={`${task.id}-${dateContextStr}`}
        task={task}
        responsible={responsible}
        isCompleted={isCompleted}
        canCheck={canCheck}
        isOwnerOrAdmin={isOwnerOrAdmin}
        dateContextStr={dateContextStr}
        onToggleComplete={toggleTaskComplete}
        onEditTask={onEditTask}
        onDeleteTask={handleDeleteTask}
      />
    );
  };

  return (
    <View style={{ flex: 1, width: '100%' }}>
      {currentView === 'day' && renderDayView()}
      {currentView === 'week' && renderWeekView()}
      {currentView === 'month' && renderMonthView()}
    </View>
  );
}

const styles = StyleSheet.create({
  kanbanColumn: { width: 280, backgroundColor: '#f9fafb', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#e5e7eb', maxHeight: '100%' },
  highlightedColumn: { borderColor: '#4f46e5', backgroundColor: '#eef2ff' },
  columnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#e5e7eb', paddingBottom: 8, marginBottom: 12 },
  columnTitle: { fontWeight: '800', fontSize: 14, color: '#374151' },
  columnCounter: { backgroundColor: '#e5e7eb', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontSize: 11, fontWeight: 'bold', color: '#4b5563' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  emptyText: { textAlign: 'center', fontSize: 12, color: '#9ca3af', fontStyle: 'italic', marginVertical: 20 }
});