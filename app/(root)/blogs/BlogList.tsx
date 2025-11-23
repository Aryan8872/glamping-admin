import { Suspense } from "react";
import { BlogCard } from "./BlogCard";
import LatestBlog from "./LatestBlog";

export function BlogList({ blogs }: { blogs: [any] }) {
  return (
    <Suspense>
    <div className="flex flex-col gap-10 ">
        <section className="flex flex-col gap-2">
            <LatestBlog latestBlogs={blogs}/>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                
            </div>

        </section>
     
    </div>
    </Suspense>
  );
}
