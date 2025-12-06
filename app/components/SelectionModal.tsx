"use client";

import React, { useState, useMemo } from "react";
import Modal from "./Modal";
import { BiSearch } from "react-icons/bi";

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: { id: number; name: string; image?: string; [key: string]: any }[];
  onSelect: (item: any) => void;
}

export default function SelectionModal({
  isOpen,
  onClose,
  title,
  items,
  onSelect,
}: SelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="relative">
          <BiSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Search..."
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-100">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 group"
              >
                {item.image && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <span className="text-sm text-gray-700 font-medium group-hover:text-blue-600">
                  {item.name}
                </span>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No items found.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
