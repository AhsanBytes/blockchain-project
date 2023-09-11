import { useState } from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Wallet from './pages/Wallet';
import View from './pages/view';
import './index.css';

function App() {
  const [state, setState] = useState({web3:null, contract: null, account:null})

  const saveState = ({web3,contract,account}) => {
    setState({web3: web3, contract: contract, account: account})
  }


  const router = createBrowserRouter(
    [
      {path: '/', element: <Wallet saveState = {saveState}/>},
      {path: '/view', element: <View state = {state}/>}
    ]
  )

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
