"use client";

import { useState, useEffect, useRef } from "react";

type Task = {
  id: number;
  activity: string;
  price: number;
  type: string;
  bookingRequired: boolean;
  accessibility: number;
};

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const tasksRef = useRef<Task[]>([]);

  const [activity, setActivity] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState("education");
  const [bookingRequired, setBookingRequired] = useState(false);
  const [accessibility, setAccessibility] = useState(0.5);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivity(sessionStorage.getItem("activity") || "");
      setPrice(parseFloat(sessionStorage.getItem("price") || "0") || 0);
      setType(sessionStorage.getItem("type") || "education");
      setBookingRequired(sessionStorage.getItem("bookingRequired") === "true");
      setAccessibility(parseFloat(sessionStorage.getItem("accessibility") || "0.5"));

      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        try {
          const parsedTasks: Task[] = JSON.parse(savedTasks);
          if (Array.isArray(parsedTasks)) {
            setTasks(parsedTasks);
            tasksRef.current = parsedTasks;
          }
        } catch (error) {
          console.error("Error parsing tasks:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("activity", activity);
      sessionStorage.setItem("price", price.toString());
      sessionStorage.setItem("type", type);
      sessionStorage.setItem("bookingRequired", String(bookingRequired));
      sessionStorage.setItem("accessibility", accessibility.toString());
    }
  }, [activity, price, type, bookingRequired, accessibility]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (JSON.stringify(tasks) !== JSON.stringify(tasksRef.current)) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        tasksRef.current = tasks;
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      activity: activity.trim(),
      price: isNaN(price) ? 0 : price,
      type,
      bookingRequired,
      accessibility,
    };

    setTasks((prev) => [...prev, newTask]);
    resetForm();
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const resetForm = () => {
    setActivity("");
    setPrice(0);
    setType("education");
    setBookingRequired(false);
    setAccessibility(0.5);
    sessionStorage.clear();
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold">To-Do List ({tasks.length} items)</h2>
      <form onSubmit={addTask} className="space-y-2 border p-4 rounded">
        <input
          type="text"
          placeholder="Activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          className="w-full p-2 border rounded"
          min="0"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded">
          {["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"].map((option) => (
            <option key={option} value={option} className="text-black">
              {option}
            </option>
          ))}
        </select>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={bookingRequired} onChange={() => setBookingRequired(!bookingRequired)} />
          <span>Booking Required</span>
        </label>
        <label className="block">
          <span className="block">Accessibility: {accessibility}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={accessibility}
            onChange={(e) => setAccessibility(parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-500">
            {accessibility === 0 ? "High Accessibility" : accessibility === 1 ? "Low Accessibility" : "Moderate"}
          </span>
        </label>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Add Task
        </button>
      </form>
      <ul className="mt-4 space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-2 border rounded flex justify-between items-center">
            <span>
              {task.activity} (${task.price.toFixed(2)}) - {task.type}
            </span>
            <button onClick={() => removeTask(task.id)} className="bg-red-500 text-white px-2 py-1 rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
