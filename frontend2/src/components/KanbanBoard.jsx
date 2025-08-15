import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from 'axios';
import TaskCard from './TaskCard';

const statuses = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
  { id: 'blocked', title: 'Blocked' },
];

const KanbanBoard = ({ tasks, setTasks }) => {
  // Function to update task status in backend and local state
  const updateTaskStatus = async (taskId, updates) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        updates,
        { withCredentials: true }
      );
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? data.data : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    updateTaskStatus(draggableId, { status: destination.droppableId });
  };

  const tasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statuses.map((status) => (
          <div key={status.id} className="bg-gray-50 rounded-lg p-4  text-black ">
            <h3 className="font-semibold text-lg mb-4">{status.title}</h3>
            <Droppable droppableId={status.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 min-h-[100px]  text-black "
                >
                  {tasksByStatus(status.id).map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
