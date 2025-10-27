import { KanbanColumn, KanbanTask } from './KanbanBoard.types';

export const sampleColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['task-1', 'task-2'], maxTasks: 10 },
  { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: ['task-3'], maxTasks: 5 },
  { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 3 },
  { id: 'done', title: 'Done', color: '#10b981', taskIds: ['task-4', 'task-5'] },
];

export const sampleTasks: Record<string, KanbanTask> = {
  'task-1': {
    id: 'task-1',
    title: 'Implement drag and drop',
    description: 'Add D&D functionality to kanban cards',
    status: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    tags: ['frontend', 'feature'],
    createdAt: new Date(2024, 0, 10),
    dueDate: new Date(2024, 0, 20),
  },
  'task-2': {
    id: 'task-2',
    title: 'Design task modal',
    description: 'Create modal for editing task details',
    status: 'todo',
    priority: 'medium',
    assignee: 'Jane Smith',
    tags: ['design', 'ui'],
    createdAt: new Date(2024, 0, 11),
    dueDate: new Date(2024, 0, 18),
  },
  'task-3': {
    id: 'task-3',
    title: 'Setup TypeScript',
    status: 'in-progress',
    priority: 'urgent',
    assignee: 'John Doe',
    tags: ['setup', 'typescript'],
    createdAt: new Date(2024, 0, 9),
  },
  'task-4': {
    id: 'task-4',
    title: 'Create project structure',
    description: 'Setup folder structure and initial files',
    status: 'done',
    priority: 'low',
    assignee: 'Jane Smith',
    tags: ['setup'],
    createdAt: new Date(2024, 0, 8),
    dueDate: new Date(2024, 0, 9),
  },
  'task-5': {
    id: 'task-5',
    title: 'Install dependencies',
    status: 'done',
    priority: 'low',
    assignee: 'John Doe',
    tags: ['setup'],
    createdAt: new Date(2024, 0, 8),
  },
};

// Generate many tasks for performance testing
export const generateManyTasks = (count: number): { tasks: Record<string, KanbanTask>; columns: KanbanColumn[] } => {
  const tasks: Record<string, KanbanTask> = {};
  const columns: KanbanColumn[] = [
    { id: 'backlog', title: 'Backlog', color: '#6b7280', taskIds: [] },
    { id: 'todo', title: 'To Do', color: '#3b82f6', taskIds: [] },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b', taskIds: [] },
    { id: 'review', title: 'Review', color: '#8b5cf6', taskIds: [] },
    { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
  ];

  const priorities = ['low', 'medium', 'high', 'urgent'] as const;
  const assignees = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eva Brown'];
  const tags = ['frontend', 'backend', 'design', 'testing', 'bug', 'feature', 'docs', 'refactor'];

  for (let i = 1; i <= count; i++) {
    const taskId = `task-${i}`;
    const columnIndex = Math.floor(Math.random() * columns.length);
    const column = columns[columnIndex];
    
    const task: KanbanTask = {
      id: taskId,
      title: `Task ${i}`,
      description: `Description for task ${i}. This is a sample task created for testing purposes.`,
      status: column.id,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      tags: tags.slice(0, Math.floor(Math.random() * 3) + 1),
      createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
      dueDate: Math.random() > 0.5 ? new Date(2024, 1, Math.floor(Math.random() * 28) + 1) : undefined,
    };

    tasks[taskId] = task;
    column.taskIds.push(taskId);
  }

  return { tasks, columns };
};

export const emptyColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [] },
  { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [] },
  { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
];

export const emptyTasks: Record<string, KanbanTask> = {};