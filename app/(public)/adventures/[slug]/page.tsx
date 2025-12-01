import { getAdventureBySlug } from "@/app/features/adventures/services/adventureService";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface AdventurePageProps {
  params: {
    slug: string;
  };
}

export default async function AdventurePage({ params }: AdventurePageProps) {
  let adventure;

  try {
    adventure = await getAdventureBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  const camps = adventure.campSites?.map((cs) => cs.campSite) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL}${adventure.bannerImage}`}
          alt={adventure.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-4">
            <h1 className="text-5xl font-bold mb-4">{adventure.title}</h1>
            <p className="text-xl">{adventure.description}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            About This Adventure
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {adventure.pageDescription}
          </p>
        </div>

        {/* Camps Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Available Campsites ({camps.length})
          </h2>

          {camps.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500">
                No campsites available for this adventure yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {camps.map((camp) => (
                <Link
                  key={camp.id}
                  href={`/camps/${camp.slug}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 w-full">
                    {camp.images && camp.images.length > 0 ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL}${camp.images[0]}`}
                        alt={camp.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {camp.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {camp.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-semibold">
                        ${Number(camp.pricePerNight).toFixed(2)}/night
                      </span>
                      <span className="text-sm text-gray-500">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
