"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  Coffee,
  Sun,
  Dumbbell,
  Home,
  Heart,
  Moon,
} from "lucide-react";

const tabs = [
  { id: "monday", label: "Mon", icon: <Sun className="w-4 h-4" /> },
  { id: "tuesday", label: "Tue", icon: <CalendarDays className="w-4 h-4" /> },
  { id: "wednesday", label: "Wed", icon: <ClipboardList className="w-4 h-4" /> },
  { id: "thursday", label: "Thu", icon: <Coffee className="w-4 h-4" /> },
  { id: "friday", label: "Fri", icon: <BookOpen className="w-4 h-4" /> },
  { id: "saturday", label: "Sat", icon: <Heart className="w-4 h-4" /> },
  { id: "sunday", label: "Sun", icon: <Moon className="w-4 h-4" /> },
];

export default function PlannerTabs() {
  const [activeTab, setActiveTab] = useState("monday");
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Load saved notes on mount
  useEffect(() => {
    const stored = localStorage.getItem("plannerNotes");
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  // Save notes to local storage when updated
  useEffect(() => {
    localStorage.setItem("plannerNotes", JSON.stringify(notes));
  }, [notes]);

  const handleChange = (tab: string, value: string) => {
    setNotes((prev) => ({ ...prev, [tab]: value }));
  };

  const renderPageContent = (day: string) => {
    switch (day) {
      case "monday":
        return (
          <>
            <h3 className="planner-header text-2xl">Monday Focus</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Begin your week grounded. Set intentions that support balance,
              productivity, and clarity.
            </p>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="Write your top 3 priorities for the week..."
              className="textarea-planner planner-ruled-bg"
              rows={8}
            />
          </>
        );

      case "tuesday":
        return (
          <>
            <h3 className="planner-header text-2xl">Tuesday Momentum</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Build momentum. Focus on systems and habits that move your goals
              forward.
            </p>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="List the tasks or habits you'll optimize today..."
              className="textarea-planner planner-ruled-bg"
              rows={8}
            />
          </>
        );

      case "wednesday":
        return (
          <>
            <h3 className="planner-header text-2xl">Wednesday Check-In</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Midweek reflection: realign your energy and intentions.
            </p>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="Reflect on your energy levels and progress so far..."
              className="textarea-planner planner-ruled-bg"
              rows={8}
            />
          </>
        );

      case "thursday":
        return (
          <>
            <h3 className="planner-header text-2xl">Thursday Growth</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Expansion day: learn, create, and explore something new.
            </p>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="What are you learning or exploring today?"
              className="textarea-planner planner-ruled-bg"
              rows={8}
            />
          </>
        );

      case "friday":
        return (
          <>
            <h3 className="planner-header text-2xl">Friday Reflection</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Wrap up your week intentionally. Celebrate wins and release stress.
            </p>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="What did you accomplish and what can you release?"
              className="textarea-planner planner-ruled-bg"
              rows={8}
            />
          </>
        );

      case "saturday":
        return (
          <>
            <h3 className="planner-header text-2xl">Saturday Recharge</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Take time for rest, recreation, and reconnection. Refill your energy.
            </p>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="What are you doing today that brings you joy?"
              className="textarea-planner planner-ruled-bg"
              rows={8}
            />
          </>
        );

      case "sunday":
        return (
          <>
            <h3 className="planner-header text-2xl">Sunday Reset</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Reflect, realign, and prepare for the week ahead. This is your pause.
            </p>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="How will you reset and prepare for next week?"
              className="textarea-planner planner-ruled-bg"
              rows={8}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="planner-section overflow-hidden relative">
      {/* Bookmark Ribbon */}
      <div className="absolute right-4 top-0 w-3 h-12 bg-planner-accent rounded-b-md shadow-md z-20"></div>

      <div className="flex flex-col md:flex-row">
        {/* Tabs */}
        <div className="flex md:flex-col bg-planner-sidebar border-b md:border-b-0 md:border-r-2 border-planner-text">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex items-center gap-2 px-5 py-4 font-medium transition-all duration-200 relative uppercase tracking-wider text-xs",
                "hover:bg-planner-page/50",
                activeTab === tab.id
                  ? "bg-planner-page border-l-4 md:border-l-4 border-planner-text text-planner-text font-bold"
                  : "text-planner-text-muted border-l-4 md:border-l-4 border-transparent"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Page Content */}
        <div className="flex-1 bg-planner-page p-6 md:p-10 relative overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative z-10"
            >
              {renderPageContent(activeTab)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
