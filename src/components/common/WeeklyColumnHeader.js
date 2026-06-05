import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const WEEK_DAYS_MAP = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function WeeklyColumnHeader({ dateObj, day, month, accentColor }) {
  return (
    <View style={styles.columnHeaderWeek}>
      <Text style={[styles.weekDayLabel, { color: accentColor }]}>{WEEK_DAYS_MAP[dateObj.getDay()]}</Text>
      <Text style={styles.weekDateLabel}>{day}/{month + 1}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  columnHeaderWeek: {
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    paddingBottom: 6,
    marginBottom: 10,
    alignItems: 'center'
  },
  weekDayLabel: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  weekDateLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginTop: 1
  }
});