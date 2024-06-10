import { useEffect, useRef, useState } from 'react'
import { useNavigate, defer, useParams } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import MaterialIcon from './helper/MaterialIcon'
import Shimmer from './helper/Shimmer'
import Loading from './components/LoadingSpinner'
import { CheckIcon, ChromeIcon, BraveIcon } from './components/icons'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, web3, _, contract } from '../contexts/AuthContext'
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
  const [contractBalance, setContractBalance] = useState(0)
  const [playerCount, setPlayercount] = useState(0)
  const [manager, setManager] = useState()
  const [like, setLike] = useState(0)
  const auth = useAuth()
  const navigate = useNavigate()
  const params = useParams()
  const [pools, setPools] = useState([])
  const [showModal, setShowModal] = useState(false)
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

  const handleBuyTicket = async () => {
    auth.connectWallet()

    const t = toast.loading(`Waiting for transaction's confirmation`)

    let count = document.querySelector(`[name='count']`).value

    try {
      return await contract.methods
        .play('0x0000000000000000000000000000000000000000000000000000000000000001',count)
        .send({ from: auth.wallet ,value: _.toWei(count, 'ether'),})
        .then((res) => {
          console.log(res)
          toast.dismiss(t)

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

  const handleWithdraw = async () => {
    auth.connectWallet()

    const t = toast.loading(`Waiting for transaction's confirmation`)

    try {
      return await contract.methods
        .withdraw()
        .send({ from: auth.wallet })
        .then((res) => {
          console.log(res)
          toast.dismiss(t)
        })
    } catch (error) {
      console.error(error)
      toast.dismiss(t)
    }
  }

  const playClick = () => {
    let audio = new Audio(clickSounds)
    audio.play()
    if ('vibrate' in navigator) {
      navigator.vibrate(200)
    }
  }

  const getPoolList = async () =>  await contract.methods.pool(0).call()

  const getNow = async () =>  await contract.methods.getNow().call()
  const getPlayerCount = async () =>  await contract.methods.getTotalPlayer().call()

  const getContractBalance = async () =>  await contract.methods.getBalance().call()

  const countDown = (calcTime) => {
    // Set the date we're counting down to
    var countDownDate = calcTime

    // Update the count down every 1 second
    var x = setInterval(function () {
      // Get today's date and time
      var now = new Date().getTime()

      // Find the distance between now and the count down date
      var distance = countDownDate - now

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24))
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      var seconds = Math.floor((distance % (1000 * 60)) / 1000)

      // Output the result in an element with id="demo"
      document.querySelectorAll('#date li')[0].innerHTML = days
      document.querySelectorAll('#date li')[1].innerHTML = hours
      document.querySelectorAll('#date li')[2].innerHTML = minutes
      document.querySelectorAll('#date li')[3].innerHTML = seconds

      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval(x)
        document.getElementById('demo').innerHTML = 'EXPIRED'
      }
    }, 1000)
  }

  const handleShowModal = (action) => {
    setShowModal((showModal) => !showModal)
    switch (action) {
      case 'rules':
        setModalContent(`
<ul>
	<li>You must be 18 years of age to play</li>
	<li>$LYX tokens must be used to enter</li>
	<li>All players must click the &ldquo;I agree with the terms of this game box&rdquo;</li>
	<li>Games operate on a 7-day cycle unless specified</li>
	<li>All Jackpots will automatically be paid to each winner&rsquo;s wallet through the verified Luckybet smart contract on LUKSO</li>
	<li>You must agree to the terms by clicking the &ldquo;I Agree Terms Box&rdquo;</li>
</ul>

          `)
        break
      default:
        setModalContent(`Unknown`)
        break
    }
  }

  useEffect(() => {
    getPoolList().then(async (res) => {
      console.log(res)
      setPools([res])
      setIsLoading(false)

      var distance = _.toNumber(res.endTime) * 1000
      countDown(distance)
    })

    getContractBalance().then((res) => {
      console.log(res)
      setContractBalance(_.fromWei(res, 'ether'))
    })

    getPlayerCount().then((res) => {
      console.log(res)
    setPlayercount(_.toNumber(res))
    })
  }, [])

  return (
    <>
           {showModal && (
          <>
            <div className={styles.modal}>
              <div className={styles.modal__content}>
                <span onMouseDown={() => setShowModal(!showModal)} />
                <div dangerouslySetInnerHTML={{__html: modalContent}} />
              </div>
            </div>
          </>
        )}
   {isLoading && <Loading/>}
      <section className={`${styles.section} s-motion-slideUpIn`}>
        <div className={`${styles.hangbox}`}>
          <span>{pools && pools.length > 0 && pools[0].metadata}</span>
        </div>

        <div className={`__container d-flex flex-column`} data-width={`medium`}>
          <p className={`text-center`}>Pool Balance</p>
          <h1 className={`text-center`}>
            {contractBalance.toLocaleString()} <span>$LYX</span>
          </h1>
          <p className={`text-center`}>Player Count</p>
          <h1 className={`text-center`}>
            {playerCount.toLocaleString()}
          </h1>
          <ul id={`date`} className={styles.countdown} style={{width: '80vw', maxWidth:'400px'}}>
            <li>-</li>
            <li>-</li>
            <li>-</li>
            <li>-</li>
          </ul>

          <select name={`count`} style={{width: '40vw', maxWidth:'400px', margin: '0 auto', marginTop:'1rem'}}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <button onClick={()=>handleBuyTicket()}>Buy Ticket</button>
          <span className='party-holder'></span>
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
          {/* <li
            onClick={() => {
              playClick()
            }}
          /> */}
        </ul>
      </section>
    </>
  )
}

export default Play
