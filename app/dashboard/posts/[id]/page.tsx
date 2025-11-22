import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Form from "next/form";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: true,
    },
  });

  const updatePost = async (formData: FormData) => {
    "use server";

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
      },
    });

    revalidatePath("/dashboard/posts"); // Revalidate the posts page /posts
    redirect("/dashboard/posts"); // Redirect to the posts page
  };

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center -mt-16">
        <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
       Edit Post : {post.id}
      </h1>
      <Form action={updatePost} className="w-full">

        <div className="w-full px-10">
            <div className="w-full bg-gray-100 rounded-xl p-5 mb-2">
              <div className="w-full">
                  <label className="w-full font-bold text-blue-500 py-5">Title</label> 
                  <input type="text" name="title" defaultValue={post.title} className="w-full p-3 rounded-md mt-2 mb-5 bg-gray-300"/>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-xl p-5 mb-2">
              <div className="w-full">
                  <label className="w-full font-bold text-blue-500 py-5">Content</label> 
                  <input type="text" name="content" defaultValue={post.content} className="w-full p-3 rounded-md mt-2 mb-5 bg-gray-300"/>
              </div>
            </div>
            <div className="w-fullp-5 mb-2">
              <button type="submit" className="w-full bg-green-600 py-4 text-white uppercase rounded-xl" >Update post</button>
            </div>
        </div>
      </Form>
    </div>
  );
}