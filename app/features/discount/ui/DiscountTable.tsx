import GenericTable, { Column } from "@/app/components/GenericTable";
import { useState } from "react";
import { Discount, DISCOUNT_TYPE } from "../types/discountTypes";
import EditDiscount from "./EditDiscount";
import { format } from "date-fns";
import { BiEdit } from "react-icons/bi";

export default function DiscountTable({
  discount,
  onRefresh,
}: {
  discount: Discount[];
  onRefresh: () => void;
}) {
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const getDiscountTypeColor = (type: DISCOUNT_TYPE) => {
    switch (type) {
      case DISCOUNT_TYPE.FIXED:
        return "text-white bg-primary-blue";

      case DISCOUNT_TYPE.PERCENTAGE:
        return (
          <div className="rounded-lg text-white bg-emerald-500">{type}</div>
        );
    }
  };

  const getDiscountStatusColor = (status: boolean) => {
    switch (status) {
      case true:
        return "bg-blue-100 text-blue-800";
      case false:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const columns: Column<Discount>[] = [
    {
      header: "Discount Name",
      cell: (discount: Discount) => {
        return <div className="text-xs text-gray-300">{discount.name}</div>;
      },
      accessorKey: "name",
    },
    {
      header: "Description",
      cell(discount) {
        return <div>{discount.description}</div>;
      },
    },
    {
      header: "Type",
      cell(discount) {
        return (
          <div
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDiscountTypeColor(
              discount.type
            )}`}
          >
            {discount.type}
          </div>
        );
      },
      accessorKey: "type",
    },
    {
      header: "Amount",
      cell(discount) {
        return <div>{discount.amount}</div>;
      },
      accessorKey: "amount",
    },

    {
      header: "Status",
      cell(discount) {
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDiscountStatusColor(
            discount.active
          )}`}
        >
          {discount.active}
        </span>;
      },
      accessorKey: "active",
    },

    {
      header: "Featured",
      cell(discount) {
        return (
          <div>
            <input checked={discount.isFeatured} disabled type="checkbox" />
          </div>
        );
      },
      accessorKey: "isFeatured",
    },

    {
      header: "Ends At",
      cell(discount) {
        return <div>{format(new Date(discount.endsAt), "MM dd ,YYY")}</div>;
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

      {selectedDiscount && <EditDiscount onClose={()=>{
        onRefresh()
        setSelectedDiscount(null)
      }} discount={selectedDiscount} />}
    </div>
  );
}
