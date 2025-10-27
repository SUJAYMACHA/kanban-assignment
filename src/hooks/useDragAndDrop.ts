import { useState, useCallback } from 'react';
import { DragState } from '../components/KanbanBoard/KanbanBoard.types';

export interface UseDragAndDropReturn extends DragState {
  handleDragStart: (taskId: string, fromColumn: string) => void;
  handleDragOver: (columnId: string, index?: number) => void;
  handleDragEnd: () => void;
  handleDrop: (toColumn: string, index?: number) => { taskId: string; fromColumn: string; toColumn: string; newIndex: number } | null;
}

export const useDragAndDrop = (): UseDragAndDropReturn => {
  const [state, setState] = useState<DragState>({
    isDragging: false,
    draggedTaskId: null,
    draggedFromColumn: null,
    dropTargetColumn: null,
    dropTargetIndex: null,
  });

  const handleDragStart = useCallback((taskId: string, fromColumn: string) => {
    setState(prev => ({
      ...prev,
      isDragging: true,
      draggedTaskId: taskId,
      draggedFromColumn: fromColumn,
    }));
  }, []);

  const handleDragOver = useCallback((columnId: string, index?: number) => {
    setState(prev => ({
      ...prev,
      dropTargetColumn: columnId,
      dropTargetIndex: index ?? null,
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setState({
      isDragging: false,
      draggedTaskId: null,
      draggedFromColumn: null,
      dropTargetColumn: null,
      dropTargetIndex: null,
    });
  }, []);

  const handleDrop = useCallback((toColumn: string, index?: number): { taskId: string; fromColumn: string; toColumn: string; newIndex: number } | null => {
    if (!state.draggedTaskId || !state.draggedFromColumn) {
      return null;
    }

    const result = {
      taskId: state.draggedTaskId,
      fromColumn: state.draggedFromColumn,
      toColumn,
      newIndex: index ?? 0,
    };

    // Reset state after successful drop
    handleDragEnd();

    return result;
  }, [state.draggedTaskId, state.draggedFromColumn, handleDragEnd]);

  return {
    ...state,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  };
};