import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import DateNavigatorPicker from './common/DateNavigatorPicker';

export default function Header({
  activeGroup,
  activeUser,
  currentModule,
  currentView,
  setCurrentView,
  activeMemberFilter,
  setActiveMemberFilter,
  groupMembers,
  selectedDate,
  setSelectedDate,
  navigateDate,
  handleLogout,
  setShowMembersModal
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Formatação amigável para exibição do mês/ano atual no seletor
  const formatHeaderDate = (dateStr) => {
    const date = new Date(dateStr + "T12:00:00");
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    if (currentView === 'day') {
      return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
    }

    if (currentView === 'week') {
      const start = new Date(date);
      const mondayOffset = (date.getDay() + 6) % 7;
      start.setDate(date.getDate() - mondayOffset);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
      const sameYear = start.getFullYear() === end.getFullYear();

      if (sameMonth) {
        return `${start.getDate()} a ${end.getDate()} de ${months[end.getMonth()]} de ${end.getFullYear()}`;
      }

      if (sameYear) {
        return `${start.getDate()} ${months[start.getMonth()]} a ${end.getDate()} ${months[end.getMonth()]} de ${end.getFullYear()}`;
      }

      return `${start.getDate()} ${months[start.getMonth()]} ${start.getFullYear()} a ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
    } else {
      return `${months[date.getMonth()]} de ${date.getFullYear()}`;
    }
  };

  return (
    <View style={[styles.dashHeader, { backgroundColor: currentModule === 'tarefas' ? '#059669' : '#7c3aed' }]}>
      
      {/* Linha Superior: Nome do Grupo */}
      <View style={styles.headerTopRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerGroupTitle}>{activeGroup?.nome}</Text>
          <Text style={styles.headerMetaText} numberOfLines={1}>
            Código: {activeGroup?.codigo_acesso}  •  Olá, {activeUser?.nome}
          </Text>
        </View>
      </View>

      {/* Seletor de Visões (Abas superiores temporais) */}
      <View style={styles.tabsWrapper}>
        <TouchableOpacity onPress={() => setCurrentView('day')} style={[styles.tabBtn, currentView === 'day' && styles.tabBtnActive]}>
          <Text style={[styles.tabBtnText, currentView === 'day' && styles.tabBtnTextActive]}>Dia</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentView('week')} style={[styles.tabBtn, currentView === 'week' && styles.tabBtnActive]}>
          <Text style={[styles.tabBtnText, currentView === 'week' && styles.tabBtnTextActive]}>Semana</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentView('month')} style={[styles.tabBtn, currentView === 'month' && styles.tabBtnActive]}>
          <Text style={[styles.tabBtnText, currentView === 'month' && styles.tabBtnTextActive]}>Mês</Text>
        </TouchableOpacity>
      </View>

      {/* Filtro Circular de Integrantes */}
      <View style={styles.filterBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={() => setActiveMemberFilter('all')} 
            style={[styles.filterCircleAll, activeMemberFilter === 'all' && styles.filterCircleAllActive]}
          >
            <Text style={[styles.filterCircleAllText, activeMemberFilter === 'all' && styles.filterCircleAllTextActive]}>Todos</Text>
          </TouchableOpacity>

          {groupMembers.map((m) => {
            const initial = m.nome ? m.nome.slice(0, 2).toUpperCase() : 'MB';
            const isSelected = activeMemberFilter === m.id;
            return (
              <TouchableOpacity 
                key={m.id}
                onPress={() => setActiveMemberFilter(m.id)}
                style={[styles.memberAvatarCircle, { backgroundColor: m.cor }, isSelected && styles.memberAvatarCircleActive]}
              >
                <Text style={styles.memberAvatarInitial}>{initial}</Text>
              </TouchableOpacity>
            );
          })}


        </ScrollView>
      </View>

      {/* Seletor Cronológico (< Data >) */}
      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => navigateDate(-1)} style={styles.datePickerArrow}><Text style={styles.arrowText}>◀</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerCenterBtn}>
          <Text style={styles.datePickerText}>{formatHeaderDate(selectedDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateDate(1)} style={styles.datePickerArrow}><Text style={styles.arrowText}>▶</Text></TouchableOpacity>
      </View>

      <DateNavigatorPicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        currentView={currentView}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        accentColor={currentModule === 'tarefas' ? '#059669' : '#7c3aed'}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  dashHeader: { padding: 16, paddingTop: 40, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, elevation: 4 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerGroupTitle: { color: '#fff', fontSize: 20, fontWeight: '900' },
  headerMetaText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600', marginTop: 2 },
  logoutButton: {},
  logoutButtonText: {},
  tabsWrapper: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.15)', padding: 4, borderRadius: 10, marginTop: 12 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#fff' },
  tabBtnText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700' },
  tabBtnTextActive: { color: '#1f2937' },
  filterBarContainer: { marginTop: 12, flexDirection: 'row' },
  filterCircleAll: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, borderRadius: 16, height: 32, justifyContent: 'center' },
  filterCircleAllActive: { backgroundColor: '#fff' },
  filterCircleAllText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  filterCircleAllTextActive: { color: '#1f2937', fontWeight: '900' },
  memberAvatarCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  memberAvatarCircleActive: { borderColor: '#fff', borderWidth: 2, transform: [{ scale: 1.05 }] },
  memberAvatarInitial: { color: '#fff', fontSize: 11, fontWeight: '900' }, datePickerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.12)', borderRadius: 10, padding: 8, marginTop: 12 },
  datePickerArrow: { paddingHorizontal: 12, paddingVertical: 4 },
  datePickerCenterBtn: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  arrowText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  datePickerText: { color: '#fff', fontSize: 13, fontWeight: 'bold' }
});