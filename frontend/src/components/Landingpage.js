import React from 'react'
import food from '../images/food.png';
import './Landingpage.css'
function Landingpage() {
  return (
    <div>

        <div className="bg"></div>
        <div className="msgandimg">
       <div className="welcomemsg"><div className="mainmsg">Welcome to Thindi!!!</div>
        <div className="submsg">Scan QR to get your food</div>
        <div className="button">Vendor Login</div>
       </div>
       <img src={food} alt="foodimage" className="foodimage" />
       </div>
    </div>
  )
}

export default Landingpage

