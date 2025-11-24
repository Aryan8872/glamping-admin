"use client";
import { useState } from "react";
import { Contact } from "../types/contactTypes";
import { updateContact } from "../service/contactService";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import { BiEnvelope, BiPhone, BiMap } from "react-icons/bi";
import { motion } from "framer-motion";

export default function ContactInfoEditor({ initialData }: { initialData: Contact }) {
  const [formData, setFormData] = useState<Contact>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof Contact, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateContact(formData);
      alert("Contact information updated successfully!");
    } catch (error) {
      console.error("Failed to update contact info:", error);
      alert("Failed to update contact info.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
    >
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        <PrimaryFilledButton 
            text={isSaving ? "Saving..." : "Save Changes"} 
            onClick={handleSave} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                <BiEnvelope className="text-gray-400" /> Email Address
            </label>
            <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                placeholder="contact@example.com"
            />
        </div>

        <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                <BiPhone className="text-gray-400" /> Phone Number
            </label>
            <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                placeholder="+1 (555) 000-0000"
            />
        </div>

        <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                <BiMap className="text-gray-400" /> Address
            </label>
            <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                placeholder="123 Glamping Way, Nature City"
            />
        </div>
      </div>
    </motion.div>
  );
}
