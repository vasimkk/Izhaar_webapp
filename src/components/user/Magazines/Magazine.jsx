import React, { useState, useRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import './Magazine.css';

// Importing assets
import M11 from '../../../assets/magazine-samples/M1/M11.png';
import M12 from '../../../assets/magazine-samples/M1/M12.png';
import M13 from '../../../assets/magazine-samples/M1/M13.png';
import M14 from '../../../assets/magazine-samples/M1/M14.png';
import M15 from '../../../assets/magazine-samples/M1/M15.png';
import M16 from '../../../assets/magazine-samples/M1/M16.png';
import M17 from '../../../assets/magazine-samples/M1/M17.png';

import M21 from '../../../assets/magazine-samples/M2/M21.png';
import M22 from '../../../assets/magazine-samples/M2/M22.png';
import M23 from '../../../assets/magazine-samples/M2/M23.png';
import M24 from '../../../assets/magazine-samples/M2/M24.png';
import M25 from '../../../assets/magazine-samples/M2/M25.png';
import M26 from '../../../assets/magazine-samples/M2/M26.png';
import M27 from '../../../assets/magazine-samples/M2/M27.png';

import M31 from '../../../assets/magazine-samples/M3/M31.png';
import M32 from '../../../assets/magazine-samples/M3/M32.png';
import M33 from '../../../assets/magazine-samples/M3/M33.png';
import M34 from '../../../assets/magazine-samples/M3/M34.png';
import M35 from '../../../assets/magazine-samples/M3/M35.png';
import M36 from '../../../assets/magazine-samples/M3/M36.png';
import M37 from '../../../assets/magazine-samples/M3/M37.png';

// Updated styles for flipbook pages
const MagazinePage = React.forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref} style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      padding: '20px',
      width: '100%',
      maxWidth: '550px',
    }}>
      <div className="page-content" style={{
        position: 'relative',
        textAlign: 'center',
      }}>
        <img src={props.image} alt={`Page ${props.number}`} className="page-image" style={{
          width: '100%',
          height: 'auto',
          borderRadius: '10px',
        }} />
        <div className="page-text" style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          right: '10px',
          color: '#333',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          fontSize: '12px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>{props.title}</h3>
          <p style={{ fontSize: '12px' }}>{props.caption}</p>
        </div>
      </div>
    </div>
  );
});

const Magazine = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedMag, setSelectedMag] = useState(null);
  const flipBook = useRef(null);

  const magazines = {
    1: [M11, M12 ,M13 ,M14 ,M15 ,M16,M17],
    2: [M21, M22, M23 ,M24 ,M25 ,M26 ,M27],
    3:[M31 ,M32 ,M33 ,M34 ,M35 ,M36 ,M37],
  };

  const magazineSamples = [
    { id: 1, title: 'Twisted Into Love', cover: M11, date: 'Wedding Edition 2024' },
    { id: 2, title: 'Together Always', cover: M21, date: 'Travel & Love 2024' },
    { id: 3, title: 'lOVE', cover: M31, date: 'lOVE' },

  ];

  const onPage = useCallback((e) => {
    setCurrentPage(e.data);
  }, []);

  const nextButtonClick = () => {
    flipBook.current.pageFlip().flipNext();
  };

  const prevButtonClick = () => {
    flipBook.current.pageFlip().flipPrev();
  };

  const handleOpenMagazine = (mag) => {
    setSelectedMag(mag);
    setIsOpen(true);
    setCurrentPage(0);
  };

  return (
    <div className="magazine-container"  style={{
          background: 'linear-gradient(135deg, #fff0e8 0%, #ffe8f5 25%, #f0f5ff 50%, #f5e8ff 75%, #e8f0ff 100%)',
          animation: 'gradientShift 15s ease infinite'
        }}>
      <div className="magazine-header" >
        <h1>Izhaar Magazine Samples</h1>
        <p>Premium custom-designed magazines that turned your beautiful moments into timeless stories.</p>
        <button 
          className="explore-more-btn"
          style={{
            marginTop: '20px',
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff',
            background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(233, 30, 99, 0.4)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          onClick={() => window.scrollTo({ top: document.querySelector('.magazine-gallery').offsetTop - 100, behavior: 'smooth' })}
        >
          Explore More ➜
        </button>
      </div>

      <div className="magazine-gallery">
        {magazineSamples.map((mag) => (
          <div
            key={mag.id}
            className="magazine-card"
            onClick={() => handleOpenMagazine(mag)}
          >
            <div className="card-image-wrapper">
              <img src={mag.cover} alt={mag.title} />
              <div className="card-overlay">
                <div className="card-info">
                  <h3>{mag.title}</h3>
                  <p>{mag.date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="magazine-modal">
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <IoClose />
          </button>

          <div className="flipbook-wrapper" style={{
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  borderRadius: '20px',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
  width: '100%',
  maxWidth: '1000px',
}}>
            <HTMLFlipBook
              width={300}
              height={400}
              size="stretch"
              minWidth={200}
              maxWidth={1000}
              minHeight={300}
              maxHeight={1533}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={onPage}
              className="flipbook"
              ref={flipBook}
            >
              {magazines[selectedMag.id].map((img, index) => (
                <MagazinePage key={index} image={img} number={index + 1} title={`Page ${index + 1}`} caption="Izhaar Magazine" />
              ))}
            </HTMLFlipBook>
          </div>

          <div className="viewer-controls">
          

            <span className="page-indicator">
              PAGE {currentPage + 1} OF {magazines[selectedMag.id].length}
            </span>

           
          </div>
        </div>
      )}
    </div>
  );
};

export default Magazine;