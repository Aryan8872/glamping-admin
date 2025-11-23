"use client";
import OptionsDropdown from "@/components/OptionsDropdown";
import { Overdue } from "@/types/OverdueTypes";
import { useRef } from "react";
import { BiSearch } from "react-icons/bi";
import { MdDateRange, MdDelete, MdEdit } from "react-icons/md";
import Select from "react-select";
import makeAnimated from 'react-select/animated';

export default function OverdueTable({ overdueDatas }: { overdueDatas: Overdue[] }) {
    const animatedComponents = makeAnimated();
    const dateRangerefOverdueTable = useRef(null)
    const statusOption: { label: string, value: string }[] = [{ label: "All", value: "All" }, { label: "Active", value: "Active" }, { label: "InActive", value: "InActive" }]
    const options = [
        { label: "Edit", function: () => { }, icon: <MdEdit /> },
        { label: "Delete", function: () => { }, icon: <MdDelete /> }
    ]
    return (
        <div className="w-full mt-3 overflow-x-scroll px-2">
            <h2 className="text-xl sm:text-2xl font-semibold pl-2 text-gray-900">Overdue Account Records</h2>
            <div className="w-full mt-4 bg-white border border-gray-200 rounded-xl shadow-sm p-5 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
                    <div className="md:col-span-12 lg:col-span-6">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
                        <div className="relative">
                            <BiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="Search payments, users, invoices..." />
                        </div>
                    </div>

                 

                    <div className="md:col-span-6 lg:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                        <Select components={animatedComponents} className="w-full !focus:outline-none" defaultValue={statusOption[0]} options={statusOption} />
                    </div>

                    <div className="md:col-span-6 lg:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
                        <div className="flex items-center h-10 rounded-lg border border-gray-200 bg-white px-3 text-gray-700">
                            <MdDateRange className="mr-2 text-gray-500" />
                            <span className="text-sm text-gray-500">Select date</span>
                            <input ref={dateRangerefOverdueTable} type="date" className="hidden" />
                        </div>
                    </div>

                    <div className="md:col-span-6 lg:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Plan</label>
                        <Select components={animatedComponents} className="w-full !focus:outline-none" defaultValue={statusOption[0]} options={statusOption} />
                    </div>
                </div>
            </div>

            <table className="w-full table-auto text-left mt-3">
                <thead className="text-gray-700 bg-[#F9FAFB] ">
                    <tr>
                        <th className="px-4 py-2 font-semibold">Payment ID</th>
                        <th className="hidden xl:table-cell px-4 py-2 font-semibold">Invoice ID</th>
                        <th className="px-4 py-2 font-semibold">Subscription Plan</th>
                        <th className="px-4 py-2 font-semibold">User</th>
                        <th className="px-4 py-2 font-semibold">Last Payment Date</th>
                        <th className="px-4 py-2 font-semibold">Days Overdue</th>
                        <th className="px-4 py-2 font-semibold">Amount Due</th>
                        <th className="hidden md:table-cell px-4 py-2 font-semibold">Due Date</th>
                        <th className="hidden md:table-cell px-4 py-2 font-semibold">Subscription Status</th>
                        <th className="px-4 py-2 font-semibold">Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {overdueDatas?.map((overdue, index) => (
                        <tr key={overdue.overdue_id ?? index} className="border-b text-[15px] border-black/10 bg-white">
                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-1">
                                    {overdue.overdue_id}
                                    <span className="text-sm text-gray-500">{overdue.invoice_id}</span>
                                </div>
                            </td>
                            <td className="hidden xl:table-cell px-4 py-3  text-gray-500 ">{overdue.invoice_id}</td>
                            <td className="px-4 py-3 text-gray-500 ">{overdue.subscription_plan}</td>
                            <td className="px-4 py-3 text-gray-500 ">{overdue.user.username}</td>
                            <td className="px-4 py-3 text-gray-500 ">{overdue.last_payment_date}</td>
                            <td className="px-4 py-3 text-gray-500 ">{overdue.days_overdue}</td>
                            <td className="px-4 py-3 text-gray-500 ">{overdue.amount_due}</td>
                            <td className="hidden md:table-cell px-4 py-3 text-gray-500 ">{overdue.due_date}</td>
                            <td className="hidden md:table-cell px-4 py-3 text-gray-500 ">{overdue.subscription_status}</td>

                            <td className="px-4 py-3 ">
                                <div className="flex items-center gap-2">
                                    {/* <button>Edit</button>
                                    <button>Delete</button> */}
                                    <OptionsDropdown options={options} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="bg-white font-semibold rounded-b-2xl flex justify-between text-sm py-6 px-3 items-center">
                <span>Showing 1 to 10 of 10 entries</span>
                <div className="flex gap-2">
                    <button>Previous</button>
                    <button>Next</button>
                </div>

            </div>
        </div>
    )
}