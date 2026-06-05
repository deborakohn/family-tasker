import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function MonthGrid({ selectedDate, onDateSelect, renderCellContent, highlightToday = false }) {
  let baseDate = new Date(selectedDate + "T12:00:00");
  let year = baseDate.getFullYear();
  let month = baseDate.getMonth();
  let startDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
  let totalDays = new Date(year, month + 1, 0).getDate();
  const now = new Date();
  const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  let gridCells = [];
  
  // Preenche os dias vazios do início do mês
  for (let i = 0; i < startDayOfWeek; i++) {
    gridCells.push(<View key={`empty-${i}`} style={styles.calendarCellEmpty} />);
  }

  // Preenche os dias reais do mês
  for (let day = 1; day <= totalDays; day++) {
    let currentLoopDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isSelected = currentLoopDateStr === selectedDate;
    const isToday = currentLoopDateStr === todayDateStr;
    
    gridCells.push(
      <TouchableOpacity 
        key={day} 
        style={[
          styles.calendarCell,
          highlightToday && isToday && !isSelected && styles.calendarCellToday,
          isSelected && styles.calendarCellSelected
        ]}
        onPress={() => onDateSelect(currentLoopDateStr)}
      >
        <Text style={styles.cellDayText}>{day}</Text>
        
        {/* Injeta o conteúdo customizado (Tarefas ou Compromissos) vindo do módulo pai */}
        <View style={styles.cellContentContainer}>
          {renderCellContent(currentLoopDateStr)}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.monthWrapper}>
      <View style={styles.monthHeaderRow}>
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d, i) => (
          <Text key={i} style={styles.monthHeaderCell}>{d}</Text>
        ))}
      </View>
      <View style={styles.monthGrid}>{gridCells}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthWrapper: { width: '100%', backgroundColor: '#fff', padding: 8, borderRadius: 14, borderWidth: 1, borderColor: '#e5e7eb' },
  monthHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e5e7eb', paddingBottom: 6 },
  monthHeaderCell: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 10, color: '#9ca3af' },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  calendarCell: { width: '14.28%', height: 75, padding: 3, justifyContent: 'flex-start', borderWidth: 1, borderColor: '#f3f4f6' },
  calendarCellEmpty: { width: '14.28%', height: 75, backgroundColor: '#f9fafb' },
  calendarCellToday: { backgroundColor: '#f3f4f6' },
  calendarCellSelected: { backgroundColor: '#eef2ff', borderRadius: 8 },
  cellDayText: { fontWeight: '800', fontSize: 11, color: '#4b5563' },
  cellContentContainer: { flex: 1, width: '100%', marginTop: 2, overflow: 'hidden' }
});