import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPostBySlug } from "@/api/blogAPI";
import BlogSEO from "@/components/blog/BlogSEO";

export default function BlogPost() {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogPost", slug],
    queryFn: () => fetchBlogPostBySlug(slug),
  });

  if (isLoading) return null;
  if (error) throw error;

  return (
    <>
      <BlogSEO post={data} />
      <article className="prose mx-auto py-16">
        <h1>{data.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
      </article>
    </>
  );
}

