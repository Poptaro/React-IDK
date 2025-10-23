import { createFileRoute, Link, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import WordBarComponent from '../components/WordBarComponent.tsx'
import PorpleButtonComponent from '../components/PorpleButtonComponent.tsx'

export const Route = createFileRoute('/login')({
  component: Index,
  loader: async () => {
    //cant read this due to security httpOnly cookie
    const response = await fetch('http://localhost:3000/me', {
      credentials: 'include',
    })

    if(response.ok) {
      const data = await response.json()
      console.log("data", data)
      throw redirect({ to: '/' })
    }
  }
})

function Index() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if(username.length < 1) {
      setError("Username is required")
      return
    }
    if(password.length < 1) {
      setError("Password is required")
      return
    }
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })
    if(response.ok) {
      router.navigate({ to: '/' })
    }
  }

  return (
    <div className="w-full p-2 max-w-[600px]">
      <h3 className=''>Sign into your account</h3>
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-[12px]">
        <WordBarComponent placeholder="Username" max={20} value={username} onChange={(value) => setUsername(value)} passwordBoolean={false} />
        <WordBarComponent placeholder="Password" max={20} value={password} onChange={(value) => setPassword(value)} passwordBoolean={true} />
        <div className='flex flex-row items-center justify-between w-full'>
          <div className='flex flex-row justify-between'>
            <p>Don't have an account?&nbsp;</p>
            <Link to="/signup" className='text-porple underline hover:cursor-pointer hover:text-gold active:text-gold/70'>Sign up</Link>  
          </div>
          <div>Forgot password?</div>
        </div>
        <div className='w-full h-[40px]' />
        <PorpleButtonComponent disabled={password.length < 1 || username.length < 1} width="w-[240px]">Sign in</PorpleButtonComponent>
      </form>
    </div>
  )
}