"use client";
import { PageHeading } from "@/components/PageHeading";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { BiEnvelope, BiSearch, BiTrash, BiCheckDouble } from "react-icons/bi";
import ContactInfoEditor from "@/app/features/contact/ui/ContactInfoEditor";
import { getContactContent } from "@/app/features/contact/service/contactService";
import { Contact } from "@/app/features/contact/types/contactTypes";

export default function ContactPage() {
  const [contactData, setContactData] = useState<Contact | null>(null);

  // Mock Data for Messages (Inbox)
  const [messages, setMessages] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", subject: "Inquiry about booking", date: "2 hours ago", status: "unread", preview: "Hi, I would like to know if the Sunset Glamp is available for..." },
    { id: 2, name: "Sarah Connor", email: "sarah@example.com", subject: "Wedding venue question", date: "1 day ago", status: "read", preview: "Do you host small weddings at your campsite? We are looking for..." },
    { id: 3, name: "Mike Ross", email: "mike@example.com", subject: "Cancellation policy", date: "2 days ago", status: "read", preview: "What is your cancellation policy if it rains heavily on the day..." },
    { id: 4, name: "Emily Blunt", email: "emily@example.com", subject: "Group discount", date: "3 days ago", status: "unread", preview: "We are a group of 10 hikers looking for accommodation..." },
    { id: 5, name: "David Beckham", email: "david@example.com", subject: "Lost item", date: "1 week ago", status: "read", preview: "I think I left my sunglasses at the reception desk..." },
  ]);

  useEffect(() => {
    const fetchData = async () => {
        const data = await getContactContent();
        setContactData(data);
    };
    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  const handleMarkRead = (id: number) => {
    setMessages(messages.map(m => m.id === id ? { ...m, status: "read" } : m));
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-end">
        <PageHeading heading="Contact Management" subheading="Manage contact details and inquiries" />
      </div>

      {/* CMS Section: Contact Information */}
      {contactData && <ContactInfoEditor initialData={contactData} />}

      {/* Inbox Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-900">Inquiries</h3>
        </div>
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-72">
                <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search messages..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>
            <div className="flex gap-2">
                <button className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">All</button>
                <button className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Unread</button>
            </div>
        </div>

        {/* Message List */}
        <div className="divide-y divide-gray-100">
            {messages.map((msg, index) => (
                <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 hover:bg-blue-50/50 transition-colors cursor-pointer ${msg.status === 'unread' ? 'bg-blue-50/30' : ''}`}
                >
                    {/* Icon/Avatar */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${msg.status === 'unread' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        <BiEnvelope size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                            <h4 className={`text-sm font-medium ${msg.status === 'unread' ? 'text-gray-900 font-bold' : 'text-gray-900'}`}>
                                {msg.name} <span className="text-gray-500 font-normal text-xs ml-2">&lt;{msg.email}&gt;</span>
                            </h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{msg.date}</span>
                        </div>
                        <p className={`text-sm mt-0.5 ${msg.status === 'unread' ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                            {msg.subject}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                            {msg.preview}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleMarkRead(msg.id); }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-full tooltip"
                            title="Mark as read"
                        >
                            <BiCheckDouble size={18} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full"
                            title="Delete"
                        >
                            <BiTrash size={18} />
                        </button>
                    </div>
                </motion.div>
            ))}
            
            {messages.length === 0 && (
                <div className="p-10 text-center text-gray-500">
                    No messages found.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
