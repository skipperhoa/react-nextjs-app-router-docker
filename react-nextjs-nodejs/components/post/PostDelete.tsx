'use client';
import { useRouter } from "next/navigation";
export default function PostDelete({ id }: any) {
 
    const router = useRouter();
  const deleteAction = async (id: any) => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/posts/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete post");
    }
    router.push('/dashboard/posts')

  };
  return (
    <button
      className="ml-2 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
      onClick={() => deleteAction(id)}
    >
      Delete
    </button>
  );
}
