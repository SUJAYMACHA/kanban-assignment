import React, { useState, useCallback, useMemo } from 'react';
import { KanbanViewProps, KanbanTask } from './KanbanBoard.types';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

export const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  
  const {
    draggedTaskId,
    dropTargetColumn,
    dropTargetIndex,
  } = useDragAndDrop();

  // Organize tasks by column for efficient lookup
  const tasksByColumn = useMemo(() => {
    const result: Record<string, KanbanTask[]> = {};
    
    columns.forEach(column => {
      result[column.id] = column.taskIds
        .map(taskId => tasks[taskId])
        .filter(Boolean); // Filter out any missing tasks
    });
    
    return result;
  }, [columns, tasks]);

  const handleTaskEdit = useCallback((task: KanbanTask) => {
    setSelectedTask(task);
    setSelectedColumnId(null);
    setIsModalOpen(true);
  }, []);

  const handleTaskCreateInColumn = useCallback((columnId: string) => {
    setSelectedTask(null);
    setSelectedColumnId(columnId);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setSelectedColumnId(null);
  }, []);

  const handleTaskSave = useCallback((taskData: KanbanTask, isNew: boolean) => {
    if (isNew) {
      onTaskCreate(taskData.status, taskData);
    } else {
      onTaskUpdate(taskData.id, taskData);
    }
  }, [onTaskCreate, onTaskUpdate]);

  const handleTaskMoveInternal = useCallback((
    taskId: string,
    fromColumn: string,
    toColumn: string,
    newIndex: number
  ) => {
    const sourceColumn = columns.find(col => col.id === fromColumn);
    const targetColumn = columns.find(col => col.id === toColumn);
    
    if (!sourceColumn || !targetColumn) return;

    // Check WIP limits
    if (fromColumn !== toColumn && targetColumn.maxTasks) {
      if (targetColumn.taskIds.length >= targetColumn.maxTasks) {
        // Could show a toast notification here
        console.warn(`Cannot move task: ${targetColumn.title} is at WIP limit`);
        return;
      }
    }

    onTaskMove(taskId, fromColumn, toColumn, newIndex);
  }, [columns, onTaskMove]);

  // Keyboard navigation support
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isModalOpen) {
      handleModalClose();
    }
  }, [isModalOpen, handleModalClose]);

  return (
    <div 
      className="flex h-full min-h-[600px] overflow-x-auto overflow-y-hidden bg-neutral-50 p-3 md:p-6 gap-3 md:gap-6"
      onKeyDown={handleKeyDown}
      role="main"
      aria-label="Kanban board"
    >
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          tasks={tasksByColumn[column.id] || []}
          onTaskMove={handleTaskMoveInternal}
          onTaskCreate={handleTaskCreateInColumn}
          onTaskEdit={handleTaskEdit}
          onTaskDelete={onTaskDelete}
          draggedTaskId={draggedTaskId}
          dropTargetIndex={dropTargetColumn === column.id ? dropTargetIndex : null}
          isDropTarget={dropTargetColumn === column.id}
        />
      ))}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={selectedTask || undefined}
        columnId={selectedColumnId || undefined}
        columns={columns}
        onClose={handleModalClose}
        onSave={handleTaskSave}
        onDelete={selectedTask ? onTaskDelete : undefined}
      />

      {/* Empty state when no columns */}
      {columns.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-neutral-500 px-4">
            <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium mb-2">No columns yet</h3>
            <p className="text-sm">Create columns to start organizing your tasks.</p>
          </div>
        </div>
      )}
    </div>
  );
};