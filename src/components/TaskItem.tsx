import React from "react";
import { Task } from "./TaskManager";
const TaskItem = ({
  task,
  onDelete,
  onToggle,
}: {
  task: Task;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}) => {
  return (
    <li className="grid grid-cols-12 items-center border-b py-2 gap-2">
      <div className="col-span-12 md:col-span-6 lg:col-span-7">
        <span
          className={`cursor-pointer ${
            task.completed ? "line-through text-green-500" : "text-black"
          }`}
        >
          {task.title}
        </span>
      </div>
      <div className="col-span-12 md:col-span-6 lg:col-span-5 flex gap-2 justify-self-end">
        <button
          onClick={() => onToggle(task.id)}
          className={`text-xs md:text-md lg:text-lg ${
            task.completed
              ? "bg-green-500 text-white px-8 py-2 rounded-md"
              : "bg-blue-500 text-white px-8 py-2 rounded-md"
          }`}
        >
          {task.completed ? "Mark as undone" : "Mark as done"}
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs md:text-md lg:text-lg bg-red-600 text-white px-8 py-2 rounded-md"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
