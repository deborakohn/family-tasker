import React, { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const toIsoDate = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export default function DateNavigatorPicker({
  visible,
  onClose,
  currentView,
  selectedDate,
  onSelectDate,
  accentColor
}) {
  const [cursorDate, setCursorDate] = useState(new Date(selectedDate + 'T12:00:00'));

  useEffect(() => {
    if (visible) {
      setCursorDate(new Date(selectedDate + 'T12:00:00'));
    }
  }, [visible, selectedDate]);

  const cursorYear = cursorDate.getFullYear();
  const cursorMonth = cursorDate.getMonth();

  const dayCells = useMemo(() => {
    const firstDayIndex = (new Date(cursorYear, cursorMonth, 1).getDay() + 6) % 7;
    const totalDays = new Date(cursorYear, cursorMonth + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);

    return cells;
  }, [cursorYear, cursorMonth]);

  const selectedDateObj = new Date(selectedDate + 'T12:00:00');
  const now = new Date();
  const today = {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate()
  };

  const selectDay = (day) => {
    onSelectDate(toIsoDate(cursorYear, cursorMonth, day));
    onClose();
  };

  const selectMonth = (monthIndex) => {
    const preferredDay = selectedDateObj.getDate();
    const maxDay = new Date(cursorYear, monthIndex + 1, 0).getDate();
    const finalDay = Math.min(preferredDay, maxDay);

    onSelectDate(toIsoDate(cursorYear, monthIndex, finalDay));
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {currentView === 'month' ? (
            <>
              <View style={styles.headerRow}>
                <TouchableOpacity style={styles.navBtn} onPress={() => setCursorDate(new Date(cursorYear - 1, cursorMonth, 1))}>
                  <Text style={styles.navText}>◀</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: accentColor }]}>{cursorYear}</Text>
                <TouchableOpacity style={styles.navBtn} onPress={() => setCursorDate(new Date(cursorYear + 1, cursorMonth, 1))}>
                  <Text style={styles.navText}>▶</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.monthGrid}>
                {MONTHS.map((monthLabel, monthIndex) => {
                  const isSelected =
                    selectedDateObj.getFullYear() === cursorYear &&
                    selectedDateObj.getMonth() === monthIndex;

                  return (
                    <TouchableOpacity
                      key={monthLabel}
                      style={[styles.monthBtn, isSelected && { backgroundColor: accentColor }]}
                      onPress={() => selectMonth(monthIndex)}
                    >
                      <Text style={[styles.monthText, isSelected && styles.dayTextActive]}>{monthLabel}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : (
            <>
              <View style={styles.headerRow}>
                <TouchableOpacity style={styles.navBtn} onPress={() => setCursorDate(new Date(cursorYear, cursorMonth - 1, 1))}>
                  <Text style={styles.navText}>◀</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: accentColor }]}>{MONTHS[cursorMonth]} {cursorYear}</Text>
                <TouchableOpacity style={styles.navBtn} onPress={() => setCursorDate(new Date(cursorYear, cursorMonth + 1, 1))}>
                  <Text style={styles.navText}>▶</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.weekHeaderRow}>
                {WEEK_DAYS.map((day, index) => (
                  <Text key={`${day}-${index}`} style={styles.weekHeaderText}>{day}</Text>
                ))}
              </View>

              <View style={styles.dayGrid}>
                {dayCells.map((day, index) => {
                  if (!day) return <View key={`empty-${index}`} style={styles.dayCell} />;

                  const isSelected =
                    selectedDateObj.getFullYear() === cursorYear &&
                    selectedDateObj.getMonth() === cursorMonth &&
                    selectedDateObj.getDate() === day;
                  const isToday =
                    today.year === cursorYear &&
                    today.month === cursorMonth &&
                    today.day === day;

                  return (
                    <TouchableOpacity
                      key={`day-${day}`}
                      style={[
                        styles.dayCell,
                        styles.dayBtn,
                        isToday && !isSelected && styles.dayBtnToday,
                        isSelected && { backgroundColor: accentColor }
                      ]}
                      onPress={() => selectDay(day)}
                    >
                      <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>{day}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  content: {
    width: '95%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  title: { fontSize: 17, fontWeight: '900' },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6'
  },
  navText: { color: '#111827', fontWeight: '900' },
  weekHeaderRow: { flexDirection: 'row', marginBottom: 6 },
  weekHeaderText: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '700'
  },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '14.28%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  dayBtn: { borderRadius: 8 },
  dayBtnToday: { backgroundColor: '#e5e7eb' },
  dayText: { color: '#1f2937', fontWeight: '700' },
  dayTextActive: { color: '#fff', fontWeight: '900' },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8
  },
  monthBtn: {
    width: '31%',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    alignItems: 'center'
  },
  monthText: { color: '#1f2937', fontSize: 13, fontWeight: '800' },
  cancelBtn: {
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f3f4f6'
  },
  cancelText: { color: '#374151', fontSize: 13, fontWeight: '800' }
});