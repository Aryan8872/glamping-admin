"use client";
import { CampSite } from "../types/campTypes";
import { BiSearch, BiEdit, BiTrash } from "react-icons/bi";
import { MdDateRange } from "react-icons/md";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CampsTable({ camps }: { camps: CampSite[] }) {
    const animatedComponents = makeAnimated();
    const dateRangeref = useRef(null)

    return (
        <div className="w-full mt-3 overflow-x-scroll px-2">
            <h2 className="text-xl sm:text-2xl font-semibold pl-2 text-gray-900">Camps Records</h2>
            <div className="w-full mt-4 bg-white border border-gray-200 rounded-xl shadow-sm p-5 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-6">
                    <div className="lg:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
                        <div className="relative">
                            <BiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Search camps..." />
                        </div>
                    </div>
        
                    <div className="">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
                        <div className="cursor-pointer flex items-center h-10 rounded-lg border border-gray-200 bg-white px-3 text-gray-700 hover:border-blue-500 transition-colors">
                            <MdDateRange className="mr-2 text-gray-500" />
                            <span className="text-sm text-gray-500">Select date</span>
                            <input ref={dateRangeref} type="date" className="hidden" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 overflow-hidden">
                <table className="w-full table-auto text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Camp</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price / Night</th>
                            <th className="hidden md:table-cell px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {camps?.length > 0 ? (
                            camps.map((camp) => (
                                <tr key={camp.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                {camp.images && camp.images.length > 0 ? (
                                                    <img 
                                                        className="h-full w-full object-cover" 
                                                        src={`${process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL}${camp.images[0]}`} 
                                                        alt={camp.name} 
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{camp.name}</div>
                                                <div className="text-xs text-gray-500">{camp.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 max-w-xs truncate" title={camp.description}>
                                            {camp.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            ${Number(camp.pricePerNight).toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {new Date(camp.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link 
                                                href={`/admin/camps/${camp.id}`} 
                                                className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Edit Camp"
                                            >
                                                <BiEdit size={18} />
                                            </Link>
                                            <button 
                                                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete Camp"
                                            >
                                                <BiTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                                    No camps found. Click "Create Camp" to add one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                {camps?.length > 0 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{camps.length}</span> of <span className="font-medium">{camps.length}</span> results
                        </span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
