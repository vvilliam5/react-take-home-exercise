import React, { useEffect, useState } from "react";
import FilterButton from "./FilterButton";

import TaskItem from "./TaskItem";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const TaskManager = () => {
  const [storedTasksConverted, setStoredTasksConverted] = useState<Task[]>(
    localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks") || "")
      : []
  );
  const [tasks, setTasks] = useState<Task[]>(storedTasksConverted || []);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [filter, setFilter] = useState<string>("all");
  const [newTask, setNewTask] = useState<string>("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    let newTaskToAdd: Task = {
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
      title: newTask,
      completed: false,
    };
    setTasks((tasks) => [...tasks, newTaskToAdd]);
    setNewTask("");
  };

  const handleDeleteTask = (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      setTasks((tasks) => {
        return tasks.filter((task) => task.id !== id);
      });
    }
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((allTasks) => {
      return allTasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        } else return task;
      });
    });
  };

  //store to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    setFilteredTasks(tasks);
    if (filter === "all") {
      setFilteredTasks(tasks);
    } else if (filter === "completed") {
      setFilteredTasks((tasks) =>
        tasks.filter((task) => task.completed === true)
      );
    } else if (filter === "pending") {
      setFilteredTasks((tasks) =>
        tasks.filter((task) => task.completed !== true)
      );
    }
  }, [tasks, filter]);

  return (
    <div className="container bg-gray-200 mx-auto bg-white p-4 rounded shadow">
      <form onSubmit={handleAddTask} className="mb-4 flex">
        <input
          type="text"
          placeholder="New task..."
          required
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow border rounded-l py-2 px-3"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded-r">
          Add
        </button>
      </form>
      <div className="text-xs md:text-md lg:text-lg flex justify-around mb-4">
        {/* abstract this a component */}
        <FilterButton filter={filter} filterFor="All" setFilter={setFilter} />
        <FilterButton
          filter={filter}
          filterFor="Completed"
          setFilter={setFilter}
        />
        <FilterButton
          filter={filter}
          filterFor="Pending"
          setFilter={setFilter}
        />
      </div>
      <ul>
        {filteredTasks?.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={handleDeleteTask}
            onToggle={toggleTaskCompletion}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
