"use client";
import { fetchDiscounts } from "@/app/features/discount/service/discountService";
import { Discount } from "@/app/features/discount/types/discountTypes";
import DiscountTable from "@/app/features/discount/ui/DiscountTable";
import { useEffect, useState } from "react";

export default function DiscountPage() {
  const [discountData, setDiscountData] = useState<Discount[]>([]);
  const loadData = async () => {
    const data = await fetchDiscounts();
    setDiscountData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <DiscountTable discount={discountData} onRefresh={loadData} />
    </div>
  );
}
