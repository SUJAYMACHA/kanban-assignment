import { KanbanTask, Priority } from '../components/KanbanBoard/KanbanBoard.types';
import { format, isAfter } from 'date-fns';

/**
 * Checks if a task is overdue
 */
export const isOverdue = (dueDate: Date): boolean => {
  return isAfter(new Date(), dueDate);
};

/**
 * Gets initials from a name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Formats a date for display
 */
export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd');
};

/**
 * Calculates priority color classes
 */
export const getPriorityColor = (priority: Priority): string => {
  const colors = {
    low: 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
    medium: 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500',
    high: 'bg-orange-100 text-orange-700 border-l-4 border-orange-500',
    urgent: 'bg-red-100 text-red-700 border-l-4 border-red-500',
  };
  return colors[priority];
};

/**
 * Gets priority indicator color
 */
export const getPriorityIndicatorColor = (priority: Priority): string => {
  const colors = {
    low: 'border-blue-500',
    medium: 'border-yellow-500',
    high: 'border-orange-500',
    urgent: 'border-red-500',
  };
  return colors[priority];
};

/**
 * Gets priority badge classes
 */
export const getPriorityBadgeClasses = (priority: Priority): string => {
  const classes = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };
  return classes[priority];
};

/**
 * Reorders tasks after drag and drop within the same column
 */
export const reorderTasks = (
  tasks: string[],
  startIndex: number,
  endIndex: number
): string[] => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves task between columns
 */
export const moveTaskBetweenColumns = (
  sourceColumn: string[],
  destColumn: string[],
  sourceIndex: number,
  destIndex: number
): { source: string[]; destination: string[] } => {
  const sourceClone = Array.from(sourceColumn);
  const destClone = Array.from(destColumn);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destIndex, 0, removed);

  return {
    source: sourceClone,
    destination: destClone,
  };
};

/**
 * Generates a unique ID for new tasks
 */
export const generateTaskId = (): string => {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validates task data
 */
export const validateTask = (task: Partial<KanbanTask>): string[] => {
  const errors: string[] = [];
  
  if (!task.title || task.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (task.title && task.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  
  if (task.description && task.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  
  return errors;
};

/**
 * Creates a new task with default values
 */
export const createNewTask = (columnId: string, overrides?: Partial<KanbanTask>): KanbanTask => {
  return {
    id: generateTaskId(),
    title: '',
    status: columnId,
    priority: 'medium',
    tags: [],
    createdAt: new Date(),
    ...overrides,
  };
};