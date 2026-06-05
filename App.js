import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import useAppData from './src/hooks/useAppData';
import OnboardingFlow from './src/components/OnboardingFlow';
import DashboardShell from './src/components/DashboardShell';
import TaskFormModal from './src/components/TaskFormModal';
import MemberManagementModal from './src/components/MemberManagementModal';
import TimePickerModal from './src/components/common/TimePickerModal';

export default function App() {
  const appData = useAppData();

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingFlow
        screen={appData.screen}
        setScreen={appData.setScreen}
        adminName={appData.adminName}
        setAdminName={appData.setAdminName}
        groupName={appData.groupName}
        setGroupName={appData.setGroupName}
        joinCode={appData.joinCode}
        setJoinCode={appData.setJoinCode}
        memberName={appData.memberName}
        setMemberName={appData.setMemberName}
        handleCreateGroup={appData.handleCreateGroup}
        handleJoinOrLoginGroup={appData.handleJoinOrLoginGroup}
      />

      {appData.screen === 'dashboard' && (
        <DashboardShell
          loading={appData.loading}
          activeGroup={appData.activeGroup}
          activeUser={appData.activeUser}
          currentModule={appData.currentModule}
          currentView={appData.currentView}
          setCurrentView={appData.setCurrentView}
          activeMemberFilter={appData.activeMemberFilter}
          setActiveMemberFilter={appData.setActiveMemberFilter}
          groupMembers={appData.groupMembers}
          selectedDate={appData.selectedDate}
          setSelectedDate={appData.setSelectedDate}
          navigateDate={appData.navigateDate}
          handleLogout={appData.handleLogout}
          setShowMembersModal={appData.setShowMembersModal}
          tasksList={appData.tasksList}
          toggleTaskComplete={appData.toggleTaskComplete}
          handleDeleteTask={appData.handleDeleteTask}
          onEditTask={appData.openEditModal}
          onAddPress={appData.openNewTaskModal}
          switchModule={appData.switchModule}
        />
      )}

      <TaskFormModal
        visible={appData.showTaskModal}
        onClose={appData.closeTaskModal}
        onSave={appData.handleCreateTask}
        editingTask={appData.editingTask}
        currentModule={appData.currentModule}
        taskDesc={appData.taskDesc}
        setTaskDesc={appData.setTaskDesc}
        groupMembers={appData.groupMembers}
        taskAssignedTo={appData.taskAssignedTo}
        setTaskAssignedTo={appData.setTaskAssignedTo}
        taskStartTime={appData.taskStartTime}
        taskEndTime={appData.taskEndTime}
        openTimePicker={appData.openTimePicker}
        taskRecurrence={appData.taskRecurrence}
        setTaskRecurrence={appData.setTaskRecurrence}
        selectedWeeklyDays={appData.selectedWeeklyDays}
        setSelectedWeeklyDays={appData.setSelectedWeeklyDays}
        selectedMonthlyDays={appData.selectedMonthlyDays}
        setSelectedMonthlyDays={appData.setSelectedMonthlyDays}
      />

      <MemberManagementModal
        visible={appData.showMembersModal}
        onClose={() => appData.setShowMembersModal(false)}
        activeUser={appData.activeUser}
        activeGroup={appData.activeGroup}
        groupMembers={appData.groupMembers}
        onMembersChanged={async () => {
          if (appData.activeGroup?.id) await appData.fetchMembers(appData.activeGroup.id);
        }}
        onActiveUserUpdated={updatedUser => appData.setActiveUser(updatedUser)}
      />

      <TimePickerModal
        visible={appData.showTimePicker}
        title={appData.timePickerTarget === 'start' ? 'Selecionar Hora de Início' : 'Selecionar Hora de Fim'}
        initialValue={appData.timePickerTarget === 'start' ? appData.taskStartTime : appData.taskEndTime}
        onClose={() => appData.setShowTimePicker(false)}
        onConfirm={appData.handleConfirmTime}
        accentColor={appData.currentModule === 'tarefas' ? '#059669' : '#7c3aed'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
});