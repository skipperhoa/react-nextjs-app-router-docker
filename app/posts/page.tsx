import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Posts() {
    const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
        Posts
      </h1>
      <ul className="font-[family-name:var(--font-geist-sans)] max-w-2xl space-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`} className="font-semibold text-blue-600">{post.title}</Link>
            <span className="text-sm ml-2 text-red-500">
              by {post.author.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}