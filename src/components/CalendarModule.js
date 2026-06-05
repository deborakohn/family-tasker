import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import TimelineColumnsView from './common/TimelineColumnsView';
import SharedMonthView from './common/SharedMonthView';
import MonthCellBadges from './common/MonthCellBadges';
import WeeklyColumnHeader from './common/WeeklyColumnHeader';
import { CalendarCompactCard, CalendarTimelineCard } from './common/TaskCards';
import {
  canManageTask,
  filterTasksByModuleAndMember,
  getResponsibleMember,
  isTaskActiveOnDate
} from '../utils/taskRules';

export default function CalendarModule({
  tasks,
  groupMembers,
  currentView,
  selectedDate,
  activeUser,
  activeMemberFilter,
  handleDeleteTask,
  setSelectedDate,
  setCurrentView,
  onEditTask
}) {
  
  const activeCompromissos = filterTasksByModuleAndMember(tasks, 'calendario', activeMemberFilter);

  const formatMonthTime = (timeStr) => {
    if (!timeStr) return '--';
    const [rawHour = '0', rawMinute = '00'] = timeStr.split(':');
    const parsedHour = parseInt(rawHour, 10);
    const hour = Number.isNaN(parsedHour) ? rawHour : String(parsedHour);
    return `${hour}h${rawMinute}`;
  };

  // --- RENDERS CONDICIONAIS ---

  // 1. Visão Diária: Linha do tempo cronológica filtrada do dia selecionado
  const renderDayView = () => {
    let dayTasks = activeCompromissos.filter(t => isTaskActiveOnDate(t, selectedDate));
    let sortedDayTasks = dayTasks.sort((a, b) => (a.start_time || "00:00").localeCompare(b.start_time || "00:00"));

    return (
      <View style={styles.dayViewWrapper}>
        <View style={styles.dayViewHeader}>
          <Text style={styles.dayViewTitle}>Compromissos do Dia</Text>
          <Text style={styles.dayViewSubtitle}>{selectedDate.split('-').reverse().join('/')}</Text>
        </View>
        
        <ScrollView contentContainerStyle={{ gap: 12 }} showsVerticalScrollIndicator={false}>
          {sortedDayTasks.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum compromisso agendado para este filtro hoje.</Text>
          ) : (
            sortedDayTasks.map(task => {
              const responsible = getResponsibleMember(task, groupMembers, { nome: 'Membro', cor: '#7c3aed' });
              const isOwnerOrAdmin = canManageTask(task, activeUser);
              return (
                <CalendarTimelineCard
                  key={task.id}
                  task={task}
                  responsible={responsible}
                  isOwnerOrAdmin={isOwnerOrAdmin}
                  onEditTask={onEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              );
            })
          )}
        </ScrollView>
      </View>
    );
  };

  // 2. Visão Semanal: Linha do tempo horizontal do mês agrupada por blocos de horários
  const renderWeekView = () => {
    return (
      <TimelineColumnsView
        selectedDate={selectedDate}
        renderDayColumn={({ day, month, dateStr, dateObj, isSelected }) => {
          const dayTasks = activeCompromissos.filter(t => isTaskActiveOnDate(t, dateStr));

          const hourGroups = {};
          dayTasks.forEach(task => {
            const hourKey = (task.start_time || '00:00').split(':')[0] + 'h';
            if (!hourGroups[hourKey]) hourGroups[hourKey] = [];
            hourGroups[hourKey].push(task);
          });
          const sortedHours = Object.keys(hourGroups).sort((a, b) => parseInt(a) - parseInt(b));

          return (
            <View key={day} style={[styles.kanbanColumn, isSelected && styles.highlightedColumn]}>
              <WeeklyColumnHeader dateObj={dateObj} day={day} month={month} accentColor="#7c3aed" />
              <ScrollView contentContainerStyle={{ gap: 12 }} showsVerticalScrollIndicator={false}>
                {sortedHours.length === 0 ? (
                  <Text style={styles.emptyText}>Sem agendamentos</Text>
                ) : (
                  sortedHours.map(hour => (
                    <View key={hour} style={styles.hourBlockRow}>
                      <Text style={styles.hourLabel}>{hour}</Text>
                      <View style={{ flex: 1, gap: 6 }}>
                        {hourGroups[hour].map(task => renderCalendarCard(task))}
                      </View>
                    </View>
                  ))
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
        highlightToday
        renderCellContent={(currentLoopDateStr) => {
          const dayTasks = activeCompromissos.filter(t => isTaskActiveOnDate(t, currentLoopDateStr));

          return (
            <MonthCellBadges
              items={dayTasks}
              groupMembers={groupMembers}
              dateStr={currentLoopDateStr}
              fallbackColor="#7c3aed"
              moreTextColor="#7c3aed"
              moreLabel="eventos"
              getItemText={(task) => formatMonthTime(task.start_time)}
            />
          );
        }}
      />
    );
  };

  const renderCalendarCard = (task) => {
    const responsible = getResponsibleMember(task, groupMembers, { nome: 'Membro', cor: '#7c3aed' });
    const isOwnerOrAdmin = canManageTask(task, activeUser);

    return (
      <CalendarCompactCard
        key={task.id}
        task={task}
        responsible={responsible}
        isOwnerOrAdmin={isOwnerOrAdmin}
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
  kanbanColumn: { width: 290, backgroundColor: '#f9fafb', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#e5e7eb', maxHeight: '100%' },
  highlightedColumn: { borderColor: '#7c3aed', backgroundColor: '#f5f3ff' },
  emptyText: { textAlign: 'center', fontSize: 13, color: '#9ca3af', fontStyle: 'italic', marginVertical: 30 },
  hourBlockRow: { flexDirection: 'row', gap: 6, borderBottomWidth: 1, borderColor: '#f3f4f6', paddingBottom: 8, marginBottom: 4 },
  hourLabel: { fontSize: 13, fontWeight: '900', color: '#7c3aed', minWidth: 35, paddingTop: 2 },
  dayViewWrapper: { flex: 1, width: '100%', backgroundColor: '#fff', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  dayViewHeader: { borderBottomWidth: 1, borderColor: '#e5e7eb', paddingBottom: 10, marginBottom: 16 },
  dayViewTitle: { fontSize: 16, fontWeight: '900', color: '#1f2937' },
  dayViewSubtitle: { fontSize: 13, fontWeight: '700', color: '#7c3aed', marginTop: 2 },

});