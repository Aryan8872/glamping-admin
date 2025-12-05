import { getAllDiscount } from "@/app/features/discount/service/discountService";
import DiscountTable from "@/app/features/discount/ui/DiscountTable";

export default async function DiscountPage() {
  const discountData = await getAllDiscount();
  return (
    <div>
      <DiscountTable
        onRefresh={() => getAllDiscount()}
        discount={discountData}
      />
    </div>
  );
}
