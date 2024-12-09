import React from 'react';
import Image from 'react-bootstrap/esm/Image';
import { Link } from 'react-router-dom';
import FooterNav from './FooterNav';

const Footer = () => {
    return ( 
      <div className="blue-bg w-100">
        <FooterNav />

        <picture>
          {/* Image for mobile devices */}
          <source media="(max-width: 768px)" srcSet="/assets/streaks-bottom-mobile.png" />

          {/* Image for tablets */}
          <source media="(max-width: 992px)" srcSet="/assets/streaks-bottom-mobile.png" />

          {/* Image for desktop */}
          <source media="(min-width: 993px)" srcSet="/assets/streaks-bottom.png" />

          {/* Fallback image in case browser doesn't support <picture> */}
          <Image src="/assets/streaks-bottom.png" alt="streaks" fluid />
        </picture>
        
        {/* <Image src="/assets/streaks-bottom.png" alt="streaks" fluid></Image> */} 
            
        <div style={{ backgroundColor: 'white', color: '#000000' }} className='d-flex'>
          <div className='col text-start p-3'>
            &copy; {new Date().getFullYear()} Copyright:{' SYRNYK '}
          </div>
          <div className='col text-end p-3'>
            <Link className='' to='' style={{ color: '#000000' }}> 
              Created by YKStudio
            </Link>
          </div>
        </div>
      </div>
    );
}
 
export default Footer;