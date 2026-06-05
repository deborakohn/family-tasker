export const isTaskActiveOnDate = (task, dateStr) => {
  if (dateStr < task.start_date) return false;

  const targetDate = new Date(dateStr + 'T12:00:00');

  if (task.recurrence === 'once') return dateStr === task.start_date;
  if (task.recurrence === 'daily') return true;
  if (task.recurrence === 'weekly') return (task.days || []).includes(targetDate.getDay());
  if (task.recurrence === 'monthly') return (task.days || []).includes(targetDate.getDate());

  return false;
};

export const filterTasksByModuleAndMember = (tasks, moduleName, activeMemberFilter) => {
  return tasks.filter((task) => {
    const isFromModule = task.module === moduleName;
    const matchesMember = activeMemberFilter === 'all' || task.assigned_to === activeMemberFilter;
    return isFromModule && matchesMember;
  });
};

export const getResponsibleMember = (task, groupMembers, fallback) => {
  return groupMembers.find((member) => member.id === task.assigned_to) || fallback;
};

export const canManageTask = (task, activeUser) => {
  return activeUser?.role === 'admin' || activeUser?.id === task.created_by;
};

export const canCheckTask = (task, activeUser) => {
  return activeUser?.role === 'admin' || activeUser?.id === task.assigned_to;
};
