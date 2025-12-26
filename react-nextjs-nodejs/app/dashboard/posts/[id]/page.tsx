import PostEdit from "@/components/post/PostEdit";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/posts/'+id).then(res => res.json())
  console.log(post) 
  return (
    <div>
         <PostEdit post = {post} />
    </div>
  )
}
