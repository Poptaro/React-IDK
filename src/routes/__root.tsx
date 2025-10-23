import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import Layout from '../components/layout.tsx'


export const Route = createRootRoute({
  component: () => (
    <div className='flex flex-col items-center mx-[15%] h-screen'>
      <div className="p-2 flex gap-2 sticky top-0 bg-strawberry">
        <Link to="/" className="[&.active]:font-bold">
          Home  
        </Link>
        <Link to="/signup" className="[&.active]:font-bold">
          Signup
        </Link>
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>
      </div>
      <Layout />
      <Outlet />
    </div>
  )
})