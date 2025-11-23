"use client";
import { Plan } from "@/types/PlanTypes";
import { BiSearch } from "react-icons/bi";
import Select from "react-select";
import makeAnimated from 'react-select/animated';

export default function PlanTable({planDatas}:{planDatas:Plan[]}) {
    const animatedComponents = makeAnimated();
    const roleOption : {label:string,value:string}[] = [{label:"Admin",value:"Admin"},{label:"Customer",value:"Customer"}]
    const statusOption : {label:string,value:string}[] = [{label:"All",value:"All"},{label:"Active",value:"Active"},{label:"InActive",value:"InActive"}]

    return (
        <div className="w-full mt-10">
            <div className="w-full flex justify-between  px-5 py-5 bg-white rounded-t-2xl ">
                <div className="flex flex-[0.9] py-3 px-3  items-center rounded-lg bg-[#F3F4F6] gap-2">
                    <BiSearch size={18} className="" color={"black"}/>
                    <input className="w-full h-full focus:outline-none rounded-lg relative" placeholder="Search "/>
                </div>

                <div className="flex gap-3  font-semibold">
                    <div className="flex gap-2 items-center bg-[#F3F4F6] px-3 rounded-lg">
                        <span>Role:</span>
                        <Select components={animatedComponents} className="!focus:outline-none !border-0" defaultValue={roleOption[0]} options={roleOption} />                    
                    </div>
                        <div className="flex gap-2 items-center bg-[#F3F4F6] px-3 rounded-lg">
                        <span>Status:</span>
                        <Select components={animatedComponents} className="!focus:outline-none !border-0 px-2" defaultValue={statusOption[0]} options={statusOption} />                    

                    </div>
                </div>

            </div>
            <table className="w-full table-auto text-left mt-3">
                <thead className="text-gray-700 bg-[#F9FAFB] ">
                    <tr>
                        <th className="px-4 py-2 font-semibold">Plan</th>
                        <th className="xl:block hidden px-4 py-2 font-semibold">Description</th>
                        <th className="px-4 py-2 font-semibold">Monthly Price</th>
                        <th className="px-4 py-2 font-semibold">Yearly Price</th>
                        <th className="px-4 py-2 font-semibold">Trial Days</th>
                        <th className="md:block hidden px-4 py-2 font-semibold">Features</th>
                        <th className="px-4 py-2 font-semibold">Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {planDatas?.map((plan,index)=>(
                        <tr key={plan.name ?? index} className="border-b text-[15px] border-black/10 bg-white">
                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-1">
                                    {plan.name}
                                    <span className="text-sm text-gray-500">{plan.price}</span>
                                </div>
                            </td>
                            <td className="xl:block hidden px-4 py-3  text-gray-500 ">{plan.description}</td>
                            <td className="px-4 py-3 text-gray-500 ">{plan.price_monthly}</td>
                            <td className="px-4 text-gray-500 py-3 ">{plan.price_yearly}</td>
                            <td className="px-4 py-3 text-gray-500 ">{plan.trial_days}</td>
                            <td className="px-4 md:block hidden py-3 text-gray-500 ">{plan.features}</td>
                          
                            <td className="px-4 py-3 ">
                                <div className="flex items-center gap-2">
                                    <button>Edit</button>
                                    <button>Delete</button>
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