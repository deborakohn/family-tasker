import React, { useEffect, useMemo, useRef } from 'react';
import { ScrollView, View } from 'react-native';

export default function TimelineColumnsView({ selectedDate, renderDayColumn }) {
  const scrollRef = useRef(null);
  const dayPositionsRef = useRef({});

  const baseDate = new Date(selectedDate + 'T12:00:00');
  const weekStart = new Date(baseDate);
  const mondayOffset = (baseDate.getDay() + 6) % 7;
  weekStart.setDate(baseDate.getDate() - mondayOffset);

  const selectedIndex = useMemo(() => {
    const selected = new Date(selectedDate + 'T12:00:00');
    const selectedNoon = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 12, 0, 0, 0);
    const weekStartNoon = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate(), 12, 0, 0, 0);
    const diffDays = Math.round((selectedNoon - weekStartNoon) / (24 * 60 * 60 * 1000));

    if (diffDays < 0) return 0;
    if (diffDays > 6) return 6;
    return diffDays;
  }, [selectedDate, weekStart]);

  useEffect(() => {
    const x = dayPositionsRef.current[selectedIndex];
    if (typeof x === 'number' && scrollRef.current) {
      scrollRef.current.scrollTo({ x: Math.max(0, x - 12), animated: true });
    }
  }, [selectedIndex]);

  const columns = [];
  for (let offset = 0; offset < 7; offset++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + offset);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateObj = new Date(dateStr + 'T12:00:00');
    const isSelected = dateStr === selectedDate;

    columns.push(
      <View
        key={`week-day-${offset}-${dateStr}`}
        onLayout={(event) => {
          dayPositionsRef.current[offset] = event.nativeEvent.layout.x;
        }}
      >
        {renderDayColumn({
          day,
          month,
          dateStr,
          dateObj,
          isSelected,
          dayIndex: offset
        })}
      </View>
    );
  }

  return (
    <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
      {columns}
    </ScrollView>
  );
}
