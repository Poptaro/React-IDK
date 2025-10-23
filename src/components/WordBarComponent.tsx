import { useState } from 'react'
import { EyeIcon, EyeClosed } from 'lucide-react'

export default function WordBarComponent({ placeholder, max, value, onChange, passwordBoolean }: { placeholder: string, max: number | null, value: string, onChange: (value: string) => void, passwordBoolean: boolean }) {

  const [isFocused, setIsFocused] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)

  return (
    <div className='w-full flex flex-col pt-[4px]'>
      <div className='h-[12px]'>
        {
          isFocused ? (
            <p className='text-offBlack text-xs px-[12px]'>{placeholder}</p>
          ) : (
            null
          )
        }
      </div>
      <div className='flex flex-row items-center justify-between'>
        <input 
          type={passwordBoolean ? (passwordVisible ? 'text' : 'password') : 'text'} 
          placeholder={isFocused ? "" : placeholder}
          value={value}
          onFocus={() => setIsFocused(true)} 
          onBlur={() => setIsFocused(false)}
          className='w-full border-black outline-none px-[12px] pb-[6px] pt-[2px] text-offBlack' 
          onChange={(e) => onChange(e.target.value)}
          maxLength={max ? max : undefined}
        />
        <div className='flex flex-row items-center justify-center cursor-pointer'>
          {
            passwordBoolean ? (
              passwordVisible ? (
                <EyeIcon className='w-[16px] h-[16px] cursor-pointer' onClick={() => setPasswordVisible(!passwordVisible)} />
              ) : (
                <EyeClosed className='w-[16px] h-[16px] cursor-pointer' onClick={() => setPasswordVisible(!passwordVisible)} />
              )
            ) : (
              null
            )
          }
        </div>
      </div>
      <div className='w-full border-1 h-[1px]' />
      {
        max ? (
          <p className='flex flex-row-reverse w-full text-offBlack text-sm'>{value.length}/{max} Character(s)</p>
        ) : (
          null
        )
      }
    </div>
  )
}
