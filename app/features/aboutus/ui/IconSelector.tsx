"use client";

import { useState, useMemo } from "react";
import {
  IoClose,
  IoSearch,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import * as BiIcons from "react-icons/bi";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";

interface IconSelectorProps {
  onSelect: (iconName: string) => void;
  onClose: () => void;
  selectedIcon?: string;
}

const iconSets = {
  Bi: BiIcons,
  Md: MdIcons,
  Fa: FaIcons,
  Io: IoIcons,
  Ai: AiIcons,
  Bs: BsIcons,
};

const ICONS_PER_PAGE = 120;

export default function IconSelector({
  onSelect,
  onClose,
  selectedIcon,
}: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Flatten all icons into a single array (memoized)
  const allIcons = useMemo(() => {
    const icons: {
      name: string;
      component: React.ComponentType;
      category: string;
    }[] = [];

    Object.entries(iconSets).forEach(([category, iconSet]) => {
      Object.entries(iconSet).forEach(([iconName, IconComponent]) => {
        if (typeof IconComponent === "function") {
          icons.push({
            name: iconName,
            component: IconComponent as React.ComponentType,
            category,
          });
        }
      });
    });

    return icons;
  }, []);

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    return allIcons.filter((icon) => {
      const matchesSearch = icon.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || icon.name.startsWith(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [allIcons, searchTerm, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredIcons.length / ICONS_PER_PAGE);
  const startIndex = (currentPage - 1) * ICONS_PER_PAGE;
  const endIndex = startIndex + ICONS_PER_PAGE;
  const currentIcons = filteredIcons.slice(startIndex, endIndex);

  // Reset to page 1 when search or category changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleIconSelect = (iconName: string) => {
    onSelect(iconName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Select an Icon
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredIcons.length} icons available
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoClose size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* Search */}
          <div className="relative">
            <IoSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleCategoryChange("All")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {Object.keys(iconSets).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredIcons.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No icons found matching "{searchTerm}"
            </div>
          ) : (
            <>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                {currentIcons.map((icon) => {
                  const Icon = icon.component;
                  const isSelected = selectedIcon === icon.name;

                  return (
                    <button
                      key={icon.name}
                      onClick={() => handleIconSelect(icon.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                      }`}
                      title={icon.name}
                    >
                      <Icon
                        size={24}
                        className={
                          isSelected ? "text-blue-600" : "text-gray-700"
                        }
                      />
                    </button>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <IoChevronBack size={20} />
                  </button>

                  <span className="text-sm text-gray-600 px-4">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <IoChevronForward size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {selectedIcon && (
                <span>
                  Selected:{" "}
                  <span className="font-medium text-gray-900">
                    {selectedIcon}
                  </span>
                </span>
              )}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
