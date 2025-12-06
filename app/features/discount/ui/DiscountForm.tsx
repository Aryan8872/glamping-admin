"use client";

import React, { useEffect, useState, useMemo } from "react";
import GenericForm, { FieldConfig } from "@/app/components/GenericForm";
import {
  createDiscountSchema,
  CreateDiscountDTO,
  Discount,
  DISCOUNT_TYPE,
} from "../types/discountTypes";
import { createDiscount, updateDiscount } from "../service/discountService";
import { getAllCamps } from "../../camps/services/campService";
import { getAllAdventures } from "../../adventures/services/adventureService";
import SelectionModal from "@/app/components/SelectionModal";
import { BiChevronDown } from "react-icons/bi";

interface DiscountFormProps {
  initialData?: Discount;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DiscountForm({
  initialData,
  onSuccess,
  onCancel,
}: DiscountFormProps) {
  const [camps, setCamps] = useState<
    { id: number; name: string; image?: string }[]
  >([]);
  const [adventures, setAdventures] = useState<
    { id: number; name: string; image?: string }[]
  >([]);
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);
  const [isAdventureModalOpen, setIsAdventureModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campsData = await getAllCamps();
        // @ts-ignore
        const campsList = campsData.data || campsData || [];
        setCamps(
          campsList.map((c: any) => ({
            id: c.id,
            name: c.name,
            image: c.images?.[0],
          }))
        );

        const adventuresData = await getAllAdventures();
        // @ts-ignore
        const adventuresList = adventuresData.data || adventuresData || [];
        setAdventures(
          adventuresList.map((a: any) => ({
            id: a.id,
            name: a.name,
            image: a.coverImage,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values: CreateDiscountDTO) => {
    if (initialData) {
      await updateDiscount(initialData.id, values);
    } else {
      await createDiscount(values);
    }
    onSuccess();
  };

  const fields: FieldConfig<CreateDiscountDTO>[] = useMemo(
    () => [
      {
        name: "name",
        label: "Discount Name",
        type: "text",
        required: true,
        placeholder: "Summer Sale",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Discount description...",
      },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: [
          { label: "Percentage", value: DISCOUNT_TYPE.PERCENTAGE },
          { label: "Fixed Amount", value: DISCOUNT_TYPE.FIXED },
        ],
        required: true,
      },
      {
        name: "amount",
        label: "Amount",
        type: "number",
        required: true,
        placeholder: "10",
      },
      { name: "startsAt", label: "Starts At", type: "date", required: true },
      { name: "endsAt", label: "Ends At", type: "date" },
      { name: "isFeatured", label: "Featured", type: "checkbox" },
      {
        name: "campId",
        label: "Assign to Camp",
        type: "number", // Dummy type, overridden by render
        render: ({ value, onChange, error }) => {
          const selectedCamp = camps.find((c) => c.id === value);
          return (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Assign to Camp
              </label>
              <button
                type="button"
                onClick={() => setIsCampModalOpen(true)}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm flex items-center justify-between hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {selectedCamp?.image && (
                    <img
                      src={selectedCamp.image}
                      alt=""
                      className="w-6 h-6 rounded object-cover"
                    />
                  )}
                  <span
                    className={selectedCamp ? "text-gray-900" : "text-gray-400"}
                  >
                    {selectedCamp ? selectedCamp.name : "Select Camp"}
                  </span>
                </div>
                <BiChevronDown className="text-gray-500" />
              </button>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <SelectionModal
                isOpen={isCampModalOpen}
                onClose={() => setIsCampModalOpen(false)}
                title="Select Camp"
                items={camps}
                onSelect={(item) => onChange(item.id)}
              />
            </div>
          );
        },
      },
      {
        name: "adventureId",
        label: "Assign to Adventure",
        type: "number", // Dummy type
        render: ({ value, onChange, error }) => {
          const selectedAdventure = adventures.find((a) => a.id === value);
          return (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Assign to Adventure
              </label>
              <button
                type="button"
                onClick={() => setIsAdventureModalOpen(true)}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm flex items-center justify-between hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {selectedAdventure?.image && (
                    <img
                      src={selectedAdventure.image}
                      alt=""
                      className="w-6 h-6 rounded object-cover"
                    />
                  )}
                  <span
                    className={
                      selectedAdventure ? "text-gray-900" : "text-gray-400"
                    }
                  >
                    {selectedAdventure
                      ? selectedAdventure.name
                      : "Select Adventure"}
                  </span>
                </div>
                <BiChevronDown className="text-gray-500" />
              </button>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <SelectionModal
                isOpen={isAdventureModalOpen}
                onClose={() => setIsAdventureModalOpen(false)}
                title="Select Adventure"
                items={adventures}
                onSelect={(item) => onChange(item.id)}
              />
            </div>
          );
        },
      },
    ],
    [camps, adventures, isCampModalOpen, isAdventureModalOpen]
  );

  const initialValues: CreateDiscountDTO = useMemo(
    () => ({
      name: initialData?.name || "",
      description: initialData?.description || "",
      type: initialData?.type || DISCOUNT_TYPE.PERCENTAGE,
      amount: initialData?.amount || 0,
      startsAt: initialData?.startsAt
        ? new Date(initialData.startsAt)
        : new Date(),
      endsAt: initialData?.endsAt ? new Date(initialData.endsAt) : undefined,
      isFeatured: initialData?.isFeatured || false,
      campId: initialData?.campId || undefined,
      adventureId: initialData?.adventureId || undefined,
    }),
    [initialData]
  );

  return (
    <GenericForm
      title={initialData ? "Edit Discount" : "Add Discount"}
      initialValues={initialValues}
      validationSchema={createDiscountSchema}
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={initialData ? "Update Discount" : "Create Discount"}
    />
  );
}
