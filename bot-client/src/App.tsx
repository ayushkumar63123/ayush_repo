import { useState, useEffect } from 'react'
import reportWebVitals from "./reportWebVitals";
import { MoralisProvider } from "react-moralis";
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import { injected } from './constants'
import { TableHeader } from './data'
import React from "react";
import ReactDOM from "react-dom";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField  } from '@mui/material'
import styled from 'styled-components'
import { useMoralisWeb3Api } from "react-moralis";

const StyledFormWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2vw;
  margin: 5vh auto 5vh;
  width: fixed;
  @media (max-width: 480px ){
    display: flex;
    flex-direction: column;
    margin: 2vh auto 2vh auto; 
    gap: 2vw;
    width: 50vw;
    height: 10vh;
}
`

const StyledButton = styled(Button)`
  position: relative;
  @media (max-width: 480px){
    position: relative;
    position: relative;
    width: 50vw;
    height: 10vh;
    margin: auto auto;
  }
`

const TableWrapper = styled.div`

  @media (max-width: 480px){
    position: relative;
    overflow-y: scroll;
    width: 50vw;
    margin: 10vh auto;
    height: 50vh;
  }
`

function App() {

  const { active, account, activate, deactivate } = useWeb3React()
  const [address, setAddress] = useState<string>('0x08E4fFf4094ba6b6C5C1C94a386266f56aEd7838')
  const [bnbPrice, setBnbPrice] = useState()
  const [ bnbBalance, setBnbBalance ] = useState<any>()
  useEffect(() => {
    // GET request using fetch inside useEffect React hook
    fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT', {cache: "force-cache"})
        .then(response => response.json())
        .then(fetchData => setBnbPrice(fetchData));
  
  // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);
 
  //@ts-ignore
  const web3 = new Web3(Web3.givenProvider)  


  const startBalance = async () => {
    if(active){
      try {
        //@ts-ignore
        const balance = await web3.eth.getBalance(account)
        return web3.utils.fromWei(balance) 
      } catch (error) {
        console.log(error)
      }
    }else if(address !== undefined){
      try {
      const balance = await web3.eth.getBalance(address)
      return web3.utils.fromWei(balance)         
      } catch (error) {
        console.log(error)
      }}else{
      return 0
    } 
  }
/* ReactDOM.render(
    <React.StrictMode>
      <MoralisProvider serverUrl="https://oep7vweflow4.usemoralis.com:2053/server" appId="KoInqYoqaBSjkU7E6an3IGi0ZXGRnGrPn6npnZ9u">
        <App />
      </MoralisProvider>
      <h1>Hello World</h1>
    </React.StrictMode>,
    document.getElementById("root")
  );*/
  const Web3Api = useMoralisWeb3Api();
  const tokenBalance = async () => {
    if(active){
      try {
        //@ts-ignore
        var options = {
          chain: "bsc",
          address: "0x541529659Cb2F2EfBf5AA6A8e3Bbf695d16a3AeF",
          to_block: '10253391'
        }
        const data = await Web3Api.account.getTokenBalances(options)
        return data
      } catch(error) {
        console.log(error)
      }} else if(address !== undefined) {
        try {
          var options1 = {
            chain: "bsc",
            address: "0x541529659Cb2F2EfBf5AA6A8e3Bbf695d16a3AeF",
            to_block: '10253391'
          }
          const data = await Web3Api.account.getTokenBalances(options1)
          console.log(data)
      } catch(error) {
        console.log(error)
      }} else {
        return 0
      }
    }

   /* const button1 = <button>Hello</button>
    ReactDOM.render(
      button1, document.getElementById('root')
    )*/
  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  startBalance().then((res) => { setBnbBalance(res) })

  const handleChange = async (e: any) => {
    const { value } = e.target
    const newValue = value
    await setAddress(newValue);
  }

  const TableContent = {
      Volume: 0,
      VolumeInBSC: 0,
      percentage: 0,
      Trades: 0,
      Arbitrage: 0,
      BSCFees: 0,
      CakeFees: 0,
      LProvider: 0,
      BotFee: 0,
      //@ts-ignore
      StartBalance: `$${(Number(bnbBalance) * Number(bnbPrice?.price))}`,
      endBalance: 0,
      grossProfit: 0
  }

  const getBalance = async () => {
    const balance = await web3.eth.getBalance(address)
    return balance;
  }
  //@ts-ignore
  return (<>
      <StyledFormWrapper>
        {active ? 
        <StyledButton size="small" variant="contained" onClick={disconnect}>
          {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
        </StyledButton>
        
        :

        <StyledButton size="small" variant="contained" disabled={active} onClick={connect}>
          Connect to metamask
        </StyledButton>        
      }
      
      <StyledButton size="small" variant="contained" disabled={active} onClick={tokenBalance}>
          TestButton
        </StyledButton>  
          <span>or</span>
          <TextField onChange={handleChange} name="address"  variant="outlined" placeholder='Paste address' />
      </StyledFormWrapper>
      <TableWrapper>
        <Table>
            <TableHead>
            <TableRow >
              {TableHeader?.map((data: any, i: any) => {
                return <TableCell key={i}>{data}</TableCell>
              })}
            </TableRow>            
            </TableHead>
            <TableBody>
            <TableRow >
              {Object.values(TableContent).map((data: any, i: any) => {
                return <TableCell key={i}>{data}</TableCell>
              })}
            </TableRow>
            </TableBody>
        </Table>
      </TableWrapper>
      </>);
}

export default App;
