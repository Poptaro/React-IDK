import { createFileRoute, redirect } from '@tanstack/react-router'

import WordBarComponent from '../components/WordBarComponent'
import ListBoxComponent from '../components/ListBoxComponent'
import { useState } from 'react'

export const Route = createFileRoute('/creation')({
  component: RouteComponent,
  loader: async () => {
    const response = await fetch('http://localhost:3000/me', {
      credentials: 'include',
    })
    if(!response.ok) {
      throw redirect({ to: '/signup' })
    }
  } 
})

function RouteComponent() {
  async function testAuth() {
    const response = await fetch('http://localhost:3000/listInstance', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test List', description: 'Test Description' }),
      credentials: 'include',
    })
    const data = await response.json()
    console.log("testAuth.ts: data", data)
  }

  async function createList(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const response = await fetch('http://localhost:3000/listInstance', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
      credentials: 'include',
    })
    const data = await response.json()
    console.log("createList.ts: data", data)
  }

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')



  return (
    <div className="flex flex-col h-screen flex-shrink-0">
      <form onSubmit={createList} className='flex flex-col items-center justify-center w-[600px] pl-[12px]'>
        <button onClick={testAuth}>Test Auth</button>
        <WordBarComponent placeholder="Name of list" max={60} value={name} onChange={(value) => setName(value)} passwordBoolean={false} />  
        <WordBarComponent placeholder="List Description (optional)" max={100} value={description} onChange={(value) => setDescription(value)} passwordBoolean={false} />
        <button type="submit">Create List</button>
        <div className='h-[30px] w-full'/>
      </form>
      <ListBoxComponent />
    </div>
  )
}
