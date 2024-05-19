import { useEffect, useState, useRef } from 'react'
import { Outlet, useLocation, Link, NavLink, useNavigate, useNavigation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './../contexts/AuthContext'
import MaterialIcon from './helper/MaterialIcon'
import Shimmer from './helper/Shimmer'
import Splashscreen from './splashscreen'
import styles from './Layout.module.scss'

import Aratta from './../../src/assets/aratta.svg'
import Lukso from './../../src/assets/lukso.svg'
import UniversalProfile from './../../src/assets/universal-profile.svg'
import party from 'party-js'

party.resolvableShapes['UniversalProfile'] = `<img src="${UniversalProfile}"/>`
party.resolvableShapes['Lukso'] = `<img src="${Lukso}"/>`

let links = [
  {
    name: 'Submit your dApp',
    icon: null,
    target: '_blank',
    path: `https://docs.google.com/forms/d/e/1FAIpQLScUYz_4VjdcB9bMOilhN67cFdzF1U7XZ1o0XqQYkaxThwTijA/viewform`,
  },
  {
    name: 'Contract',
    icon: null,
    target: '_blank',
    path: `https://explorer.execution.mainnet.lukso.network/address/${import.meta.env.VITE_UPSTORE_CONTRACT_MAINNET}`,
  },
]

export default function Root() {
  const [network, setNetwork] = useState()

  const [isLoading, setIsLoading] = useState()
  const noHeader = ['/sss']
  const auth = useAuth()
  const navigate = useNavigate()
  const navigation = useNavigation()
  const location = useLocation()



  return (
    <>
      <Toaster />
      <Splashscreen />

      <div className={styles.layout}>
        <header />

        <main>
          <Outlet />
        </main>

        <footer />
      </div>
    </>
  )
}
