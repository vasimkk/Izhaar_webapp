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
    1: [M11, M12, M13, M14, M15, M16, M17],
    2: [M21, M22, M23, M24, M25, M26, M27],
    3: [M31, M32, M33, M34, M35, M36, M37],
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
    <div className="magazine-container" style={{
      background: 'transparent',
      paddingBottom: '50px'
    }}>
      <div className="magazine-header text-center mb-12" >
        <h1
          className="text-4xl sm:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
        >Izhaar Magazine Samples</h1>
        <p className="text-white !text-white">Premium custom-designed magazines that turned your beautiful moments into timeless stories.</p>
        <button
          className="explore-more-btn relative overflow-hidden"
          style={{
            marginTop: '20px',
            padding: '12px 32px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff',
            background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
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
          <span className="relative z-10">Explore More ➜</span>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)',
            transform: 'skewX(-20deg) translateX(-150%)',
            animation: 'shimmer 2.5s infinite',
            pointerEvents: 'none',
          }} />
          <style>{`
            @keyframes shimmer {
              0% { transform: skewX(-20deg) translateX(-150%); }
              50% { transform: skewX(-20deg) translateX(150%); }
              100% { transform: skewX(-20deg) translateX(150%); }
            }
          `}</style>
        </button>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .magazine-scene {
           width: 100%;
           max-width: 300px;
           aspect-ratio: 1 / 1.4; /* Maintain book ratio */
           height: auto; 
           perspective: 1500px; 
           margin: 20px auto; /* Centered margin */
           cursor: pointer;
           opacity: 0; 
           animation: fadeInUp 0.8s ease-out forwards;
        }

        /* Mobile Adjustments */
        @media (max-width: 640px) {
           .magazine-scene {
              max-width: 260px; /* Slightly smaller on mobile to fit nicely */
           }
        }

        .book {
           position: relative;
           width: 100%;
           height: 100%;
           transform-style: preserve-3d;
           transition: transform 0.5s ease;
           box-shadow: 10px 10px 30px rgba(0,0,0,0.3);
        }

        .magazine-scene:hover .book {
           transform: rotateY(-30deg) translateX(10px); /* Whole book tilts slightly */
        }
        
        /* The Front Cover */
        .book-cover {
           position: absolute;
           top: 0; left: 0;
           width: 100%; height: 100%;
           transform-origin: left; /* Open like a book */
           transform-style: preserve-3d;
           transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
           z-index: 5;
           border-radius: 2px 5px 5px 2px;
        }

        .magazine-scene:hover .book-cover {
           transform: rotateY(-50deg); /* Open the cover */
        }

        /* Inner Pages (Visible when Cover Opens) */
        .book-inner-pages {
           position: absolute;
           top: 4px; right: 4px; bottom: 4px; left: 4px;
           background: #fdfdfd;
           background-image: repeating-linear-gradient(to right, #f1f1f1 0px, #f1f1f1 1px, transparent 1px, transparent 3px); /* Text lines */
           border-radius: 2px;
           box-shadow: inset 3px 0px 10px rgba(0,0,0,0.1);
           z-index: 1;
           display: flex;
           align-items: center;
           justify-content: center;
           flex-direction: column;
           gap: 10px;
           padding: 20px;
           text-align: center;
        }
        
        /* Spine Effect */
        .book-spine-overlay {
            position: absolute;
            left: 0; top: 0; bottom: 0;
            width: 30px;
            background: linear-gradient(to right, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
            z-index: 10;
            border-radius: 2px 0 0 2px;
            pointer-events: none;
        }
        
        /* Back Cover (Thickness) */
        .book::after {
            content: '';
            position: absolute;
            top: 0; bottom: 0; left: 0;
            width: 100%;
            background: #fff;
            transform: translateZ(-15px); /* Thickness depth */
            border-radius: 2px 5px 5px 2px;
            box-shadow: -10px 0 20px rgba(0,0,0,0.1);
            z-index: -1;
        }
        
        /* Pages Thickness visual on right edge */
        .book::before {
             content: '';
             position: absolute;
             top: 5px; bottom: 5px; right: 0;
             width: 15px;
             transform: rotateY(90deg) translateZ(-8px);
             background: linear-gradient(to right, #ddd, #fff, #ddd);
             z-index: 0;
        }

        .magazine-scene:nth-child(1) { animation-delay: 0.1s; }
        .magazine-scene:nth-child(2) { animation-delay: 0.3s; }
        .magazine-scene:nth-child(3) { animation-delay: 0.5s; }
      `}</style>

      <div className="magazine-gallery" style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', padding: '40px 20px' }}>
        {magazineSamples.map((mag) => (
          <div
            key={mag.id}
            className="magazine-scene"
            onClick={() => handleOpenMagazine(mag)}
          >
            <div className="book">
              {/* The Inner Pages (Underneath) */}
              <div className="book-inner-pages">
                <h4 className="text-gray-800 font-serif text-lg italic">"A story of love..."</h4>
                <p className="text-gray-400 text-xs">Tap to Read</p>
              </div>

              {/* The Front Cover (Animates Open) */}
              <div className="book-cover">
                <div style={{ width: '100%', height: '100%', position: 'relative', background: '#fff' }}>
                  <div className="book-spine-overlay"></div>
                  <img
                    src={mag.cover}
                    alt={mag.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px 5px 5px 2px' }}
                  />
                  <div className="card-overlay" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                    padding: '24px 20px',
                    color: 'white',
                  }}>
                    <div className="card-info">
                      <h3 className="text-xl font-bold mb-1 tracking-wide">{mag.title}</h3>
                      <p className="text-xs uppercase tracking-widest opacity-80">{mag.date}</p>
                    </div>
                  </div>
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