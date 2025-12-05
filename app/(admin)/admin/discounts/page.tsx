"use client"
import { getAllDiscount } from "@/app/features/discount/service/discountService";
import { Discount } from "@/app/features/discount/types/discountTypes";
import DiscountTable from "@/app/features/discount/ui/DiscountTable";
import { useEffect, useState } from "react";

export default async function DiscountPage() {
  const [discountData, setDiscountData] = useState<Discount[]>([]);
  useEffect(() => {
    getAllDiscount().then(setDiscountData);
    console.log(discountData)
  }, []);
  return (
    <div>
      <DiscountTable
        discount={discountData}
      />
    </div>
  );
}
