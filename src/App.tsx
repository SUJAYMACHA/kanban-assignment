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
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Kanban Board
          </h1>
          <p className="text-sm sm:text-base text-neutral-600">
            A production-grade Kanban board with drag-and-drop, task management, and responsive design
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              React + TypeScript
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-success-500 rounded-full"></span>
              Tailwind CSS
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-warning-500 rounded-full"></span>
              Drag & Drop
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-error-500 rounded-full"></span>
              Accessible
            </span>
          </div>
        </div>
      </header>
      
      <main className="pb-8" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-4">
          <KanbanBoard
            columns={columns}
            tasks={tasks}
            onTaskMove={handleTaskMove}
            onTaskCreate={handleTaskCreate}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        </div>
      </main>
    </div>
  );
}

export default App;