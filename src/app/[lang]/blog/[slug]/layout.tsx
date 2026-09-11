import { getPostForView } from "@/lib/posts";
import BlogSidebar from "@/components/blog/sidebar/BlogSidebar";

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostForView(slug);

  return (
    <div className="max-w-7xl mx-auto py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Əsas Oxuma Sahəsi */}
        <main className="lg:col-span-8">{children}</main>

        {/* Bloqa Xüsusi Sağ Sidebar */}
        <div className="lg:col-span-4">
          <BlogSidebar post={post} />
        </div>
      </div>
    </div>
  );
}
