import { createFileRoute, redirect, Link, useLoaderData } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import skeleLoader from '../assets/skeleLoader.svg'
import { useState } from 'react'

import { Pagination } from '@mui/material'

import TitleCardComponent from '../components/TitleCardComponent'
import PorpleButtonComponent from '../components/PorpleButtonComponent'


export const Route = createFileRoute('/')({
  component: Index,
  loader: async () => {
    const response = await fetch('http://localhost:3000/me', {
      credentials: 'include',
    })
    if(!response.ok) {
      const data = await response.json()
      console.log("data", data)
      throw redirect({ to: '/signup' })
    }
    const listResponse = await fetch('http://localhost:3000/listInstance', {
      credentials: 'include',
    })
    const listData = await listResponse.json()

    async function getGroupAmount(listId: number) {
      const groupResponse = await fetch(`http://localhost:3000/listGroupInstance/all/${listId}`, {
        credentials: 'include',
      })
      const groupData = await groupResponse.json()
      return groupData.length
    }

    async function getItemAmount(listId: number) {
      const itemResponse = await fetch(`http://localhost:3000/listItemInstance/all/${listId}`, {
        credentials: 'include',
      })
      const itemData = await itemResponse.json()
      return itemData.length
    }

    const congregateData = await Promise.all(listData.map(async (item: {id: number, userId: number, name: string, description: string}) => {

      const groupNum = await getGroupAmount(item.id)
      const itemNum = await getItemAmount(item.id)
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        groupNum,
        itemNum
      }
    }))

    return {
      congregateData,
    }
  }

})

function Index() {  

  const { congregateData } = useLoaderData({ from: '/' })
  console.log("congregateData", congregateData)
  const [searchData, setSearchData] = useState<{id: number, name: string, description: string, groupNum: number, itemNum: number}[]>(congregateData)
  const [currentlyShowing, setCurrentlyShowing] = useState(congregateData.slice(0, 5))
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  async function tempAddGroup() {
    const groupResponse = await fetch('http://localhost:3000/listGroupInstance', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ listId: 1, name: 'Test Group' }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const groupData = await groupResponse.json()
    console.log("groupData", groupData)
  }

  async function tempAddItem() {
    const itemResponse = await fetch('http://localhost:3000/listItemInstance', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ listId: 2, name: 'Test Items' }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const itemData = await itemResponse.json()
    console.log("itemData", itemData)
  }
  async function tempAddList() {
    const listResponse = await fetch('http://localhost:3000/listInstance', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ name: 'lmao1', description: 'lmao2' }),
    })
    const listData = await listResponse.json()
    console.log("listData", listData)
  }


  function handleChange(value: number) {
    setCurrentlyShowing(searchData.slice(value * 5 - 5, value * 5))
    setPage(value)
  }

  function handleSearch(value: string) {
    setPage(1)
    setSearch(value)
    setSearchData(congregateData.filter((list) => list.name.toLowerCase().includes(value.toLowerCase())))
    setCurrentlyShowing(searchData.slice(page * 5 - 5, page * 5))
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[600px] flex-1 max-h-screen">
      <br className="w-full h-[20px]" />
      <div className="flex flex-col w-full">
        <div className="flex self-end">
          <button onClick={tempAddItem}>Add Item</button>
          <button onClick={tempAddGroup}>Add Group</button>
          <button onClick={tempAddList}>Add List</button>
          <Link to="/creation">
            <PorpleButtonComponent disabled={false} width="w-[124px]">Create New</PorpleButtonComponent>
          </Link>
        </div>
        <br className="w-full h-[20px]" />
        <div className="flex items-center w-full rounded-full bg-[#F8F7FE] py-[16px] px-[24px]">
          <Search className='w-[18px] h-[18px] text-offBlack'/>
          <input placeholder='Search by Keyword' 
            className='w-full bg-transparent outline-none ml-1 text-offBlack placeholder:text-offBlack'
            onChange={(e) => handleSearch(e.target.value)}
            value={search}
          />
        </div>
        <br className="w-full h-[32px]" />
        <div className='flex flex-col gap-[16px]'>
          {
            searchData.length > 0 ? (
              currentlyShowing.map((list) => (
                <TitleCardComponent title={list.name} description={list.description} groups={list.groupNum} items={list.itemNum} key={list.id}/>
              ))
            ) : (
              <div className='flex flex-col items-center justify-center'>
            <img src={skeleLoader} alt="skeleton loader" className='w-[100px] h-[100px]' />
            <br className='w-full h-[12px]' />
            <p className='text-offBlack'>Start by creating a new list</p>
          </div>
            )
          
          }
        </div>
        <div className='w-full h-[24px]'/>
        {
          searchData.length > 0 && (
        <div className='flex justify-center'>
          <Pagination
            count={Math.ceil(searchData.length / 5)}
            shape='rounded'
            variant='outlined'
            hidePrevButton
            hideNextButton
            onChange={(event, value) => handleChange(value)}
          />
          </div>
          )
        }
      </div>
    </div>
  )
}