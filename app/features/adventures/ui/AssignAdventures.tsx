"use client";

import { useState, useEffect } from "react";
import { Adventure } from "../types/adventureTypes";
import {
  getAllAdventures,
  assignAdventuresToCamp,
} from "../services/adventureService";

interface AssignAdventuresProps {
  campId: number;
  currentAdventures?: number[];
  onSuccess?: () => void;
}

export default function AssignAdventures({
  campId,
  currentAdventures = [],
  onSuccess,
}: AssignAdventuresProps) {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>(currentAdventures);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAdventures();
  }, []);

  const fetchAdventures = async () => {
    try {
      const data = await getAllAdventures(false); // Only active
      setAdventures(data);
    } catch (error) {
      console.error("Failed to fetch adventures:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdventure = (adventureId: number) => {
    setSelectedIds((prev) =>
      prev.includes(adventureId)
        ? prev.filter((id) => id !== adventureId)
        : [...prev, adventureId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await assignAdventuresToCamp(campId, selectedIds);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to assign adventures:", error);
      alert("Failed to assign adventures");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading adventures...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign Adventures
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Select which adventure collections this campsite belongs to
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
        {adventures.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500 text-sm">
            No adventures available. Create one first.
          </div>
        ) : (
          adventures.map((adventure) => (
            <label
              key={adventure.id}
              className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(adventure.id)}
                onChange={() => toggleAdventure(adventure.id)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">
                  {adventure.name}
                </div>
                <div className="text-xs text-gray-500 line-clamp-1">
                  {adventure.description}
                </div>
              </div>
            </label>
          ))
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {isSaving ? "Saving..." : "Save Adventures"}
        </button>
      </div>
    </div>
  );
}
