"use client";
import GenericTable, { Column } from "@/app/components/GenericTable";
import { useState } from "react";
import { Discount, DISCOUNT_TYPE } from "../types/discountTypes";
import EditDiscount from "./EditDiscount";
import { format } from "date-fns";
import { BiEdit } from "react-icons/bi";

export default function DiscountTable({ discount }: { discount: Discount[] }) {
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const getDiscountTypeColor = (type: DISCOUNT_TYPE) => {
    switch (type) {
      case DISCOUNT_TYPE.FIXED:
        return (
          <span
            className={`px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium }`}
          >
            {type}
          </span>
        );

      case DISCOUNT_TYPE.PERCENTAGE:
        return (
          <span className="px-2.5 py-1  rounded-full text-white text-xs font-medium bg-emerald-500">
            {type}
          </span>
        );
    }
  };

  const getDiscountStatusColor = (status: boolean) => {
    switch (status) {
      case status === true:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Active
          </span>
        );
      case status === false:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            InActive
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            InActive
          </span>
        );
    }
  };
  const columns: Column<Discount>[] = [
    {
      header: "Discount Name",
      cell: (discount: Discount) => {
        return <div className="font-medium text-sm text-gray-900">{discount.name}</div>;
      },
      accessorKey: "name",
    },
    {
      header: "Description",
      cell(discount) {
        return <div className="max-w-xs text-gray-500 text-sm truncate ">{discount.description}</div>;
      },
    },
    {
      header: "Type",
      cell(discount) {
        return getDiscountTypeColor(discount.type);
      },
      accessorKey: "type",
    },
    {
      header: "Amount",
      cell(discount) {
        return <div className="text-sm text-gray-900 font-medium">{discount.amount}</div>;
      },
      accessorKey: "amount",
    },

    {
      header: "Status",
      cell(discount) {
        return getDiscountStatusColor(discount.active);
      },
      accessorKey: "active",
    },

    {
      header: "Featured",
      cell(discount) {
        return (
          <div>
            <input
              readOnly // makes it non-editable but still triggers :checked styles
              className="w-4 h-4 rounded border-gray-300 checked:bg-blue-600 checked:border-blue-600"
              checked={discount.isFeatured}
              type="checkbox"
            />
          </div>
        );
      },
      accessorKey: "isFeatured",
    },

    {
      header: "Ends At",
      cell(discount) {
        return <div className="text-gray-500 text-sm ">{format(new Date(discount.endsAt), "MM ,dd ,YYY")}</div>;
      },
      accessorKey: "endsAt",
    },

    {
      header: "Actions",
      className: "text-right",
      cell: (discount) => (
        <div className="flex justify-end">
          <button
            onClick={() => setSelectedDiscount(discount)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Booking"
          >
            <BiEdit size={18} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <GenericTable columns={columns} data={discount} title="" />

      {selectedDiscount && (
        <EditDiscount
          onClose={() => {
            setSelectedDiscount(null);
          }}
          discount={selectedDiscount}
        />
      )}
    </div>
  );
}
