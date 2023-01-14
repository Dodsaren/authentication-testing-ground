import { createContext, useContext, useEffect, useRef, useState } from 'react'
import S from './style.module.css'

const letters =
  'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ'.split(
    '',
  )

const computerText =
  'authentication in progress please hold on and surrender your bases'

export const PopupLoaderContext = createContext()

export const usePopupLoader = () => {
  return useContext(PopupLoaderContext)
}

export const PopupLoaderProvider = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <PopupLoaderContext.Provider value={{ open, setOpen }}>
      {children}
    </PopupLoaderContext.Provider>
  )
}

export const LoaderPopup = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { open } = usePopupLoader()
  console.log(open)
  useEffect(() => {
    if (!canvasRef.current || !open) {
      return
    }
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) {
      return
    }

    // Setting up the columns
    const fontSize = 10
    const columns = canvasRef.current.width / fontSize

    // Setting up the drops
    let drops: number[] = []
    for (var i = 0; i < columns; i++) {
      drops[i] = 1
    }

    const interval = setInterval(() => draw(ctx, canvasRef.current, drops), 66)

    // Setting up the draw function
    function draw(
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      drops: number[],
    ) {
      ctx.fillStyle = 'rgba(45, 51, 63, .1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (var i = 0; i < drops.length; i++) {
        var text = letters[Math.floor(Math.random() * letters.length)]
        ctx.fillStyle = '#46e8cb'
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        drops[i]++
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0
        }
      }
    }
    return () => {
      clearInterval(interval)
    }
  }, [open])
  if (!open) {
    return null
  }
  return (
    <div className='absolute top-0 left-0 bottom-0 right-0 bg-black bg-opacity-70'>
      <div className='fixed top-1/2 left-1/2 max-w-md -translate-x-1/2 -translate-y-1/2'>
        <div className='relative'>
          <img
            src='computers.png'
            alt=''
          />
          <canvas
            className='absolute top-[41.5%] left-[18%] inline-block h-[12.5%] w-[13%] skew-y-[23deg]'
            ref={canvasRef}
          ></canvas>
          <div className='absolute top-[27%] left-[53%] h-[13%] w-[15%] skew-y-[19deg] overflow-hidden bg-[#151926] font-[monospace] text-[.60em] leading-[130%] text-[#4ae0cb]'>
            <span
              className={S.type}
              style={{ ['--n']: computerText.length.toString() }}
            >
              {computerText}
            </span>
          </div>
          <div className='absolute top-[53.75%] left-[49.5%] h-[9%] w-[13%] skew-y-[23deg]  overflow-hidden bg-[#2e3642] leading-[67%] text-[#68d5b4]'>
            <div className='my-[-10px] animate-flicker'>
              :::: ::::: :::: :: : :::::: :: :::: :::::: :::: ::::::::: :: :
              ::::: :: ::: :::
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
