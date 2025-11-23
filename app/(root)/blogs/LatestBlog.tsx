import { dateConverter } from "@/utils/dateConverter";
import Image from "next/image";
import { BiUser } from "react-icons/bi";
import { CiCalendar } from "react-icons/ci";

export default function LatestBlog({ latestBlogs }: { latestBlogs: any[] }) {
  if (!latestBlogs || latestBlogs.length === 0) return null;

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <h1 className="text-3xl sm:text-4xl font-semibold">Latest Blogs</h1>
      
      <div className="flex flex-col gap-5">
        {/* Featured Blog Card */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl overflow-hidden">
          {/* Image Section */}
          <div className="relative w-full h-72 sm:h-80 lg:h-96">
            <Image
              src={latestBlogs[0].featuredImage || "/blog_latest.jpg"}
              alt={latestBlogs[0].title || "Latest blog"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          
          {/* Content Section */}
          <div className="flex flex-col gap-4 justify-between p-6 sm:p-8 lg:py-12 lg:px-10">
            <span className="text-xs sm:text-sm uppercase text-gray-500 font-medium tracking-wider">
              {latestBlogs[0].category || "Category"}
            </span>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight line-clamp-3">
              {latestBlogs[0].title || latestBlogs[0].excerpt}
            </h2>
            
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600 font-medium">
              <span className="flex items-center gap-2">
                <BiUser className="text-base" />
                {latestBlogs[0].author}
              </span>
              <span className="flex items-center gap-2">
                <CiCalendar className="text-base" />
                {latestBlogs[0].createdAt
                  ? dateConverter(latestBlogs[0].createdAt)
                  : dateConverter(latestBlogs[0].updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
          {latestBlogs.slice(1, 4).map((blog, idx) => (
            <div 
              key={blog.id || idx}
              className="flex flex-col sm:flex-row xl:flex-col gap-0 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full"
            >
              {/* Image Section */}
              <div className="relative w-full sm:w-40 xl:w-full aspect-[4/3] sm:aspect-square xl:aspect-[16/9] flex-shrink-0">
                <Image
                  src={blog.featuredImage || "/blog_latest.jpg"}
                  alt={blog.title || "Blog post"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 160px, 33vw"
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-col gap-2 p-3.5 sm:p-4 flex-grow">
                <span className="text-[10px] uppercase text-gray-500 font-medium tracking-wider">
                  {blog.category || "Category"}
                </span>
                
                <h3 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2">
                  {blog.title || blog.excerpt}
                </h3>
                
                <div className="flex flex-col gap-1.5 mt-auto pt-2 text-xs text-gray-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <BiUser className="text-xs flex-shrink-0" />
                    <span className="truncate">{blog.author}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CiCalendar className="text-xs flex-shrink-0" />
                    <span className="truncate">
                      {blog.createdAt
                        ? dateConverter(blog.createdAt)
                        : dateConverter(blog.updatedAt)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}