
export default async function Users() {
  const users = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/users',{
    next:{
      revalidate:5
    }
  }).then((res) => res.json());
  
  return (
     <div className="min-h-screen w-full max-w-5xl m-auto px-10  flex flex-col items-center justify-center -mt-16">
      <h1 className='w-ful font-bold text-3xl text-blue-500 py-5'>LIST USERS</h1>
      <table className="w-full border-collapse border border-gray-600 bg-gray-100">
  <thead>
    <tr>
      <th className="border border-gray-300 p-5">ID</th>
      <th className="border border-gray-300 p-5">NAME</th>
       <th className="border border-gray-300 p-5">EMAIL</th>
    </tr>
  </thead>
  <tbody>
    {users.map((user : any) => (
      <tr key={user.id}>
        <td className="border border-gray-300 p-5 text-center">{user.id}</td>
        <td className="border border-gray-300 p-5 text-center">{user.name}</td>
         <td className="border border-gray-300 p-5 text-center">{user.email}</td>
      </tr>
    ))}
   
  </tbody>
</table>
    </div>
  );
}
