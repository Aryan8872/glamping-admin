"use client";
import { useState } from "react";
import { Contact } from "../types/contactTypes";
import { updateContact } from "../service/contactService";
import { toast } from "react-toastify";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import { BiEnvelope, BiPhone, BiMap } from "react-icons/bi";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";
import { FormInput } from "@/components/forms/FormInput";

export default function ContactInfoEditor({
  initialData,
}: {
  initialData: Contact;
}) {
  const [formData, setFormData] = useState<Contact>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof Contact, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateContact(formData);
      toast.success("Contact information updated successfully!");
    } catch (error) {
      console.error("Failed to update contact info:", error);
      toast.error("Failed to update contact info.");
    } finally {
      setIsSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-0 z-10 transition-all">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Contact Settings
          </h3>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage your public contact information and social presence.
          </p>
        </div>
        <PrimaryFilledButton
          text={isSaving ? "Saving..." : "Save Changes"}
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto px-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Contact Info */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <BiEnvelope className="text-2xl text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Direct Contact</h4>
          </div>

          <div className="space-y-6">
            <FormInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="contact@campora.com"
            />
            <FormInput
              label="Phone Number"
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="+1 (234) 567-8900"
            />
            <FormInput
              label="Physical Address"
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="123 Wilderness Trail, Nature Valley"
            />
          </div>
        </motion.div>

        {/* Social Presence */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <FaFacebook className="text-2xl text-indigo-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">
              Social Presence
            </h4>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <FormInput
                label="Facebook URL"
                type="url"
                value={formData.facebookUrl || ""}
                onChange={(e) => handleChange("facebookUrl", e.target.value)}
                placeholder="https://facebook.com/campora"
                className="pl-12"
              />
              <FaFacebook className="absolute left-4 bottom-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </div>

            <div className="relative group">
              <FormInput
                label="Instagram URL"
                type="url"
                value={formData.instagramUrl || ""}
                onChange={(e) => handleChange("instagramUrl", e.target.value)}
                placeholder="https://instagram.com/campora"
                className="pl-12"
              />
              <FaInstagram className="absolute left-4 bottom-4 text-slate-400 group-focus-within:text-pink-600 transition-colors" />
            </div>

            <div className="relative group">
              <FormInput
                label="Twitter URL"
                type="url"
                value={formData.twitterUrl || ""}
                onChange={(e) => handleChange("twitterUrl", e.target.value)}
                placeholder="https://twitter.com/campora"
                className="pl-12"
              />
              <FaTwitter className="absolute left-4 bottom-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
