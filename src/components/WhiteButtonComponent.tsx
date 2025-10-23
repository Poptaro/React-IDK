export default function WhiteButtonComponent({ children, disabled, width }: { children: React.ReactNode, disabled: boolean, width: string }) {
  return (
    <button className={`${disabled ? 'bg-offBlack' : 'bg-white'} flex items-center justify-center text-black text-center h-[32px] p-2 border-1 border-black rounded-full ${width} hover:cursor-pointer hover:bg-black hover:text-white active:bg-offOffBlack/70`}>{children}</button>
  )
}
