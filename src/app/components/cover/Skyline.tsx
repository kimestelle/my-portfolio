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
      </div>
  );
}

export default Skyline;
