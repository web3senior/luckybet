import { useEffect, useRef, useState } from 'react'
import { useNavigate, defer, useParams } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import MaterialIcon from './helper/MaterialIcon'
import Shimmer from './helper/Shimmer'
import Loading from './components/LoadingSpinner'
import { CheckIcon, ChromeIcon, BraveIcon } from './components/icons'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, web3, _ } from '../contexts/AuthContext'
import styles from './Play.module.scss'
import Web3 from 'web3'
import ABI from '../abi/luckybet.json'
import party from 'party-js'
import clickSounds from './../assets/sounds/click.wav'
// import { getApp } from './../util/api'
import DappDefaultIcon from './../assets/dapp-default-icon.svg'

export const loader = async ({ request, params }) => {
  return defer({})
}

function Play({ title }) {
  Title(title)
  const [isLoading, setIsLoading] = useState(true)
  const [app, setApp] = useState([])
  const [manager, setManager] = useState()
  const [like, setLike] = useState(0)
  const auth = useAuth()
  const navigate = useNavigate()
  const params = useParams()

  const fetchIPFS = async (CID) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_IPFS_GATEWAY}${CID}`)
      if (!response.ok) throw new Response('Failed to get data', { status: 500 })
      const json = await response.json()
      // console.log(json)
      return json
    } catch (error) {
      console.error(error)
    }
  }

  const getApp = async () => {
    let web3 = new Web3(import.meta.env.VITE_RPC_URL)
    const UpstoreContract = new web3.eth.Contract(ABI, import.meta.env.VITE_UPSTORE_CONTRACT_MAINNET)
    return await UpstoreContract.methods.getApp(params.appId).call()
  }

  const getLike = async () => {
    let web3 = new Web3(import.meta.env.VITE_RPC_URL)
    const UpstoreContract = new web3.eth.Contract(ABI, import.meta.env.VITE_UPSTORE_CONTRACT_MAINNET)
    return await UpstoreContract.methods.getLikeTotal(params.appId).call()
  }

  const handleLike = async () => {
    if (!auth.wallet) {
      toast.error(`Please connect Universal Profile`)
      return
    }

    const t = toast.loading(`Waiting for transaction's confirmation`)

    try {
      let web3 = new Web3(window.lukso)
      web3.eth.defaultAccount = auth.wallet
      const UpstoreContract = new web3.eth.Contract(ABI, import.meta.env.VITE_UPSTORE_CONTRACT_MAINNET)
      return await UpstoreContract.methods
        .setLike(params.appId)
        .send({ from: auth.wallet })
        .then((res) => {
          console.log(res)
          toast.dismiss(t)

          // Refetch the like total
          getLike().then((res) => {
            setLike(web3.utils.toNumber(res))
          })

          // Party
          party.confetti(document.querySelector(`.party-holder`), {
            count: party.variation.range(20, 40),
            shapes: ['star', 'roundedSquare'],
          })
        })
    } catch (error) {
      console.error(error)
      toast.dismiss(t)
    }
  }

  const playClick = () => {
    var audio = new Audio(clickSounds)
    audio.play()
  }

  useEffect(() => {}, [])

  return (
    <>
      <section className={`${styles.section} s-motion-slideUpIn`}>
        <div className={`${styles.hangbox}`}>
          <span>Euro Zone</span>
        </div>

        <div className={`__container`} data-width={`medium`}>
          <p className={`text-center`}>Pool Balance</p>
          <h1 className={`text-center`}>
            {(1400).toLocaleString()} <span>$LYX</span>
          </h1>

          <ul className={styles.countdown}>
            <li>7</li>
            <li>1</li>
            <li>2</li>
            <li>20</li>
          </ul>

          <button>Buy Ticket</button>
        </div>

        <ul className={`${styles.nav} d-flex`}>
          <li
            onClick={() => {
              playClick()
              navigate(`/`)
            }}
          />
          <li
            onClick={() => {
              playClick()
              navigate(`/pools`)
            }}
          />
          <li
            onClick={() => {
              playClick()
            }}
          />
          <li
            onClick={() => {
              playClick()
            }}
          />
          <li
            onClick={() => {
              playClick()
            }}
          />
           <li
            onClick={() => {
              playClick()
            }}
          />
        </ul>
      </section>
    </>
  )
}

export default Play
