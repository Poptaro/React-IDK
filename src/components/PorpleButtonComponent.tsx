
export default function PorpleButtonComponent({ children, disabled, width }: { children: React.ReactNode, disabled: boolean, width: string }) {
  return (
    <button type="submit" className={`${disabled ? 'bg-offPorple' : 'bg-porple'} flex items-center justify-center text-white p-2 h-[32px] rounded-full ${width} hover:cursor-pointer hover:bg-gold active:bg-gold/70`}>{children}</button>
  )
}
