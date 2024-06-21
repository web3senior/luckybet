import { Suspense, useState, useEffect, useRef } from 'react'
import { useLoaderData, defer, Form, Await, useRouteError, Link, useNavigate } from 'react-router-dom'
import { Title } from './helper/DocumentTitle'
import MaterialIcon from './helper/MaterialIcon'
import Shimmer from './helper/Shimmer'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth, web3, _ } from './../contexts/AuthContext'
import Logo from './../../src/assets/logo.svg'
import Aratta from './../../src/assets/aratta.svg'
import Luckybet from './../../src/assets/luckybet.svg'
import Slogan from './../../src/assets/slogan.svg'
import WelcomeBox from './../../src/assets/welcome-box.png'
import Web3 from 'web3'
import ABI from '../abi/luckybet.json'
import party from 'party-js'
import DappDefaultIcon from './../assets/dapp-default-icon.svg'
import styles from './Home.module.scss'

party.resolvableShapes['UP'] = `<img src="http://localhost:5173/src/assets/up-logo.svg"/>`
party.resolvableShapes['Lukso'] = `<img src="http://localhost:5173/src/assets/lukso-logo.svg"/>`

const WhitelistFactoryAddr = web3.utils.padLeft(`0x2`, 64)

export const loader = async () => {
  return defer({ key: 'val' })
}

