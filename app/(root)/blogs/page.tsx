import { cacheLife, cacheTag } from "next/cache"
import { BlogList } from "./BlogList"

export default async function Blogs(){
    'use cache'
    const blogs = await fetch("http://localhost:8080/blog/all")
    const data = await blogs.json()
    const blogsData = data.data
    cacheTag("blogs")
    cacheLife("minutes")
    return(
        <div>
            <BlogList blogs={blogsData}/>
        </div>
    )
}