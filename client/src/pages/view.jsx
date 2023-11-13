import { useState, useEffect } from "react";
import axios from 'axios';
import Stripe from "react-stripe-checkout";

const View = () => {
    const address = sessionStorage.getItem('address');
    const tempaddress = JSON.parse(address);

    const [Name, setName] = useState('');
    const [ID, setID] = useState(null);
    const [TokenName, setTokenName] = useState('');
    const [Description, setDescription] = useState('');
    const [Balance, setBalance] = useState(null);
    const [EditName, setEditName] = useState('');
    const [EditID, setEditID] = useState(null);
    const [EditTokenName, setEditTokenName] = useState('');
    const [EditDescription, setEditDescription] = useState('');
    const [EditBalance, setEditBalance] = useState(null);
    const storedState = sessionStorage.getItem('address');
    const [walletbalance, setWalletBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pkiUnits, setPKIUnits] = useState(0);
    const [processing, setprocessing] = useState(false);


    const handleNameChange = (event) => {
        const newValue = event.target.value;
        setEditName(newValue);
        console.log(EditName);
    };

    const handleBalanceChange = (event) => {
        const newValue = event.target.value;
        setEditBalance(newValue);
        console.log(EditBalance);

    };
    const handleIDChange = (event) => {
        const newValue = event.target.value;
        setEditID(newValue);
        console.log(EditID);
    };

    const handleDescriptionChange = (event) => {
        const newValue = event.target.value;
        setEditDescription(newValue);
        console.log(EditDescription);
    };

    const handleTokenNameChange = (event) => {
        const newValue = event.target.value;
        setEditTokenName(newValue);
        console.log(EditTokenName);
    };

    const sendNewNameToBackend = async () => {
        try {
            setLoading(true);
            if (address) {
                const response = await axios.post('http://localhost:3000/api/update-name', {
                    newName: EditName,
                    userAddress: address,
                });
                console.log(response.data)

                if (response.data && response.data.transaction) {
                    // The backend has generated the transaction, send it to MetaMask for signing.
                    const { transaction } = response.data;
                    await signAndSendTransaction(transaction);
                } else {
                    console.error('Failed to get transaction from the backend.');
                }
            } else {
                console.error('No Ethereum accounts available.');
            }
        } catch (error) {
            console.error('Error sending new name to the backend:', error);
        }
        finally {
            setLoading(false);
        }
    };

    async function ensurePolygonMumbaiNetwork() {
        try {
            // Check if MetaMask is installed
            if (window.ethereum && window.ethereum.isMetaMask) {
                // Check the network ID using the "net_version" method
                const networkId = await window.ethereum.request({
                    method: 'net_version',
                });

                if (networkId === '80001') {
                    // User is already on Polygon Mumbai network
                    console.log('Connected to Polygon Mumbai network.');
                } else {
                    // Ask the user to switch to Polygon Mumbai
                    const switchConfirmed = window.confirm('Switch to Polygon Mumbai network in MetaMask?');

                    if (switchConfirmed) {
                        // Use "wallet_switchEthereumChain" to switch networks
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x13881' }],
                        });
                    } else {
                        console.log('User declined to switch to Polygon Mumbai network.');
                    }
                }
            } else {
                console.log('MetaMask is not installed.');
            }
        } catch (error) {
            console.error('Error while switching networks:', error);
        }
    }

    useEffect(() => {
        // Ensure the user is on the Polygon Mumbai network
        ensurePolygonMumbaiNetwork();
    }, []);

    const signAndSendTransaction = async (transaction) => {
        try {
            await ensurePolygonMumbaiNetwork();
            ethereum
                .request({
                    method: 'eth_sendTransaction',
                    params: [transaction],
                })
                .then((txHash) => console.log(txHash))
                .catch((error) => console.error(error));
        } catch (error) {
            console.error('Error in signAndSendTransaction:', error);
        }
    };

    const UpdateId = () => { console.log("Only Update Name Function is Functional") }

    const Updatebalance = () => { console.log("Only Update Name Function is Functional") }

    const UpdateTokenName = async () => { console.log("Only Update Name Function is Functional") }

    const UpdateDescription = async () => { console.log("Only Update Name Function is Functional") }

    const fetchName = async () => {
        try {
            if (storedState) {
                const state = JSON.parse(storedState);
                // Include state.account as a query parameter
                const response = await axios.get('http://localhost:3000/api/get_Name');

                setName(response.data[0].Name);
                console.log(Name);

            } else {
                console.error('No stored state found in sessionStorage');
            }
        } catch (error) {
            // Handle any errors here
            console.error('Error:', error);
        }
    };

    const fetchId = async () => {
        try {
            if (storedState) {
                const state = JSON.parse(storedState);

                // Include state.account as a query parameter
                const response = await axios.get('http://localhost:3000/api/get_ID');
                setID(response.data[0].ID);
                console.log(ID);

            } else {
                console.error('No stored state found in sessionStorage');
            }
        } catch (error) {
            // Handle any errors here
            console.error('Error:', error);
        }
    };

    const fetchTokenName = async () => {
        try {
            if (storedState) {
                const state = JSON.parse(storedState);

                // Include state.account as a query parameter
                const response = await axios.get('http://localhost:3000/api/get_TokenName');
                setTokenName(response.data[0].TokenName);
                console.log(TokenName);

            } else {
                console.error('No stored state found in sessionStorage');
            }
        } catch (error) {
            // Handle any errors here
            console.error('Error:', error);
        }
    };

    const fetchbalance = async () => {
        try {
            if (storedState) {
                const state = JSON.parse(storedState);

                // Include state.account as a query parameter
                const response = await axios.get('http://localhost:3000/api/get_balance');

                setBalance(response.data[0].balance);
                console.log(Balance);
            } else {
                console.error('No stored state found in sessionStorage');
            }
        } catch (error) {
            // Handle any errors here
            console.error('Error:', error);
        }
    };

    const fetchDescription = async () => {
        try {
            if (storedState) {
                const state = JSON.parse(storedState);

                // Include state.account as a query parameter
                const response = await axios.get('http://localhost:3000/api/get_Desc');

                setDescription(response.data[0].Description);
                console.log(Description);
            } else {
                console.error('No stored state found in sessionStorage');
            }
        } catch (error) {
            // Handle any errors here
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        async function checkWalletConnection() {
            if (typeof window.ethereum !== 'undefined') {
                // Wallet is connected
                // You can access the user's address with window.ethereum.selectedAddress
                console.log('Wallet is connected. User address:', window.ethereum.selectedAddress);
            } else {
                // Wallet is not connected
                console.log('Wallet is not connected.');
            }
        }

        checkWalletConnection();
    }, []);

    const fetchWalletBalance = async () => {
        try {
            if (tempaddress) {
                const response = await axios.post('http://localhost:3000/api/get_wallet_balance', {
                    Address: tempaddress,
                });
                const { balance } = response.data;
    
                // Only update state if the value has changed
                if (balance !== walletbalance) {
                    setWalletBalance(balance);
                }
            }
        } catch (error) {
            console.error("Error loading wallet balance: ", error);
        }
    };
    
    useEffect(() => {
        // Call the function to get wallet balance initially
        fetchWalletBalance();
    
        // Set an interval to periodically check the balance (e.g., every 30 seconds)
        let balanceCheckInterval;
    
        if (tempaddress) {
            balanceCheckInterval = setInterval(() => {
                fetchWalletBalance();
            }, 30000);
        }
    
        // Ensure to clear the interval when your component unmounts
        return () => {
            clearInterval(balanceCheckInterval);
        };
    }, [tempaddress, walletbalance]); // Dependency array ensures the effect runs when tempaddress or walletBalance change    

    const tokenHandler = (token) => {
        handleToken(100, token); // Change 100 to the actual amount
    };

    const handleToken = async (totalAmount, token) => {
        try {
            if (tempaddress) {
                setprocessing(true);

                // Send a single POST request to handle both Stripe payment and PKIUnits update
                const response = await axios.post("http://localhost:3000/api/stripe/pay", {
                    token: token.id,
                    amount: totalAmount,
                    address: tempaddress
                });

                setprocessing(false);

                if (response.data.success) {
                    // Payment and PKIUnits update successful
                    console.log("Payment and PKIUnits update successful!");
                    getPKIUnits(); // Refresh PKIUnits after successful update
                } else {
                    // Payment or update failed
                    console.error("Payment or PKIUnits update failed");
                }
            }
        } catch (error) {
            console.log(error);
            setprocessing(false);
        }
    };

    useEffect(() => {
        // Function to get PKIUnits
        const fetchPKIUnits = async () => {
            if (tempaddress) {
                try {
                    const response = await axios.post('http://localhost:3000/api/get_PKIUnits', {
                        Address: tempaddress,
                    });
                    const { getpki } = response.data;

                    // Only update state if the value has changed
                    if (getpki !== pkiUnits) {
                        setPKIUnits(getpki);
                    }
                } catch (error) {
                    console.error("Error loading pkiunits balance: ", error);
                }
            }
        };

        // Call the function to get PKIUnits initially
        fetchPKIUnits();

        // Set an interval to periodically check the pkiunits (e.g., every 30 seconds)
        const pkiunitsCheckInterval = setInterval(() => {
            fetchPKIUnits();
        }, 30000);

        // Ensure to clear the interval when your component unmounts
        return () => {
            clearInterval(pkiunitsCheckInterval);
        };
    }, [tempaddress, pkiUnits]); // Dependency array ensures the effect runs when tempaddress or pkiUnits change


    return (
        <>
            <div className="h-20 bg-blue-500 rounded-b-xl items-center flex flex-col justify-center">
                <h1 className="text-white">Blockchain App</h1>
                <h1 className="text-white text-center">Wallet Address: {tempaddress}</h1>
                <h1 className="text-white text-center">Balance: {walletbalance} MATICS</h1>
                <div className="absolute top-0 right-0 mt-2.5 mr-20 text-white flex flex-col items-end">
                    <div className="mb-2">PKIUnits: {pkiUnits} PKI</div>
                    <Stripe
                        stripeKey="pk_test_51OBe5OBaR9sAqK9kanzio0mACH0yLibTzYfb5B5VY5pIqFslShcpBAmlbAR4KJti6SMP6o6vqJpVXdaaW2aC1cwZ00P0KJ46CP"
                        token={tokenHandler}
                    >
                        <button className={`bg-green-500 text-white py-1 px-2 rounded ${processing ? 'cursor-not-allowed opacity-50' : ''}`}>
                            {processing ? 'Processing...' : 'Add PKIUnits'}
                        </button>
                    </Stripe>
                </div>
            </div>

            <div className="flex items-center justify-center md:m-20 bg-slate-100 p-10 rounded-xl">

                <div className="w-40">
                    <button className="p-2 h-14 text-white bg-blue-400 rounded-xl m-2" onClick={fetchId}> Get ID: </button>
                    <button className="p-2  h-14  text-white bg-blue-400 rounded-xl m-2" onClick={fetchName}>Get Name: </button>
                    <button className="p-2  h-14  text-white bg-blue-400 rounded-xl m-2" onClick={fetchbalance}>Get Balance: </button>
                    <button className="p-2  h-14  text-white bg-blue-400 rounded-xl m-2" onClick={fetchTokenName}>Get Token Name: </button>
                    <button className="p-2  h-14  text-white bg-blue-400 rounded-xl m-2" onClick={fetchDescription}>Get Description: </button>
                </div>
                <div className="w-80  items-center">
                    <h1 className="p-2 flex justify-center font-bold items-center   h-14  text-blue-800 m-2"  ><span>   {ID}          </span>   </h1>
                    <h1 className="p-2 flex justify-center font-bold items-center h-14 text-blue-800 m-2"  >    <span>   {Name}        </span>   </h1>
                    <h1 className="p-2 flex justify-center font-bold m-4 items-center h-14 text-blue-800 "  >   <span>   {Balance}     </span>   </h1>
                    <h1 className="p-2 flex justify-center font-bold items-center h-14 text-blue-800 m-2"  >    <span>   {TokenName}   </span>   </h1>
                    <h1 className="p-2 flex justify-center font-bold items-center h-14 text-blue-800 m-2"  >    <span>   {Description} </span>   </h1>

                </div>
                <div className="w-40">
                    <button className="p-2 h-14 text-white bg-blue-400 rounded-xl m-2" onClick={UpdateId}> Edit ID: </button>
                    <button className="p-2  h-14  text-white bg-blue-400 rounded-xl m-2" onClick={sendNewNameToBackend}> Edit  Name: </button>
                    <button className="p-2  h-14  text-white bg-blue-400 rounded-xl m-2" onClick={Updatebalance}> Edit  Balance: </button>
                    <button className="p-2  h-14  text-white bg-blue-400 rounded-xl m-2" onClick={UpdateTokenName}> Edit  Token Name: </button>
                    <button className="p-2  h-14  text-white bg-blue-400 rounded-xl m-2" onClick={UpdateDescription}> Edit  Description: </button>
                </div>
                <div className="w-80  items-center">
                    <div className="p-2 flex justify-center font-bold items-center   h-14  text-blue-800 m-2"  > <input type='text' onInput={handleIDChange} className="border-2 p-2" />        </div>
                    <div className="p-2 flex justify-center font-bold items-center h-14 text-blue-800 m-2"  >    <input type='text' onInput={handleNameChange} className="border-2 p-2" />       </div>
                    <div className="p-2 flex justify-center font-bold m-4 items-center h-14 text-blue-800 "  >   <input type='text' onInput={handleBalanceChange} className="border-2 p-2" />       </div>
                    <div className="p-2 flex justify-center font-bold items-center h-14 text-blue-800 m-2"  >    <input type='text' onInput={handleTokenNameChange} className="border-2 p-2" />       </div>
                    <div className="p-2 flex justify-center font-bold items-center h-14 text-blue-800 m-2"  >    <input type='text' onInput={handleDescriptionChange} className="border-2 p-2" />       </div>

                </div>

            </div >
            {loading && (
                <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-70 z-50">
                    <div className="text-white p-4 bg-blue-400 rounded-lg">
                        Sending MATIC and Processing Transaction...
                    </div>
                </div>
            )}
        </>
    );
};

export default View;
