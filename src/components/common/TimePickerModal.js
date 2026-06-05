import React, { useEffect, useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

export default function TimePickerModal({
  visible,
  title,
  initialValue = '08:00',
  onClose,
  onConfirm,
  accentColor = '#4f46e5'
}) {
  const [selectedHour, setSelectedHour] = useState('08');
  const [selectedMinute, setSelectedMinute] = useState('00');

  const normalizedValue = useMemo(() => {
    const [h = '08', m = '00'] = String(initialValue || '08:00').split(':');
    const minuteNearestStep = String(Math.round(Number(m) / 5) * 5).padStart(2, '0');
    const safeMinute = MINUTES.includes(minuteNearestStep) ? minuteNearestStep : '00';
    const safeHour = HOURS.includes(h) ? h : '08';
    return { safeHour, safeMinute };
  }, [initialValue]);

  useEffect(() => {
    if (visible) {
      setSelectedHour(normalizedValue.safeHour);
      setSelectedMinute(normalizedValue.safeMinute);
    }
  }, [visible, normalizedValue]);

  const handleConfirm = () => {
    onConfirm(`${selectedHour}:${selectedMinute}`);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: accentColor }]}>{title}</Text>

          <View style={styles.pickerRow}>
            <View style={styles.column}>
              <Text style={styles.columnLabel}>Hora</Text>
              <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                {HOURS.map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[styles.optionBtn, selectedHour === hour && { backgroundColor: accentColor }]}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text style={[styles.optionText, selectedHour === hour && styles.optionTextActive]}>{hour}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.separator}>:</Text>

            <View style={styles.column}>
              <Text style={styles.columnLabel}>Min</Text>
              <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                {MINUTES.map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[styles.optionBtn, selectedMinute === minute && { backgroundColor: accentColor }]}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text style={[styles.optionText, selectedMinute === minute && styles.optionTextActive]}>{minute}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onClose}>
              <Text style={styles.secondaryBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: accentColor }]} onPress={handleConfirm}>
              <Text style={styles.primaryBtnText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
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
    width: '92%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16
  },
  title: { fontSize: 18, fontWeight: '900', textAlign: 'center', marginBottom: 12 },
  pickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  column: { flex: 1 },
  columnLabel: { fontSize: 11, fontWeight: '800', color: '#6b7280', textAlign: 'center', marginBottom: 8, textTransform: 'uppercase' },
  list: { maxHeight: 190, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, backgroundColor: '#f9fafb' },
  listContent: { padding: 6, gap: 6 },
  optionBtn: { paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  optionText: { color: '#374151', fontSize: 14, fontWeight: '700' },
  optionTextActive: { color: '#fff' },
  separator: { fontSize: 26, fontWeight: '900', color: '#6b7280', marginTop: 16 },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  secondaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center' },
  secondaryBtnText: { color: '#374151', fontWeight: '800' },
  primaryBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '800' }
});