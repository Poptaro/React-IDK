import { createFileRoute, Link, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import WordBarComponent from '../components/WordBarComponent.tsx'
import PorpleButtonComponent from '../components/PorpleButtonComponent.tsx'
import PasswordRequirements from '../components/PasswordRequirements.tsx'

export const Route = createFileRoute('/signup')({
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
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if(username.length < 4) {
      setError("Username is required and must be at least 4 characters long")
      return
    }
    if(password.length < 3) {
      setError("Password is required and must be longer than 3 characters")
      return
    }
    if(password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    const response = await fetch('http://localhost:3000/signup', {
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
      <h3 className=''>Sign up for an account</h3>
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-[12px]">
        <WordBarComponent placeholder="Username" max={20} value={username} onChange={(value) => setUsername(value)} passwordBoolean={false} />
        <WordBarComponent placeholder="Password" max={20} value={password} onChange={(value) => setPassword(value)} passwordBoolean={true} />
        <WordBarComponent placeholder="Re-enter password" max={20} value={confirmPassword} onChange={(value) => setConfirmPassword(value)} passwordBoolean={true} />
        <div className='flex flex-col justify-start items-start w-full gap-[8px]'>
          <PasswordRequirements color={password.length === 0 ? "text-black" : password.length < 8 ? "text-strawberry" : "text-stem"}>
          Must be at least 8 characters
          </PasswordRequirements>
          <PasswordRequirements color={password.length === 0 ? "text-black" : (!/\d/.test(password) || !/[^\w\s]/.test(password)) ? "text-strawberry" : "text-stem"}>
            Must contain at least one number or symbol
          </PasswordRequirements>
          <PasswordRequirements color={confirmPassword.length === 0 ? "text-black" : (password !== confirmPassword ? "text-strawberry" : "text-stem")}>
          Passwords must match
          </PasswordRequirements>
        </div>
        <div className='flex flex-row items-center justify-between w-full'>
          <div className='flex flex-row justify-between'>
            <p>Already have an account?&nbsp;</p>
            <Link to="/login" className='text-porple underline hover:cursor-pointer hover:text-gold active:text-gold/70'>Sign in</Link>  
          </div>
        </div>
        <div className='w-full h-[40px]' />
        <PorpleButtonComponent disabled={password.length < 8 || !/\d/.test(password) || !/[^\w\s]/.test(password) || password !== confirmPassword} width="w-[240px]">Sign up</PorpleButtonComponent>
      </form>
    </div>
  )
}