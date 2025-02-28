import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskManager from "./TaskManager";

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Tests for TaskManager

describe("TaskManager Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("renders without crashing", () => {
    render(<TaskManager />);
    // check if input or add button is rendered
    const inputElement = screen.getByPlaceholderText(/new task.../i);
    expect(inputElement).toBeInTheDocument();

    const buttonElement = screen.getByRole("button", { name: /add/i });
    expect(buttonElement).toBeInTheDocument();
  });

  test("adds a new task when the form is submitted", () => {
    render(<TaskManager />);

    const inputElement = screen.getByPlaceholderText(/new task.../i);
    const addButton = screen.getByRole("button", { name: /add/i });

    fireEvent.change(inputElement, { target: { value: "New Task" } });
    fireEvent.click(addButton);

    const newTask = screen.getByText(/new task/i);
    expect(newTask).toBeInTheDocument();
  });

  test("toggles task completion when toggle is clicked", () => {
    render(<TaskManager />);

    // add a new task
    const inputElement = screen.getByPlaceholderText(/new task.../i);
    const addButton = screen.getByRole("button", { name: /add/i });
    fireEvent.change(inputElement, { target: { value: "Test Toggle Task" } });
    fireEvent.click(addButton);

    // find newly added task
    const toggleButton = screen.getByRole("button", { name: /mark as done/i });
    fireEvent.click(toggleButton);
    // after toggling, button text changes to 'Mark as undone'
    expect(
      screen.getByRole("button", { name: /mark as undone/i })
    ).toBeInTheDocument();
  });

  test("deletes a task when delete is clicked", () => {
    // confirm() needs to be mocked for tests
    global.confirm = jest.fn(() => true);

    render(<TaskManager />);

    // add a new task
    const inputElement = screen.getByPlaceholderText(/new task.../i);
    const addButton = screen.getByRole("button", { name: /add/i });
    fireEvent.change(inputElement, { target: { value: "Task to delete" } });
    fireEvent.click(addButton);

    // delete the task
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    // it should not be found in the document
    expect(screen.queryByText(/Task to delete/i)).not.toBeInTheDocument();
  });

  test("filters tasks correctly", () => {
    render(<TaskManager />);

    // add tasks
    const inputElement = screen.getByPlaceholderText(/new task.../i);
    const addButton = screen.getByRole("button", { name: /add/i });

    // add first task
    fireEvent.change(inputElement, { target: { value: "First Task" } });
    fireEvent.click(addButton);

    // add second task
    fireEvent.change(inputElement, { target: { value: "Second Task" } });
    fireEvent.click(addButton);

    // mark second task as completed
    const toggleButtons = screen.getAllByRole("button", {
      name: /mark as done/i,
    });
    fireEvent.click(toggleButtons[1]); // toggle second task

    // filter to completed
    const completedFilter = screen.getByText(/completed/i);
    fireEvent.click(completedFilter);

    expect(screen.queryByText(/First Task/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Second Task/i)).toBeInTheDocument();

    // filter to pending
    const pendingFilter = screen.getByText(/pending/i);
    fireEvent.click(pendingFilter);

    expect(screen.queryByText(/First Task/i)).toBeInTheDocument();
    expect(screen.queryByText(/Second Task/i)).not.toBeInTheDocument();

    // filter back to all
    const allFilter = screen.getByText(/^all$/i);
    fireEvent.click(allFilter);

    expect(screen.queryByText(/First Task/i)).toBeInTheDocument();
    expect(screen.queryByText(/Second Task/i)).toBeInTheDocument();
  });
});
