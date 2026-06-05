import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MonthCellBadges({
  items,
  groupMembers,
  dateStr,
  fallbackColor,
  getItemText,
  isItemDone,
  maxVisible = 2,
  moreTextColor,
  moreLabel
}) {
  return (
    <View style={styles.cellTasksContainer}>
      {items.slice(0, maxVisible).map((item) => {
        const member = groupMembers.find((m) => m.id === item.assigned_to) || { cor: fallbackColor };
        const done = isItemDone ? isItemDone(item, dateStr) : false;

        return (
          <View key={item.id} style={[styles.miniTaskBadge, { backgroundColor: member.cor || fallbackColor }, done && styles.doneBadge]}>
            <Text numberOfLines={1} style={[styles.miniTaskText, done && styles.doneText]}>
              {getItemText(item)}
            </Text>
          </View>
        );
      })}

      {items.length > maxVisible && (
        <Text style={[styles.moreTasksText, { color: moreTextColor }]}>
          +{items.length - maxVisible} {moreLabel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cellTasksContainer: { flex: 1, width: '100%', overflow: 'hidden' },
  miniTaskBadge: { paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, marginBottom: 2, width: '100%' },
  miniTaskText: { color: '#fff', fontSize: 8, fontWeight: '800' },
  moreTasksText: { fontSize: 8, fontWeight: '800', textAlign: 'center', marginTop: 1 },
  doneBadge: { opacity: 0.4 },
  doneText: { textDecorationLine: 'line-through' }
});