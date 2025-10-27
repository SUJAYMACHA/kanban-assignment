import React, { memo, useState, useMemo } from 'react';
import clsx from 'clsx';
import { KanbanColumnProps } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';
import { Button } from '../primitives/Button';
import { 
  getColumnHeaderClasses, 
  getWipLimitText, 
  isColumnAtLimit,
  getColumnStatus 
} from '../../utils/column.utils';
import { createNewTask } from '../../utils/task.utils';

export const KanbanColumn: React.FC<KanbanColumnProps> = memo(({
  column,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskEdit,
  onTaskDelete,
  draggedTaskId,
  dropTargetIndex,
  isDropTarget,
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  const columnStatus = getColumnStatus(column);
  const isAtLimit = isColumnAtLimit(column);
  const wipLimitText = getWipLimitText(column);
  
  // Filter out the dragged task for visual feedback
  const visibleTasks = useMemo(() => {
    return tasks.filter(task => task.id !== draggedTaskId);
  }, [tasks, draggedTaskId]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const cardHeight = 120; // Approximate card height
    const index = Math.floor(y / cardHeight);
    
    setDragOverIndex(Math.min(index, visibleTasks.length));
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only clear if we're leaving the entire column area
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (!draggedTaskId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const cardHeight = 120;
    const targetIndex = Math.min(Math.floor(y / cardHeight), visibleTasks.length);
    
    // Find the task that's being dragged
    const draggedTask = tasks.find(task => task.id === draggedTaskId);
    if (!draggedTask) return;
    
    onTaskMove(draggedTaskId, draggedTask.status, column.id, targetIndex);
  };

  const handleTaskDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    
    // Add custom drag image for better UX
    const dragElement = e.currentTarget.cloneNode(true) as HTMLElement;
    dragElement.style.transform = 'rotate(5deg)';
    dragElement.style.opacity = '0.8';
    document.body.appendChild(dragElement);
    e.dataTransfer.setDragImage(dragElement, 0, 0);
    
    setTimeout(() => {
      document.body.removeChild(dragElement);
    }, 0);
  };

  const handleTaskDragEnd = () => {
    setDragOverIndex(null);
  };

  const handleAddTask = () => {
    if (isAtLimit) return;
    
    const newTask = createNewTask(column.id, {
      title: 'New Task',
    });
    
    onTaskCreate(column.id, newTask);
  };

  const renderDropZone = (index: number) => {
    const showDropZone = isDropTarget && (dropTargetIndex === index || dragOverIndex === index);
    
    if (!showDropZone) return null;
    
    return (
      <div 
        className="h-2 bg-primary-200 border-2 border-dashed border-primary-400 rounded mx-2 my-1 opacity-75"
        aria-hidden="true"
      />
    );
  };

  return (
    <div 
      className={clsx(
        'flex flex-col bg-neutral-50 rounded-xl border border-neutral-200 h-full',
        'min-w-72 w-72 sm:min-w-80 sm:w-80 md:min-w-80 md:w-80',
        {
          'bg-primary-50 border-primary-200': isDropTarget,
        }
      )}
      role="region"
      aria-label={`${column.title} column. ${tasks.length} tasks.${wipLimitText ? ` ${wipLimitText}` : ''}`}
    >
      {/* Column Header */}
      <div className={getColumnHeaderClasses(column)}>
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
            aria-hidden="true"
          />
          <h3 className="font-semibold text-neutral-900">{column.title}</h3>
          <span className="text-sm text-neutral-500">({tasks.length})</span>
        </div>
        
        {column.maxTasks && (
          <div className={clsx(
            'text-xs font-medium px-2 py-1 rounded',
            {
              'bg-red-100 text-red-700': columnStatus === 'limit',
              'bg-yellow-100 text-yellow-700': columnStatus === 'warning',
              'bg-neutral-100 text-neutral-600': columnStatus === 'normal',
            }
          )}>
            {wipLimitText}
          </div>
        )}
      </div>

      {/* Tasks Container */}
      <div 
        className="flex-1 p-3 space-y-3 overflow-y-auto scrollbar-hide"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ minHeight: '200px' }}
      >
        {renderDropZone(0)}
        
        {visibleTasks.length === 0 && !draggedTaskId && (
          <div className="flex items-center justify-center h-24 text-neutral-400 text-sm border-2 border-dashed border-neutral-200 rounded-lg">
            No tasks yet
          </div>
        )}
        
        {visibleTasks.map((task, index) => (
          <React.Fragment key={task.id}>
            <div className="group relative">
              <KanbanCard
                task={task}
                isDragging={task.id === draggedTaskId}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
                onDragStart={handleTaskDragStart}
                onDragEnd={handleTaskDragEnd}
              />
            </div>
            {renderDropZone(index + 1)}
          </React.Fragment>
        ))}
      </div>

      {/* Add Task Button */}
      <div className="p-3 border-t border-neutral-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddTask}
          disabled={isAtLimit}
          className="w-full justify-start text-neutral-600 hover:text-neutral-900"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isAtLimit ? 'At WIP limit' : 'Add task'}
        </Button>
      </div>
    </div>
  );
});

KanbanColumn.displayName = 'KanbanColumn';