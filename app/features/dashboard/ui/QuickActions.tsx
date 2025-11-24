"use client"
import { motion } from "framer-motion";
import { useState } from "react";
import { BiBed, BiCalendar, BiMoney } from "react-icons/bi";
import AddCamp from "../../camps/ui/AddCamp";
export default function QuickActions() {
    const [showCreateCampModal,setShowCreateCampModal] = useState(false);
    return(
        <>
       <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={()=>setShowCreateCampModal(true)} className="w-full cursor-pointer  flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Add New Camp</span>
              <BiBed className="text-gray-400 group-hover:text-blue-500" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Create Booking</span>
              <BiCalendar className="text-gray-400 group-hover:text-blue-500" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">View Reports</span>
              <BiMoney className="text-gray-400 group-hover:text-blue-500" />
            </button>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Popular Camps</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                    <div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-16 bg-gray-100 rounded animate-pulse"></div>
                    </div>
                </div>
            ))}
          </div>
        </motion.div>   
        {showCreateCampModal && <AddCamp onClose={() => setShowCreateCampModal(false)}/>}
        </>
    )
}