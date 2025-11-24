"use client";
import { useState } from "react";
import { AboutUs } from "../types/AboutUsTypes";
import { PageHeading } from "@/components/PageHeading";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import StatsSection from "./StatsSection";
import { updateUser } from "../service/aboutUsService";
import { motion } from "framer-motion";

interface AboutUsFormProps {
  initialData: AboutUs;
}

export default function AboutUsForm({ initialData }: AboutUsFormProps) {
  const [formData, setFormData] = useState<AboutUs>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof AboutUs, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser(formData);
      alert("About Us content updated successfully!");
    } catch (error) {
      console.error("Failed to update About Us:", error);
      alert("Failed to update content.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <PageHeading
          heading="About Us"
          subheading="Manage your company's story and values"
        />
        <div className="flex gap-3">
          <SecondaryButton text="Cancel" onClick={() => setFormData(initialData)} />
          <PrimaryFilledButton 
            text={isSaving ? "Saving..." : "Save Changes"} 
            onClick={handleSave} 
          />
        </div>
      </div>

      {/* General Info Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">General Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">About Us Description</label>
            <textarea
              rows={5}
              value={formData.aboutUs}
              onChange={(e) => handleChange("aboutUs", e.target.value)}
              className="w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-3 text-gray-700 transition-all"
              placeholder="Write a brief description about your company..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Text 1</label>
            <textarea
              rows={4}
              value={formData.textbox_1}
              onChange={(e) => handleChange("textbox_1", e.target.value)}
              className="w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-3 text-gray-700 transition-all"
              placeholder="Additional content..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Text 2</label>
            <textarea
              rows={4}
              value={formData.textbox_2}
              onChange={(e) => handleChange("textbox_2", e.target.value)}
              className="w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-3 text-gray-700 transition-all"
              placeholder="More content..."
            />
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Mission & Vision</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <label className="block text-sm font-semibold text-blue-900 mb-2">Our Mission</label>
            <textarea
              rows={4}
              value={formData.mission}
              onChange={(e) => handleChange("mission", e.target.value)}
              className="w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200 rounded-lg p-3 text-gray-700 bg-white transition-all"
              placeholder="What is your mission?"
            />
          </div>
          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
            <label className="block text-sm font-semibold text-purple-900 mb-2">Our Vision</label>
            <textarea
              rows={4}
              value={formData.vision}
              onChange={(e) => handleChange("vision", e.target.value)}
              className="w-full resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-200 rounded-lg p-3 text-gray-700 bg-white transition-all"
              placeholder="What is your vision?"
            />
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Company Statistics</h3>
        <StatsSection data={formData.stats} />
      </motion.section>

      {/* Core Values Section - Placeholder for now as editor is complex */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Core Values</h3>
        <div className="text-gray-500 text-sm italic text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          Core Values Editor coming soon...
        </div>
      </motion.section>
    </div>
  );
}
