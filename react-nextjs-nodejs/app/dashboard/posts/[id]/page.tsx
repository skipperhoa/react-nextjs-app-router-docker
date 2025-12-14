import PostEdit from "@/components/post/PostEdit";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await fetch('http://localhost:9000/api/posts/'+id).then(res => res.json())
  console.log(post) 
  return (
    <div>
         <PostEdit post = {post} />
    </div>
  )
}
