import { useEffect, useRef } from 'react'
import Logo from './../../src/assets/logo.svg'
import Luckybet from './../../src/assets/luckybet.svg'
import styles from './Splashscreen.module.scss'

export default function Splashscreen() {
  const splashscreenRef = useRef()

  useEffect(() => {
    if (splashscreenRef.current !== undefined) {
      window.setTimeout(() => splashscreenRef.current.classList.add('animate__fadeOut'), 1000)
      window.setTimeout(() => splashscreenRef.current.remove(), 1700)
    }
  }, [])
  return <></>
  return (
    <section className={`${styles.section} animate__animated`} data-name={import.meta.env.VITE_NAME} ref={splashscreenRef}>
      <figure className={`${styles['logo']}`}>
        <img alt={import.meta.env.VITE_NAME} src={Logo} className={`animate__animated animate__pulse animate__infinite`} />
      </figure>

      <div className={`${styles['name']}`}>
        <figure>
          <img alt={import.meta.env.VITE_NAME} src={Luckybet} />
        </figure>
        <h2>{import.meta.env.VITE_SLOGAN}</h2>
      </div>
    </section>
  )
}
