"use client";
import GenericTable, { Column } from "@/app/components/GenericTable";
import { useState } from "react";
import { Discount, DISCOUNT_TYPE } from "../types/discountTypes";
import { format } from "date-fns";
import { BiEdit, BiTrash, BiPlus } from "react-icons/bi";
import Modal from "@/app/components/Modal";
import DiscountForm from "./DiscountForm";
import { useRouter } from "next/navigation";
import { deleteDiscount } from "../service/discountService";
import { useConfirm } from "@/stores/useConfirm";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { confirm } = useConfirm();

  const handleEdit = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedDiscount(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await confirm(
      "Are you sure you want to delete this discount?"
    );
    if (isConfirmed) {
      await deleteDiscount(id);
      onRefresh();
      router.refresh();
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedDiscount(null);
    onRefresh();
    router.refresh();
  };

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
    if (status) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Active
        </span>
      );
    } else {
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
        return (
          <div className="font-medium text-sm text-gray-900">
            {discount.name}
          </div>
        );
      },
      accessorKey: "name",
    },
    {
      header: "Description",
      cell(discount) {
        return (
          <div className="max-w-xs text-gray-500 text-sm truncate ">
            {discount.description}
          </div>
        );
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
        return (
          <div className="text-sm text-gray-900 font-medium">
            {discount.amount}
          </div>
        );
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
        return (
          <div className="text-gray-500 text-sm ">
            {discount.endsAt
              ? format(new Date(discount.endsAt), "MM ,dd ,yyyy")
              : "-"}
          </div>
        );
      },
      accessorKey: "endsAt",
    },

    {
      header: "Actions",
      className: "text-right",
      cell: (discount) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleEdit(discount)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Discount"
          >
            <BiEdit size={18} />
          </button>
          <button
            onClick={() => handleDelete(discount.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Discount"
          >
            <BiTrash size={18} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="flex justify-end px-2">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <BiPlus size={18} />
          Add Discount
        </button>
      </div>
      <GenericTable columns={columns} data={discount} title="Discounts" />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDiscount ? "Edit Discount" : "Add Discount"}
      >
        <DiscountForm
          initialData={selectedDiscount || undefined}
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