function Home({ title }) {
  Title(title)
  const [loaderData, setLoaderData] = useState(useLoaderData())
  const [isLoading, setIsLoading] = useState(true)
  const [app, setApp] = useState([])
  const [backApp, setBackupApp] = useState([])
  const [whitelist, setWhitelist] = useState()
  const [recentApp, setRecentApp] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const auth = useAuth()
  const navigate = useNavigate()
  const txtSearchRef = useRef()

  const addMe = async () => {
    const t = toast.loading(`Loading`)
    try {
      web3.eth.defaultAccount = auth.wallet

      const whitelistFactoryContract = new web3.eth.Contract(ABI, import.meta.env.VITE_WHITELISTFACTORY_CONTRACT_MAINNET, {
        from: auth.wallet,
      })
      console.log(whitelistFactoryContract.defaultChain, Date.now())
      await whitelistFactoryContract.methods
        .addUser(WhitelistFactoryAddr)
        .send()
        .then((res) => {
          console.log(res)
          toast.dismiss(t)
          toast.success(`You hav been added to the list.`)
          party.confetti(document.querySelector(`h4`), {
            count: party.variation.range(20, 40),
          })
        })
    } catch (error) {
      console.error(error)
      toast.dismiss(t)
    }
  }

  const addUserByManager = async () => {
    const t = toast.loading(`Loading`)
    try {
      web3.eth.defaultAccount = auth.wallet

      const whitelistFactoryContract = new web3.eth.Contract(ABI, import.meta.env.VITE_WHITELISTFACTORY_CONTRACT_MAINNET, {
        from: auth.wallet,
      })

      await whitelistFactoryContract.methods
        .addUserByManager(WhitelistFactoryAddr)
        .send()
        .then((res) => {
          console.log(res)
          toast.dismiss(t)
          toast.success(`You hav been added to the list.`)
          party.confetti(document.querySelector(`h4`), {
            count: party.variation.range(20, 40),
          })
        })
    } catch (error) {
      console.error(error)
      toast.dismiss(t)
    }
  }

  const updateWhitelist = async () => {
    web3.eth.defaultAccount = `0x188eeC07287D876a23565c3c568cbE0bb1984b83`

    const whitelistFactoryContract = new web3.eth.Contract('', `0xc407722d150c8a65e890096869f8015D90a89EfD`, {
      from: '0x188eeC07287D876a23565c3c568cbE0bb1984b83', // default from address
      gasPrice: '20000000000',
    })
    console.log(whitelistFactoryContract.defaultChain, Date.now())
    await whitelistFactoryContract.methods
      .updateWhitelist(web3.utils.utf8ToBytes(1), `q1q1q1q1`, false)
      .send()
      .then((res) => {
        console.log(res)
      })
  }

  const createWhitelist = async () => {
    console.log(auth.wallet)
    web3.eth.defaultAccount = auth.wallet

    const whitelistFactoryContract = new web3.eth.Contract(ABI, import.meta.env.VITE_WHITELISTFACTORY_CONTRACT_MAINNET)
    await whitelistFactoryContract.methods
      .addWhitelist(``, Date.now(), 1710102205873, `0x0D5C8B7cC12eD8486E1E0147CC0c3395739F138d`, [])
      .send({ from: auth.wallet })
      .then((res) => {
        console.log(res)
      })
  }

  const handleSearch = async () => {
    let dataFilter = app
    if (txtSearchRef.current.value !== '') {
      let filteredData = dataFilter.filter((item) => item.name.toLowerCase().includes(txtSearchRef.current.value.toLowerCase()))
      if (filteredData.length > 0) setApp(filteredData)
    } else setApp(backApp)
  }

  const fetchIPFS = async (CID) => {
    try {
      const response = await fetch(`https://api.universalprofile.cloud/ipfs/${CID}`)
      if (!response.ok) throw new Response('Failed to get data', { status: 500 })
      const json = await response.json()
      // console.log(json)
      return json
    } catch (error) {
      console.error(error)
    }

    return false
  }

  const getAppList = async () => {
    let web3 = new Web3(`https://rpc.lukso.gateway.fm`)
    web3.eth.defaultAccount = auth.wallet
    const UpstoreContract = new web3.eth.Contract(ABI, import.meta.env.VITE_UPSTORE_CONTRACT_MAINNET)
    return await UpstoreContract.methods.getAppList().call()
  }

  const getLike = async (appId) => {
    let web3 = new Web3(import.meta.env.VITE_RPC_URL)
    const UpstoreContract = new web3.eth.Contract(ABI, import.meta.env.VITE_UPSTORE_CONTRACT_MAINNET)
    return await UpstoreContract.methods.getLikeTotal(appId).call()
  }

  const handleRemoveRecentApp = async (e, appId) => {
    localStorage.setItem('appSeen', JSON.stringify(recentApp.filter((reduceItem) => reduceItem.appId !== appId)))

    // Refresh the recent app list
    getRecentApp().then((res) => {
      setRecentApp(res)
    })
  }

  const getRecentApp = async () => {
    return await JSON.parse(localStorage.getItem(`appSeen`))
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
      case 'about':
        setModalContent(`
Luckybet is an international blockchain-based lottery game operating on the LUSKO blockchain. It is a community-building activity and a gateway to demystifying blockchain development concepts.  Most importantly, it helps to foster broader adoption of blockchain-based applications to the general public.
<br/><b>Tokens</b><br/>
The initial token supporting the game is the LUKSO $LYX native token. Players will purchase tickets using this token. The prize pool jackpot will be paid out in $LYX tokens.
<br/><b>Features</b><br/>
The game features a user-friendly interface. Features include: <br/>
■ Challenge games<br/>
■ Private and public pools<br/>
■ Double prize games<br/>
■ Global Grand Prize games<br/>
<br/><b>Transparency</b><br/>
Luckybet offers transparency, security, and fairness possible through smart contracts and blockchain technology.<br/>

<b>Accessibility</b><br/>
By accepting crypto tokens for ticket purchases, Luckybet opens the market up for participation to anyone who holds crypto assets worldwide, regardless of geographic location or banking access. 

          `)
        break
      case 'guide':
        setModalContent(`
<b>How to Play</b><br/>

1. Click the “Connect Universal Profile” button. (Install here)<br/>
2. Click “Purchase Tickets” to enter a pool. (See the start & end dates of the pool)<br/>
3. Select the number of tickets from the pulldown menu.<br/>
4. Confirm the transaction. (You will get a message saying “Success”)<br/>
5. Select what region of the world you reside in from the pulldown menu. <br/>
6. Post the “Share link” that lets your friends know you entered the Luckybet game.<br/>
7. Check the “I agree to terms” box.<br/>
8. Then Tweet This Message:<br/>
“I have entered the Luckybet pool to win a jackpot of $LYX tokens
At: https://luckybet.pink/
“WISH ME LUCK!”
#LUKSO #LuckyBet #game #web3 #lottery #blockchain

<br/><b>Universal Profile Registration</b><br/>
 
All players must complete a Universal Profile on the LUKSO application. 
If you do not have a Universal Profile follow these steps<br/>

1. Complete profile here: https://universalprofile.cloud/?network=mainnet<br/>
2. You should see the extension titled "Universal Profile Browser Extension" by LUKSO Blockchain GmbH.<br/>
3. Click on the "Add to Chrome" button.<br/>
4. A confirmation window will appear. Click on "Add extension" to confirm the installation.<br/>
5. After completing, connect your profile to the Luckybet application at: https://luckybet.pink/<br/>
          `)
        break
      default:
        setModalContent(`Unknown`)
        break
    }
  }

  useEffect(() => {
    // getAppList().then(async (res) => {
    //   const responses = await Promise.all(res[0].map(async (item) => Object.assign(await fetchIPFS(item.metadata), item, { like: web3.utils.toNumber(await getLike(item.id)) })))
    //   setApp(responses.filter((item) => item.status))
    //   setBackupApp(responses)
    //   setIsLoading(false)
    // })
    // getRecentApp().then((res) => {
    //   setRecentApp(res)
    // })
  }, [])

  return (
    <>
      <section className={styles.section}>
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

        <div className={`${styles['logo']} d-flex flex-row align-items-center justify-content-between`}>
          <figure className={`d-flex flex-row align-items-center justify-content-center`}>
            <img alt={`Lukso`} src={Logo} />
          </figure>
          <figure>
            <img alt={`Lukso`} src={Luckybet} />
            <img alt={`Lukso`} src={Slogan} />
          </figure>
        </div>

        <div className={`__container h-inherit d-flex flex-column align-items-center justify-content-center`} data-width={`large`}>
          <figure className={`mb-10`}>
            <img src={WelcomeBox}/>
          </figure>
          
          <nav className={`d-flex flex-column align-items-center justify-content-center`}>
            <button onClick={() => navigate(`/pools`)}>Pools</button>
            <button onClick={() => handleShowModal('rules')}>Rules</button>
            <button onClick={() => handleShowModal('guide')}>Guide</button>
            {/* <button onClick={() => window.open(`https://explorer.execution.testnet.lukso.network/address/${import.meta.env.VITE_LUCKYBET_CONTRACT_TESTNET}`)}>Contract</button> */}
            <button onClick={() => handleShowModal('about')}>About</button>
          </nav>

          <Link to={`//aratta.dev`} target={`_blank`}>
            <figure>
              <img alt={import.meta.env.VITE_AUTHOR} src={Aratta} />
            </figure>
          </Link>
        </div>
      </section>
    </>
  )
}

export default Home
