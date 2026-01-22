"use client";

import { useState } from "react";
import { BiPlus, BiTrash } from "react-icons/bi";
import { CoreValue } from "../types/AboutUsTypes";
import IconSelector from "./IconSelector";
import { RenderIcon } from "./Icons";

interface CoreValuesEditorProps {
  initialValues: CoreValue[];
  onChange: (values: CoreValue[]) => void;
}

export default function CoreValuesEditor({
  initialValues,
  onChange,
}: CoreValuesEditorProps) {
  const [values, setValues] = useState<CoreValue[]>(initialValues || []);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const newValue = {
      id: Date.now(),
      title: "",
      description: "",
      icon: "",
    } as CoreValue;
    const updatedValues = [...values, newValue];
    setValues(updatedValues);
    onChange(updatedValues);
  };

  const handleChange = (
    index: number,
    field: keyof CoreValue,
    value: string
  ) => {
    const updatedValues = [...values];
    updatedValues[index] = { ...updatedValues[index], [field]: value };
    setValues(updatedValues);
    onChange(updatedValues);
  };

  const handleRemove = (index: number) => {
    const updatedValues = values.filter((_, i) => i !== index);
    setValues(updatedValues);
    onChange(updatedValues);
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
        <h3 className="text-lg font-semibold text-gray-900">Core Values</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <BiPlus size={20} />
          Add Core Value
        </button>
      </div>

      <div className="space-y-3">
        {values.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">
              No core values yet. Click "Add Core Value" to create one.
            </p>
          </div>
        ) : (
          values.map((value, index) => (
            <div
              key={value.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 gap-4">
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
                      {value.icon ? (
                        <RenderIcon
                          iconName={value.icon}
                          size={28}
                          className="text-blue-600"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">
                          Select Icon
                        </span>
                      )}
                    </button>
                    {value.icon && (
                      <p className="text-xs text-gray-500 text-center truncate">
                        {value.icon}
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Sustainability"
                      value={value.title}
                      onChange={(e) =>
                        handleChange(index, "title", e.target.value)
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

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe this core value..."
                    value={value.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  />
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
            editingIndex !== null ? values[editingIndex]?.icon : undefined
          }
        />
      )}
    </div>
  );
}
