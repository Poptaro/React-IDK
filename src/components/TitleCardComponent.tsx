import { useState, useEffect } from 'react'
import { Ellipsis, Trash, Pencil, Box } from 'lucide-react'

import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper from '@mui/material/Popper';

import WhiteButtonComponent from './WhiteButtonComponent'


interface TitleCardComponentProps {
  title: string
  description: string | null
  groups?: number
  items: number
  listId?: number // Optional: if provided, will fetch groups automatically
}

export default function TitleCardComponent({ 
  title, 
  description, 
  groups: initialGroups, 
  items, 
  listId 
}: TitleCardComponentProps) {
  const [groups, setGroups] = useState<number>(initialGroups || 0)
  const [isLoading, setIsLoading] = useState<boolean>(false)


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  async function getGroupAmount(listId: number) {
    const groupResponse = await fetch(`http://localhost:3000/listGroupInstance/all/${listId}`, {
      credentials: 'include',
    })
    const groupData = await groupResponse.json()
    return groupData.length
  }

  useEffect(() => {
    if (listId && !initialGroups) {
      setIsLoading(true)
      getGroupAmount(listId)
        .then(setGroups)
        .finally(() => setIsLoading(false))
    }
  }, [listId, initialGroups])

  return (
    <div className="flex flex-start w-full border-2 border-offOffBlack rounded-xl px-[6px] py-[14px] justify-between">
      <div className="border-l-2 border-lilac pl-[4px]">
        <p className="text-lg">{title}</p>
        <p className="text-sm font-[400] text-offBlack">{description}</p>
        <p className="text-xs font-[600]">
          {isLoading ? 'Loading...' : `${groups} Groups`} • {items} Items
        </p>
      </div>
      <div className="flex">
        <div className="flex flex-row self-start items-center">
          <WhiteButtonComponent disabled={false} width="w-[124px]">Randomize</WhiteButtonComponent>
          <Ellipsis className="w-[24px] h-[24px] hover:cursor-pointer rotate-90" onClick={handleClick} />
          <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
          </Popper>
        </div>
      </div>
    </div>
  )
}