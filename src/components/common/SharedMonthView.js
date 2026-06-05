import React from 'react';
import MonthGrid from './MonthGrid';

export default function SharedMonthView({
  selectedDate,
  setSelectedDate,
  setCurrentView,
  renderCellContent,
  highlightToday = false
}) {
  return (
    <MonthGrid
      selectedDate={selectedDate}
      highlightToday={highlightToday}
      onDateSelect={(dateStr) => {
        setSelectedDate(dateStr);
        setCurrentView('day');
      }}
      renderCellContent={renderCellContent}
    />
  );
}
