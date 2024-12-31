import { useState, useRef } from 'react';
import './Skyline.css';

import City from './city';

function Skyline() {

  return (
      <div className="center-bar"
      onContextMenu={(e) => e.preventDefault()}>
        <div className="city-container">
          <City/>
        </div>
        {/* <p className='guide-text'>I wonder what happens when you press and hold...</p> */}
      </div>
  );
}

export default Skyline;
