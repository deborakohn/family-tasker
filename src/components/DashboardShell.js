import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import Header from './Header';
import Footer from './Footer';
import TasksModule from './TasksModule';
import CalendarModule from './CalendarModule';

export default function DashboardShell({
  loading,
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
  setShowMembersModal,
  tasksList,
  toggleTaskComplete,
  handleDeleteTask,
  onEditTask,
  onAddPress,
  switchModule,
}) {
  return (
    <View style={styles.container}>
      <Header
        activeGroup={activeGroup}
        activeUser={activeUser}
        currentModule={currentModule}
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeMemberFilter={activeMemberFilter}
        setActiveMemberFilter={setActiveMemberFilter}
        groupMembers={groupMembers}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        navigateDate={navigateDate}
        handleLogout={handleLogout}
        setShowMembersModal={setShowMembersModal}
      />

      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 40 }} />
        ) : currentModule === 'tarefas' ? (
          <TasksModule
            tasks={tasksList}
            groupMembers={groupMembers}
            currentView={currentView}
            selectedDate={selectedDate}
            activeUser={activeUser}
            activeMemberFilter={activeMemberFilter}
            handleDeleteTask={handleDeleteTask}
            toggleTaskComplete={toggleTaskComplete}
            setSelectedDate={setSelectedDate}
            setCurrentView={setCurrentView}
            onEditTask={onEditTask}
          />
        ) : (
          <CalendarModule
            tasks={tasksList}
            groupMembers={groupMembers}
            currentView={currentView}
            selectedDate={selectedDate}
            activeUser={activeUser}
            activeMemberFilter={activeMemberFilter}
            handleDeleteTask={handleDeleteTask}
            setSelectedDate={setSelectedDate}
            setCurrentView={setCurrentView}
            onEditTask={onEditTask}
          />
        )}
      </View>

      <Footer
        currentModule={currentModule}
        switchModule={switchModule}
        onAddPress={onAddPress}
        onMembersPress={() => setShowMembersModal(true)}
        onLogout={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
  body: { flex: 1, padding: 12, paddingBottom: 75 },
});