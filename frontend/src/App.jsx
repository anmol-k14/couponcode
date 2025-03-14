import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [message, setMessage] = useState('');
    const [coupon, setCoupon] = useState(null);
    const claimCoupon = async () => {
        try {     
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/coupons/claim `,{},
              { withCredentials: true });
            setCoupon(response.data.coupon);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response ? error.response.data.message : 'An error occurred');
        }
    };

    return (
        <div className='main'>
            <div className="App">
            <h1>Round-Robin Coupon Distribution</h1>
            <button className='btn' onClick={claimCoupon}>Claim Coupon</button>
            <p>{message}</p>
            {coupon && <p>Your Coupon: {coupon}</p>}
        </div>
        </div>

    );
}

export default App;
