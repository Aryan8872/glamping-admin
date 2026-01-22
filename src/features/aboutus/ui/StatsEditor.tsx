"use client";

import { useState } from "react";
import { BiPlus, BiTrash } from "react-icons/bi";
import { Stat } from "../types/AboutUsTypes";
import IconSelector from "./IconSelector";
import { RenderIcon } from "./Icons";

interface StatsEditorProps {
  initialStats: Stat[];
  onChange: (stats: Stat[]) => void;
}

export default function StatsEditor({
  initialStats,
  onChange,
}: StatsEditorProps) {
  const [stats, setStats] = useState<Stat[]>(initialStats || []);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const newStat = {
      id: Date.now(),
      value: "",
      icon: "",
      heading: "",
    } as Stat;
    const updatedStats = [...stats, newStat];
    setStats(updatedStats);
    onChange(updatedStats);
  };

  const handleChange = (index: number, field: keyof Stat, value: string) => {
    const updatedStats = [...stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setStats(updatedStats);
    onChange(updatedStats);
  };

  const handleRemove = (index: number) => {
    const updatedStats = stats.filter((_, i) => i !== index);
    setStats(updatedStats);
    onChange(updatedStats);
  };

  const handleIconSelect = (iconName: string) => {
    if (editingIndex !== null) {
      handleChange(editingIndex, "icon", iconName);
    }
    setEditingIndex(null);
  };

  const openIconSelector = (index: number) => {
    setEditingIndex(index);
    setShowIconSelector(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <BiPlus size={20} />
          Add Stat
        </button>
      </div>

      <div className="space-y-3">
        {stats.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">
              No statistics yet. Click "Add Stat" to create one.
            </p>
          </div>
        ) : (
          stats.map((stat, index) => (
            <div
              key={stat.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Icon Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Icon
                  </label>
                  <button
                    type="button"
                    onClick={() => openIconSelector(index)}
                    className="w-full h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    {stat.icon ? (
                      <RenderIcon
                        iconName={stat.icon}
                        size={28}
                        className="text-blue-600"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">Select Icon</span>
                    )}
                  </button>
                  {stat.icon && (
                    <p className="text-xs text-gray-500 text-center truncate">
                      {stat.icon}
                    </p>
                  )}
                </div>

                {/* Value */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Value
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 500+"
                    value={stat.value}
                    onChange={(e) =>
                      handleChange(index, "value", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Heading */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Heading
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Happy Campers"
                    value={stat.heading}
                    onChange={(e) =>
                      handleChange(index, "heading", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Delete Button */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Action
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="w-full h-10 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    <BiTrash size={18} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showIconSelector && (
        <IconSelector
          onSelect={handleIconSelect}
          onClose={() => {
            setShowIconSelector(false);
            setEditingIndex(null);
          }}
          selectedIcon={
            editingIndex !== null ? stats[editingIndex]?.icon : undefined
          }
        />
      )}
    </div>
  );
}
