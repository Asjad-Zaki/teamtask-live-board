
import KanbanColumn, { TaskStatus } from "./KanbanColumn";
import { getPriorityColor, getLabelColor } from "./kanbanUtils";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/queries/useTasks";

interface KanbanBoardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
}

const KanbanBoard = ({ user }: KanbanBoardProps) => {
  const { data: tasks = [], isLoading } = useTasks();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    progress: tasks.filter(task => task.status === 'progress'),
    review: tasks.filter(task => task.status === 'review'),
    done: tasks.filter(task => task.status === 'done')
  };

  const columns: { id: TaskStatus; title: string; count: number; color: string }[] = [
    { id: "todo", title: "To Do", count: tasksByStatus.todo.length, color: "bg-gray-100" },
    { id: "progress", title: "In Progress", count: tasksByStatus.progress.length, color: "bg-blue-100" },
    { id: "review", title: "In Review", count: tasksByStatus.review.length, color: "bg-yellow-100" },
    { id: "done", title: "Done", count: tasksByStatus.done.length, color: "bg-green-100" }
  ];

  // Role-based permissions
  const permissions = {
    canCreateTasks: user.role === "admin" || user.role === "project_manager" || user.role === "developer",
    canEditTasks: user.role === "admin" || user.role === "project_manager" || user.role === "developer" || user.role === "tester",
    canDeleteTasks: user.role === "admin" || user.role === "project_manager",
    canDragTasks: user.role !== "viewer",
    canViewOnly: user.role === "viewer"
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    if (!permissions.canEditTasks) return;
    console.log(`Moving task ${taskId} to ${newStatus}`);
    updateTaskMutation.mutate({ taskId, updates: { status: newStatus } });
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    if (!permissions.canEditTasks) return;
    updateTaskMutation.mutate({ taskId, updates });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!permissions.canDeleteTasks) return;
    deleteTaskMutation.mutate(taskId);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (!permissions.canDragTasks) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!permissions.canDragTasks) return;
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    if (!permissions.canDragTasks) return;
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    handleStatusChange(taskId, newStatus);
  };

  return (
    <div className="space-y-4">
      {permissions.canViewOnly && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-amber-800">
            <span className="text-sm font-medium">View-only mode:</span>
            <span className="text-sm">You can view tasks but cannot make changes.</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasksByStatus[column.id]}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            getPriorityColor={getPriorityColor}
            getLabelColor={getLabelColor}
            onUpdateTask={permissions.canEditTasks ? handleUpdateTask : undefined}
            onDeleteTask={permissions.canDeleteTasks ? handleDeleteTask : undefined}
            canEdit={permissions.canEditTasks}
            canCreate={permissions.canCreateTasks}
            canDrag={permissions.canDragTasks}
            userRole={user.role}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
