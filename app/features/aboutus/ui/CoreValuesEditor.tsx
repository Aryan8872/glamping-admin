"use client";

import { useState } from "react";

export default function CoreValuesEditor({ initialValues }) {
  const [values, setValues] = useState(initialValues || []);

  const handleAdd = () => {
    setValues([...values, { title: "", description: "", icon: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...values];
    updated[index][field] = value;
    setValues(updated);
  };

  const handleRemove = (index) => {
    setValues(values.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4">
      {values.map((item, index) => (
        <div
          key={index}
          className="border p-4 rounded-lg grid grid-cols-3 gap-4 bg-gray-50"
        >
          <input
            type="text"
            placeholder="Title"
            className="border p-2 rounded"
            value={item.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            className="border p-2 rounded"
            value={item.description}
            onChange={(e) => handleChange(index, "description", e.target.value)}
          />

          <input
            type="text"
            placeholder="Icon"
            className="border p-2 rounded"
            value={item.icon}
            onChange={(e) => handleChange(index, "icon", e.target.value)}
          />

          <button
            className="bg-red-500 text-white px-3 py-2 rounded"
            onClick={() => handleRemove(index)}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-fit"
        onClick={handleAdd}
      >
        Add Core Value
      </button>

      {/* 🔥 Store final core values in a hidden input before submitting */}
      <input type="hidden" name="coreValues" value={JSON.stringify(values)} />
    </div>
  );
}
    