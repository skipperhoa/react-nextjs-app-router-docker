
import prisma from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const DeletePost =  ({id} : any) => {

  const deleteAction = async () => {
    "use server";

    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/dashboard/posts"); // Revalidate the posts page /posts
    //redirect("/dashboard/posts"); // Redirect to the posts page
  }

  return (
    <button 
      className="ml-2 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
      onClick={deleteAction}
    >
      Delete
    </button>
  )
}

export default async function Posts() {
    const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });

  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16 px-10">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
        Posts
      </h1>
     
      <Link href={"/dashboard/posts/new"} className="mb-5 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Create New Post
      </Link>
       <table className="w-full border-collapse border border-gray-600 bg-gray-100">
  <thead>
    <tr>
      <th className="border border-gray-300 p-5">ID</th>
      <th className="border border-gray-300 p-5">TITLE</th>
       <th className="border border-gray-300 p-5">CONTENT</th>
       <th className="border border-gray-300 p-5">MODIFY</th>
    </tr>
  </thead>
  <tbody>
    {posts.map((post : any) => (
      <tr key={post.id}>
        <td className="border border-gray-300 p-5 text-center">{post.id}</td>
        <td className="border border-gray-300 p-5 text-center">{post.title}</td>
         <td className="border border-gray-300 p-5 text-center">{post.content}</td>
          <td className="border border-gray-300 p-5 text-center">
            <Link href={`/dashboard/posts/${post.id}`} className="text-black hover:text-blue-500 hover:underline bg-yellow-400 px-3 py-1 rounded-md">
              Edit
            </Link>
             <DeletePost id={post.id} />
          </td>
      </tr>
    ))}
   
  </tbody>
</table>
    </div>
  );
}