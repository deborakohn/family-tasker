import { useState } from 'react';
import { Alert } from 'react-native';

import { supabase } from '../services/supabase';

export default function useAppData() {
  const getTodayDateStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const [screen, setScreen] = useState('welcome');
  const [loading, setLoading] = useState(false);
  const [currentModule, setCurrentModule] = useState('tarefas');
  const [currentView, setCurrentView] = useState('day');
  const [activeMemberFilter, setActiveMemberFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(getTodayDateStr());
  const [adminName, setAdminName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [memberName, setMemberName] = useState('');
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignedTo, setTaskAssignedTo] = useState('');
  const [taskRecurrence, setTaskRecurrence] = useState('once');
  const [taskStartTime, setTaskStartTime] = useState('08:00');
  const [taskEndTime, setTaskEndTime] = useState('09:00');
  const [selectedWeeklyDays, setSelectedWeeklyDays] = useState([]);
  const [selectedMonthlyDays, setSelectedMonthlyDays] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState('start');

  const generateGroupCode = () => 'GRP' + Math.floor(1000 + Math.random() * 9000);

  const fetchMembers = async (groupId) => {
    const { data, error } = await supabase.from('membros').select('*').eq('grupo_id', groupId).order('created_at', { ascending: true });
    if (!error && data) setGroupMembers(data);
  };

  const fetchTasks = async (groupId) => {
    const { data: tasksData, error: tErr } = await supabase.from('tarefas').select('*').eq('grupo_id', groupId);
    if (tErr) return;

    const { data: compData } = await supabase.from('tarefas_concluidas').select('*');

    const stitched = (tasksData || []).map(task => {
      const matches = (compData || []).filter(completedTask => completedTask.tarefa_id === task.id).map(completedTask => completedTask.data_conclusao);
      return { ...task, completed_dates: matches };
    });

    setTasksList(stitched);
  };

  const refreshDashboardData = async (groupId) => {
    setLoading(true);
    await Promise.all([fetchMembers(groupId), fetchTasks(groupId)]);
    setLoading(false);
  };

  const resetToTodayDayView = () => {
    setCurrentView('day');
    setSelectedDate(getTodayDateStr());
  };

  const handleCreateGroup = async () => {
    if (!adminName.trim() || !groupName.trim()) return Alert.alert('Erro', 'Preencha os campos!');
    try {
      setLoading(true);
      const accessCode = generateGroupCode();
      const { data: gData, error: gErr } = await supabase.from('grupos').insert([{ nome: groupName, codigo_acesso: accessCode }]).select().single();
      if (gErr) throw gErr;
      const { data: mData, error: mErr } = await supabase.from('membros').insert([{ grupo_id: gData.id, nome: adminName.trim(), cor: '#4f46e5', role: 'admin' }]).select().single();
      if (mErr) throw mErr;

      setActiveGroup(gData);
      setActiveUser(mData);
      await refreshDashboardData(gData.id);
      resetToTodayDayView();
      setScreen('dashboard');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleJoinOrLoginGroup = async () => {
    if (!joinCode.trim() || !memberName.trim()) return Alert.alert('Erro', 'Preencha os campos!');
    try {
      setLoading(true);
      const { data: gData } = await supabase.from('grupos').select('*').eq('codigo_acesso', joinCode.trim().toUpperCase()).maybeSingle();
      if (!gData) return Alert.alert('Erro', 'Grupo não localizado.');

      const { data: mExistente } = await supabase.from('membros').select('*').eq('grupo_id', gData.id).eq('nome', memberName.trim()).maybeSingle();

      if (mExistente) {
        setActiveGroup(gData);
        setActiveUser(mExistente);
        await refreshDashboardData(gData.id);
        resetToTodayDayView();
        setScreen('dashboard');
        return;
      }

      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      const { data: nMembro, error: mErr } = await supabase.from('membros').insert([{ grupo_id: gData.id, nome: memberName.trim(), cor: randomColor, role: 'member' }]).select().single();
      if (mErr) throw mErr;

      setActiveGroup(gData);
      setActiveUser(nMembro);
      await refreshDashboardData(gData.id);
      resetToTodayDayView();
      setScreen('dashboard');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    setShowTimePicker(false);
    setTaskDesc('');
    setTaskAssignedTo('');
    setTaskRecurrence('once');
    setTaskStartTime('08:00');
    setTaskEndTime('09:00');
    setSelectedWeeklyDays([]);
    setSelectedMonthlyDays([]);
  };

  const openEditModal = task => {
    setEditingTask(task);
    setTaskDesc(task.descricao);
    setTaskAssignedTo(task.assigned_to);
    setTaskRecurrence(task.recurrence || 'once');
    setTaskStartTime(task.start_time || '08:00');
    setTaskEndTime(task.end_time || '09:00');
    setSelectedWeeklyDays(task.days && task.recurrence === 'weekly' ? task.days : []);
    setSelectedMonthlyDays(task.days && task.recurrence === 'monthly' ? task.days : []);
    setShowTaskModal(true);
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setTaskAssignedTo(activeUser?.id || '');
    setShowTaskModal(true);
  };

  const openTimePicker = target => {
    setTimePickerTarget(target);
    setShowTimePicker(true);
  };

  const handleConfirmTime = timeValue => {
    if (timePickerTarget === 'start') {
      setTaskStartTime(timeValue);
    } else {
      setTaskEndTime(timeValue);
    }
  };

  const handleCreateTask = async () => {
    if (!taskDesc.trim() || !taskAssignedTo) return Alert.alert('Erro', 'Preencha a descrição!');
    try {
      setLoading(true);
      const finalDaysArray = taskRecurrence === 'weekly' ? selectedWeeklyDays : taskRecurrence === 'monthly' ? selectedMonthlyDays : [];

      if (editingTask) {
        const { error } = await supabase.from('tarefas').update({
          descricao: taskDesc.trim(),
          assigned_to: taskAssignedTo,
          recurrence: taskRecurrence,
          start_time: editingTask.module === 'calendario' ? taskStartTime : null,
          end_time: editingTask.module === 'calendario' ? taskEndTime : null,
          days: finalDaysArray,
        }).eq('id', editingTask.id);
        if (error) throw error;
      } else {
        const payload = {
          grupo_id: activeGroup.id,
          module: currentModule,
          descricao: taskDesc.trim(),
          assigned_to: taskAssignedTo,
          created_by: activeUser.id,
          recurrence: taskRecurrence,
          start_date: selectedDate,
          start_time: currentModule === 'calendario' ? taskStartTime : null,
          end_time: currentModule === 'calendario' ? taskEndTime : null,
          days: finalDaysArray,
        };
        const { error } = await supabase.from('tarefas').insert([payload]);
        if (error) throw error;
      }

      closeTaskModal();
      await fetchTasks(activeGroup.id);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleDeleteTask = async id => {
    const { error } = await supabase.from('tarefas').delete().eq('id', id);
    if (!error) fetchTasks(activeGroup.id);
  };

  const toggleTaskComplete = async (taskId, dateStr) => {
    const task = tasksList.find(item => item.id === taskId);
    if (!task) return;
    const isCompleted = (task.completed_dates || []).includes(dateStr);

    if (isCompleted) {
      await supabase.from('tarefas_concluidas').delete().eq('tarefa_id', taskId).eq('data_conclusao', dateStr);
    } else {
      await supabase.from('tarefas_concluidas').insert([{ tarefa_id: taskId, data_conclusao: dateStr }]);
    }
    fetchTasks(activeGroup.id);
  };

  const navigateDate = direction => {
    const current = new Date(selectedDate + 'T12:00:00');
    if (currentView === 'day') {
      current.setDate(current.getDate() + direction);
    } else if (currentView === 'week') {
      current.setDate(current.getDate() + direction * 7);
    } else {
      current.setMonth(current.getMonth() + direction);
    }
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleLogout = () => {
    setActiveGroup(null);
    setActiveUser(null);
    setTasksList([]);
    setGroupMembers([]);
    setScreen('welcome');
  };

  const switchModule = moduleName => {
    setCurrentModule(moduleName);
    setCurrentView('day');
    setSelectedDate(getTodayDateStr());
    setActiveMemberFilter('all');
  };

  return {
    screen,
    setScreen,
    loading,
    currentModule,
    currentView,
    setCurrentView,
    activeMemberFilter,
    setActiveMemberFilter,
    selectedDate,
    setSelectedDate,
    adminName,
    setAdminName,
    groupName,
    setGroupName,
    joinCode,
    setJoinCode,
    memberName,
    setMemberName,
    activeGroup,
    activeUser,
    setActiveUser,
    groupMembers,
    tasksList,
    showTaskModal,
    showMembersModal,
    setShowMembersModal,
    editingTask,
    taskDesc,
    setTaskDesc,
    taskAssignedTo,
    setTaskAssignedTo,
    taskRecurrence,
    setTaskRecurrence,
    taskStartTime,
    taskEndTime,
    selectedWeeklyDays,
    setSelectedWeeklyDays,
    selectedMonthlyDays,
    setSelectedMonthlyDays,
    showTimePicker,
    setShowTimePicker,
    timePickerTarget,
    fetchMembers,
    handleCreateGroup,
    handleJoinOrLoginGroup,
    closeTaskModal,
    openEditModal,
    openNewTaskModal,
    openTimePicker,
    handleConfirmTime,
    handleCreateTask,
    handleDeleteTask,
    toggleTaskComplete,
    navigateDate,
    handleLogout,
    switchModule,
  };
}