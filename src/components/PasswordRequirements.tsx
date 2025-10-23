import { Circle, CircleCheck, CircleX } from "lucide-react"

export default function PasswordRequirements({ children, color }: { children: React.ReactNode, color: string }) {
  return (
    <div className={`flex flex-row justify-start items-center w-full gap-[8px] ${color}`}>
      { color === "text-stem" ? (
        <CircleCheck className='w-[16px] h-[16px]' />
      ) : color === "text-strawberry" ? (
        <CircleX className='w-[16px] h-[16px]' />
      ) : (
        <Circle className='w-[16px] h-[16px]' />
      )}
      <p className={`${color}`}>{children}</p>
    </div>
  )
}
