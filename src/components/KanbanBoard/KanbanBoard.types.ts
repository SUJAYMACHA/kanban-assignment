export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: string; // column identifier
  priority?: Priority;
  assignee?: string;
  tags?: string[];
  createdAt: Date;
  dueDate?: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  taskIds: string[]; // ordered list of task IDs
  maxTasks?: number; // WIP limit (optional)
}

export interface KanbanViewProps {
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
  onTaskMove: (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => void;
  onTaskCreate: (columnId: string, task: KanbanTask) => void;
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete: (taskId: string) => void;
}

export interface KanbanCardProps {
  task: KanbanTask;
  isDragging: boolean;
  onEdit: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

export interface KanbanColumnProps {
  column: KanbanColumn;
  tasks: KanbanTask[];
  onTaskMove: (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => void;
  onTaskCreate: (columnId: string, task: KanbanTask) => void;
  onTaskEdit: (task: KanbanTask) => void;
  onTaskDelete: (taskId: string) => void;
  draggedTaskId: string | null;
  dropTargetIndex: number | null;
  isDropTarget: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: (columnId: string) => void;
}

export interface TaskModalProps {
  isOpen: boolean;
  task?: KanbanTask;
  columnId?: string;
  columns: KanbanColumn[];
  onClose: () => void;
  onSave: (task: KanbanTask, isNew: boolean) => void;
  onDelete?: (taskId: string) => void;
}

export interface DragState {
  isDragging: boolean;
  draggedTaskId: string | null;
  draggedFromColumn: string | null;
  dropTargetColumn: string | null;
  dropTargetIndex: number | null;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  assignee?: string;
  tags: string[];
  dueDate?: Date;
  status: string;
}

export type FormErrors = Partial<Record<keyof TaskFormData, string>>;