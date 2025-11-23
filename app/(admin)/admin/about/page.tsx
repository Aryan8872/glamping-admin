import { getAboutUsContent } from "@/app/features/aboutus/service/aboutUsService";

import { PageHeading } from "@/components/PageHeading";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import StatsSection from "../../../features/aboutus/ui/StatsSection";

export default async function Routers() {
  const aboutData = await getAboutUsContent();

  return (
    <div className=" w-full">
      <PageHeading
        heading="About Us"
        subheading="Manage About us page content"
      />

      {/* TOP TEXT FIELDS */}
      <section className="grid grid-cols-2 gap-x-7 gap-y-5  py-7 border-b-[3px] border-gray-300">
        <div className="flex flex-col gap-2">
          <label className="font-medium">About Us</label>
          <textarea
            name="aboutUs"
            rows={6}
            defaultValue={aboutData.aboutUs}
            className="resize-none focus:outline-none border-[1.6px] rounded-lg p-2 text-gray-500 border-gray-300"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Text Box 1</label>
          <textarea
            name="textbox_1"
            rows={6}
            defaultValue={aboutData.textbox_1}
            className="resize-none focus:outline-none border-[1.6px] rounded-lg p-2 text-gray-500 border-gray-300"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Text Box 2</label>
          <textarea
            name="textbox_2"
            rows={6}
            defaultValue={aboutData.textbox_2}
            className="resize-none focus:outline-none border-[1.6px] rounded-lg p-2 text-gray-500 border-gray-300"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Mission</label>
          <textarea
            name="mission"
            rows={6}
            defaultValue={aboutData.mission}
            className="resize-none focus:outline-none border-[1.6px] rounded-lg p-2 text-gray-500 border-gray-300"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Vision</label>
          <textarea
            name="vision"
            rows={6}
            defaultValue={aboutData.vision}
            className="resize-none focus:outline-none border-[1.6px] rounded-lg p-2 text-gray-500 border-gray-300"
          />
        </div>
      </section>
      
      <section className="mt-4">
        <h1 className="text-xl font-semibold mb-2">Stats Section</h1>
        <StatsSection data={aboutData.stats} />
      </section>

      {/* CORE VALUES EDITOR */}
      <section className="mt-4">
        <h1 className="text-lg font-semibold mb-2">Core Values</h1>
        {/* <CoreValuesEditor initialValues={aboutData.coreValues} /> */}
      </section>

      <div className="w-full mt-7 flex gap-3 justify-end">
        <PrimaryFilledButton text="Save" />
        <SecondaryButton text="Cancel" />
      </div>
    </div>
  );
}
