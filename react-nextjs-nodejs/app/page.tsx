import Link from 'next/link';
export default async function Users() {

  return (
     <div className="min-h-screen w-full max-w-5xl m-auto px-10  flex flex-col items-center justify-center -mt-16">
        <div className='w-full flex flex-row gap-5 items-center justify-center'>
           <Link href={'/dashboard/users'} className='w-[200px] h-[200px] bg-gray-100 shadow-lg rounded-lg flex items-center justify-center'>
            <h1 className='w-ful font-bold text-3xl text-blue-500 py-5'>LIST USERS</h1>
        </Link>
         <Link href={'/dashboard/posts'} className='w-[200px] h-[200px] bg-blue-400 shadow-lg rounded-lg flex items-center justify-center'>
            <h1 className='w-ful font-bold text-3xl text-red-500 py-5'>LIST POSTS</h1>
        </Link>
        </div>
    </div>
  );
}
