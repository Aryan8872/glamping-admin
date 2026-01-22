"use client";

import { HiArrowDown, HiArrowUp } from "react-icons/hi";
import { BiBed, BiCalendar, BiEnvelope, BiMoney } from "react-icons/bi";
import { motion } from "framer-motion";

const iconMap = {
  money: BiMoney,
  calendar: BiCalendar,
  bed: BiBed,
  envelope: BiEnvelope,
};

export type IconType = keyof typeof iconMap;

export interface StatItem {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: IconType;
  color: string;
}

export default function StatsGrid({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.icon];

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <IconComponent size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span
                className={`flex items-center font-medium ${
                  stat.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.isPositive ? (
                  <HiArrowUp className="mr-1" />
                ) : (
                  <HiArrowDown className="mr-1" />
                )}
                {stat.change}
              </span>
              <span className="text-gray-400 ml-2">vs last month</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
