import Head from 'next/head'
import Link from "next/link"
import { Middleware } from 'next/dist/lib/load-custom-routes'
import MenuBar from '../componenets/menubar'
import style from '../styles/homepage.module.css'
import Image from 'next/image'
import unitlogo from '../img/unitlogo.png'

const Home = () => {
    return <>
        <Head>
            <title>홈페이지</title>
        </Head>
        <div className = {style.leftbar}>
            <div className = {style.user}>
                <div style = {{margin: 'auto', width: '180px', height: '180px'}}><Image style={{marginTop: '20px'}} width = {180} height = {180} src="https://camo.githubusercontent.com/3c2bd3f35721dc332ebf2b11ace89722c37a0f60b94eac42b2a0462fdeb2d420/68747470733a2f2f63646e2d69636f6e732d706e672e666c617469636f6e2e636f6d2f3531322f363134322f363134323232362e706e67"/></div>
                
            </div>
            <div className = {style.unit}>
                <div className = {style.orgunit}>소속부대</div>
                <div style = {{marginTop: '10px', marginLeft: '20px'}}><Image width = {180} height = {220} src={unitlogo.src}/></div>
                <div>
                <p className = {style.unitmotto}>충성, 명예, 단결 <br></br> 살아방패 죽어충성</p>

                </div>
                
            </div>
        </div>
        <div className = {style.mainarea}>
        <div style = {{marginTop: '10px', width: '160px', margin: 'auto'}}>
                    <span className={style.rank}>대위</span> <span className={style.name}>OOO</span> <br/>
                    <span className={style.role}>정보통신운용장교</span>
                </div>
        </div>


        
    </>
}

//export async function getServerSideProps() {
    // Fetch data from external API
    //const res = await fetch(`https://.../data`)
    //const data = await res.json()
  
    // Pass data to the page via props
   // return { props:  'data' }
  //}

export default Home; 
