import { KanbanColumn } from '../components/KanbanBoard/KanbanBoard.types';

/**
 * Generates a unique ID for new columns
 */
export const generateColumnId = (): string => {
  return `column-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Checks if a column is at its WIP limit
 */
export const isColumnAtLimit = (column: KanbanColumn): boolean => {
  return column.maxTasks ? column.taskIds.length >= column.maxTasks : false;
};

/**
 * Checks if a column is approaching its WIP limit (80% or more)
 */
export const isColumnNearLimit = (column: KanbanColumn): boolean => {
  if (!column.maxTasks) return false;
  return column.taskIds.length >= column.maxTasks * 0.8;
};

/**
 * Gets the column status indicator
 */
export const getColumnStatus = (column: KanbanColumn): 'normal' | 'warning' | 'limit' => {
  if (isColumnAtLimit(column)) return 'limit';
  if (isColumnNearLimit(column)) return 'warning';
  return 'normal';
};

/**
 * Gets column header classes based on status
 */
export const getColumnHeaderClasses = (column: KanbanColumn): string => {
  const status = getColumnStatus(column);
  
  const baseClasses = 'flex items-center justify-between p-4 border-b';
  
  switch (status) {
    case 'limit':
      return `${baseClasses} bg-red-50 border-red-200`;
    case 'warning':
      return `${baseClasses} bg-yellow-50 border-yellow-200`;
    default:
      return `${baseClasses} bg-white border-neutral-200`;
  }
};

/**
 * Gets WIP limit indicator text
 */
export const getWipLimitText = (column: KanbanColumn): string => {
  if (!column.maxTasks) return '';
  return `${column.taskIds.length}/${column.maxTasks}`;
};

/**
 * Validates column data
 */
export const validateColumn = (column: Partial<KanbanColumn>): string[] => {
  const errors: string[] = [];
  
  if (!column.title || column.title.trim().length === 0) {
    errors.push('Column title is required');
  }
  
  if (column.title && column.title.length > 50) {
    errors.push('Column title must be less than 50 characters');
  }
  
  if (column.maxTasks && column.maxTasks < 1) {
    errors.push('WIP limit must be at least 1');
  }
  
  if (column.maxTasks && column.maxTasks > 100) {
    errors.push('WIP limit must be less than 100');
  }
  
  return errors;
};

/**
 * Creates a new column with default values
 */
export const createNewColumn = (overrides?: Partial<KanbanColumn>): KanbanColumn => {
  return {
    id: generateColumnId(),
    title: 'New Column',
    color: '#6b7280',
    taskIds: [],
    ...overrides,
  };
};

/**
 * Reorders columns
 */
export const reorderColumns = (
  columns: KanbanColumn[],
  startIndex: number,
  endIndex: number
): KanbanColumn[] => {
  const result = Array.from(columns);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};