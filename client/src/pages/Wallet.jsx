import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const Wallet = ({ saveState }) => {
    const navigateTo = useNavigate();
    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts"
                })
                const state = {
                    account: accounts[0]
                };
                // Store the state in sessionStorage
                sessionStorage.setItem('address', JSON.stringify(accounts[0]));

                saveState(state);
                navigateTo("/view");
                saveState({ account: accounts[0] })
                navigateTo("/view")
            } else {
                throw new Error
            }
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <>
            <div className='h-20 bg-blue-500 text-white'>
                <div >
                    <div className=" flex text-lg p-5">
                        <span>WELCOME TO</span> <p>Project3.0</p>
                    </div>
                    <div className="m-20 flex items-center justify-center">
                        <p className='text-black m-5'> Please connect metamask wallet to access the app </p>
                        <button className='p-5 rounded-xl text-white bg-blue-500' onClick={connectWallet}>Connect Wallet</button>
                    </div>
                </div>
            </div>
        </>
    );
}
Wallet.propTypes = {
    saveState: PropTypes.func.isRequired,
};

export default Wallet;