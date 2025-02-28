import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskItem from "./TaskItem";

describe("TaskItem Component", () => {
  test("renders the task title correctly", () => {
    const mockTask = {
      id: 1,
      title: "Test Task",
      completed: false,
    };
    const mockOnDelete = jest.fn();
    const mockOnToggle = jest.fn();

    render(
      <ul>
        <TaskItem
          task={mockTask}
          onDelete={mockOnDelete}
          onToggle={mockOnToggle}
        />
      </ul>
    );

    expect(screen.getByText(/test task/i)).toBeInTheDocument();
  });

  test("calls onToggle when toggle button is clicked", () => {
    const mockTask = {
      id: 2,
      title: "Toggle Task",
      completed: false,
    };
    const mockOnDelete = jest.fn();
    const mockOnToggle = jest.fn();

    render(
      <ul>
        <TaskItem
          task={mockTask}
          onDelete={mockOnDelete}
          onToggle={mockOnToggle}
        />
      </ul>
    );

    const toggleButton = screen.getByRole("button", { name: /mark as done/i });
    fireEvent.click(toggleButton);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(2);
  });

  test("calls onDelete when delete button is clicked", () => {
    const mockTask = {
      id: 3,
      title: "Delete Task",
      completed: false,
    };
    const mockOnDelete = jest.fn();
    const mockOnToggle = jest.fn();

    render(
      <ul>
        <TaskItem
          task={mockTask}
          onDelete={mockOnDelete}
          onToggle={mockOnToggle}
        />
      </ul>
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(3);
  });

  test("displays correct style when task is completed", () => {
    const mockTask = {
      id: 4,
      title: "Completed Task",
      completed: true,
    };
    const mockOnDelete = jest.fn();
    const mockOnToggle = jest.fn();

    render(
      <ul>
        <TaskItem
          task={mockTask}
          onDelete={mockOnDelete}
          onToggle={mockOnToggle}
        />
      </ul>
    );

    // If completed, text should have line-through, and button should say 'Mark as undone'
    const titleSpan = screen.getByText(/completed task/i);
    expect(titleSpan).toHaveClass("line-through");

    const toggleButton = screen.getByRole("button", {
      name: /mark as undone/i,
    });
    expect(toggleButton).toBeInTheDocument();
  });
});
