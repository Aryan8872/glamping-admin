import { getAboutUsContent } from "@/features/aboutus/service/aboutUsService";
import AboutUsForm from "@/features/aboutus/ui/AboutUsForm";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const aboutData = await getAboutUsContent();

  return (
    <div className="w-full">
      <AboutUsForm initialData={aboutData} />
    </div>
  );
}

