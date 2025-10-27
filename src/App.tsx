import { useState } from 'react';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import { KanbanColumn, KanbanTask } from './components/KanbanBoard/KanbanBoard.types';
import { sampleColumns, sampleTasks } from './components/KanbanBoard/sampleData';
import { moveTaskBetweenColumns, reorderTasks } from './utils/task.utils';

function App() {
  const [columns, setColumns] = useState<KanbanColumn[]>(sampleColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(sampleTasks);

  const handleTaskMove = (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const sourceCol = newColumns.find(col => col.id === fromColumn);
      const targetCol = newColumns.find(col => col.id === toColumn);
      
      if (!sourceCol || !targetCol) return prevColumns;

      if (fromColumn === toColumn) {
        // Reorder within same column
        const currentIndex = sourceCol.taskIds.indexOf(taskId);
        const reorderedTasks = reorderTasks(sourceCol.taskIds, currentIndex, newIndex);
        sourceCol.taskIds = reorderedTasks;
      } else {
        // Move between columns
        const sourceIndex = sourceCol.taskIds.indexOf(taskId);
        const result = moveTaskBetweenColumns(
          sourceCol.taskIds,
          targetCol.taskIds,
          sourceIndex,
          newIndex
        );
        sourceCol.taskIds = result.source;
        targetCol.taskIds = result.destination;
        
        // Update task status
        setTasks(prevTasks => ({
          ...prevTasks,
          [taskId]: {
            ...prevTasks[taskId],
            status: toColumn,
          },
        }));
      }

      return newColumns;
    });
  };

  const handleTaskCreate = (columnId: string, task: KanbanTask) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [task.id]: task,
    }));
    
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.id === columnId 
          ? { ...col, taskIds: [...col.taskIds, task.id] }
          : col
      )
    );
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [taskId]: {
        ...prevTasks[taskId],
        ...updates,
      },
    }));

    // If status changed, move task to new column
    if (updates.status && updates.status !== tasks[taskId]?.status) {
      const oldStatus = tasks[taskId].status;
      setColumns(prevColumns => {
        const newColumns = [...prevColumns];
        const oldCol = newColumns.find(col => col.id === oldStatus);
        const newCol = newColumns.find(col => col.id === updates.status);
        
        if (oldCol && newCol) {
          oldCol.taskIds = oldCol.taskIds.filter(id => id !== taskId);
          newCol.taskIds = [...newCol.taskIds, taskId];
        }
        
        return newColumns;
      });
    }
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      delete newTasks[taskId];
      return newTasks;
    });
    
    setColumns(prevColumns =>
      prevColumns.map(col => ({
        ...col,
        taskIds: col.taskIds.filter(id => id !== taskId),
      }))
    );
  };

  return (
    <div className="h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-neutral-900">Kanban Board Demo</h1>
        <p className="text-sm text-neutral-600">
          A production-grade Kanban board component built with React, TypeScript, and Tailwind CSS
        </p>
      </header>
      
      <main className="h-full pt-4">
        <KanbanBoard
          columns={columns}
          tasks={tasks}
          onTaskMove={handleTaskMove}
          onTaskCreate={handleTaskCreate}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      </main>
    </div>
  );
}

export default App;