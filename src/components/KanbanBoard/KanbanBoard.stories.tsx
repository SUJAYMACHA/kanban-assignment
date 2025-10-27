import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { KanbanBoard } from './KanbanBoard';
import { KanbanColumn, KanbanTask } from './KanbanBoard.types';
import { 
  sampleColumns, 
  sampleTasks, 
  generateManyTasks, 
  emptyColumns, 
  emptyTasks 
} from './sampleData';
import { moveTaskBetweenColumns, reorderTasks } from '../../utils/task.utils';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A fully featured Kanban board component with drag-and-drop functionality, task management, and responsive design.',
      },
    },
  },
  argTypes: {
    columns: {
      description: 'Array of column configurations',
      control: { type: 'object' },
    },
    tasks: {
      description: 'Record of tasks indexed by task ID',
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

// Interactive wrapper component for stories
const InteractiveKanbanBoard = ({ 
  initialColumns, 
  initialTasks 
}: { 
  initialColumns: KanbanColumn[];
  initialTasks: Record<string, KanbanTask>;
}) => {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);

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
    <div style={{ height: '600px' }}>
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <InteractiveKanbanBoard 
      initialColumns={sampleColumns}
      initialTasks={sampleTasks}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default Kanban board with sample tasks in different columns. Features drag-and-drop, task editing, and WIP limits.',
      },
    },
  },
};

export const EmptyState: Story = {
  render: () => (
    <InteractiveKanbanBoard 
      initialColumns={emptyColumns}
      initialTasks={emptyTasks}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Empty Kanban board showing the state when no tasks exist. Users can create new tasks using the "Add task" buttons.',
      },
    },
  },
};

export const LargeDataset: Story = {
  render: () => {
    const { columns, tasks } = generateManyTasks(50);
    return (
      <InteractiveKanbanBoard 
        initialColumns={columns}
        initialTasks={tasks}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Kanban board with 50+ tasks to test performance and scrolling behavior. Demonstrates virtualization and efficient rendering.',
      },
    },
  },
};

export const MobileView: Story = {
  render: () => (
    <InteractiveKanbanBoard 
      initialColumns={sampleColumns}
      initialTasks={sampleTasks}
    />
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile responsive view of the Kanban board. Columns stack vertically and touch interactions work properly.',
      },
    },
  },
};

export const WithManyColumns: Story = {
  render: () => {
    const manyColumns: KanbanColumn[] = [
      { id: 'backlog', title: 'Backlog', color: '#6b7280', taskIds: ['task-1'] },
      { id: 'todo', title: 'To Do', color: '#3b82f6', taskIds: ['task-2'] },
      { id: 'in-progress', title: 'In Progress', color: '#f59e0b', taskIds: ['task-3'] },
      { id: 'code-review', title: 'Code Review', color: '#8b5cf6', taskIds: [] },
      { id: 'testing', title: 'Testing', color: '#ec4899', taskIds: [] },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: ['task-4', 'task-5'] },
    ];

    return (
      <InteractiveKanbanBoard 
        initialColumns={manyColumns}
        initialTasks={sampleTasks}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Kanban board with 6 columns demonstrating horizontal scrolling and column management.',
      },
    },
  },
};

export const DifferentPriorities: Story = {
  render: () => {
    const priorityTasks: Record<string, KanbanTask> = {
      'urgent-1': {
        id: 'urgent-1',
        title: 'Critical Security Fix',
        description: 'Fix critical security vulnerability in authentication',
        status: 'todo',
        priority: 'urgent',
        assignee: 'Security Team',
        tags: ['security', 'urgent'],
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      },
      'high-1': {
        id: 'high-1',
        title: 'Performance Optimization',
        description: 'Optimize database queries for better performance',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Backend Team',
        tags: ['performance', 'database'],
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
      },
      'medium-1': {
        id: 'medium-1',
        title: 'Update Documentation',
        description: 'Update API documentation with latest changes',
        status: 'todo',
        priority: 'medium',
        assignee: 'Tech Writer',
        tags: ['documentation'],
        createdAt: new Date(),
      },
      'low-1': {
        id: 'low-1',
        title: 'Code Cleanup',
        description: 'Remove unused imports and variables',
        status: 'done',
        priority: 'low',
        assignee: 'Developer',
        tags: ['cleanup', 'refactor'],
        createdAt: new Date(),
      },
    };

    const priorityColumns: KanbanColumn[] = [
      { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['urgent-1', 'medium-1'] },
      { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: ['high-1'] },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: ['low-1'] },
    ];

    return (
      <InteractiveKanbanBoard 
        initialColumns={priorityColumns}
        initialTasks={priorityTasks}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Kanban board showcasing all priority levels (urgent, high, medium, low) with color-coded indicators.',
      },
    },
  },
};

export const Playground: Story = {
  render: () => (
    <InteractiveKanbanBoard 
      initialColumns={sampleColumns}
      initialTasks={sampleTasks}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground for testing all Kanban board features. Try dragging tasks, editing them, and creating new ones.',
      },
    },
  },
};