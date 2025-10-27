import React, { memo, useMemo } from 'react';
import clsx from 'clsx';
import { KanbanCardProps } from './KanbanBoard.types';
import { Avatar } from '../primitives/Avatar';
import { 
  formatDate, 
  isOverdue, 
  getPriorityIndicatorColor, 
  getPriorityBadgeClasses 
} from '../../utils/task.utils';

export const KanbanCard: React.FC<KanbanCardProps> = memo(({
  task,
  isDragging,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEdit(task);
    }
    
    if (e.key === 'Delete') {
      e.preventDefault();
      onDelete(task.id);
    }
  };

  const handleClick = () => {
    // Prevent click when dragging
    if (isDragging) return;
    onEdit(task);
  };

  // Memoize computed values
  const priorityIndicator = useMemo(() => 
    task.priority ? getPriorityIndicatorColor(task.priority) : '', 
    [task.priority]
  );
  
  const priorityBadge = useMemo(() => 
    task.priority ? getPriorityBadgeClasses(task.priority) : '', 
    [task.priority]
  );

  const isTaskOverdue = useMemo(() => 
    task.dueDate ? isOverdue(task.dueDate) : false, 
    [task.dueDate]
  );

  const formattedDueDate = useMemo(() => 
    task.dueDate ? formatDate(task.dueDate) : '', 
    [task.dueDate]
  );

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${task.title}. Status: ${task.status}. ${task.priority ? `Priority: ${task.priority}.` : ''} Press enter to edit, delete to remove.`}
      aria-grabbed={isDragging}
      className={clsx(
        'bg-white border border-neutral-200 rounded-lg p-2.5 shadow-card transition-all duration-200 cursor-grab select-none',
        'hover:shadow-card-hover focus:outline-none focus-visible',
        'active:cursor-grabbing touch-manipulation',
        'sm:hover:scale-105',
        {
          'opacity-50 transform rotate-1 shadow-lg': isDragging,
          [priorityIndicator]: task.priority,
        }
      )}
    >
      {/* Header with title and priority */}
      <div className="flex items-start justify-between mb-1.5">
        <h4 className="font-medium text-sm text-neutral-900 line-clamp-2 flex-1 mr-2">
          {task.title}
        </h4>
        {task.priority && (
          <span className={clsx(
            'text-xs px-1.5 py-0.5 rounded font-medium whitespace-nowrap',
            priorityBadge
          )}>
            {task.priority}
          </span>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map(tag => (
            <span 
              key={tag} 
              className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs text-neutral-500">
              +{task.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer with assignee and due date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {task.assignee && (
            <Avatar name={task.assignee} size="sm" />
          )}
        </div>
        
        {task.dueDate && (
          <div className={clsx(
            'text-xs font-medium',
            {
              'text-red-600': isTaskOverdue,
              'text-neutral-500': !isTaskOverdue,
            }
          )}>
            Due: {formattedDueDate}
          </div>
        )}
      </div>

      {/* Quick actions on hover (optional) */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
          aria-label="Delete task"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
});

KanbanCard.displayName = 'KanbanCard';