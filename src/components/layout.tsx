import { Link, useRouter } from '@tanstack/react-router'
import { CircleUser } from 'lucide-react'


export default function Layout() {
  const router = useRouter()
  async function logout() {
    const response = await fetch('http://localhost:3000/signout', {
      method: 'POST',
      credentials: 'include',
    })
    if(response.ok) {
      router.navigate({ to: '/signup' })
    }
    
  }
  
  return (
    <>
      {/* Logo with user icon*/}
      <div className="flex items-center justify-between w-full">
        <Link to="/" className="text-4xl font-[800] text-porple">IDK</Link>
        <CircleUser className="w-10 h-10 hover:cursor-pointer" onClick={logout} />
      </div>
    </>
  )
}
