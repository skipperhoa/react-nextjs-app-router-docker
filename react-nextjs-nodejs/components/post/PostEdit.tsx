
'use client'
import { useRouter } from "next/navigation";
import Form from "next/form";
export default function PostEdit({ post }: any) {
   const router = useRouter();
  const updatePost = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
   
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/posts/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    })
    if(!res.ok) {
      throw new Error('Failed to update post')
    }
    alert('Post updated successfully')
    router.push('/dashboard/posts')
  };


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