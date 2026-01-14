import React, { useState, useRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import './Magazine.css';

// Importing assets
import group1 from '../assets/magazine-samples/Group 1.png';
import group2 from '../assets/magazine-samples/Group 2.png';
import group3 from '../assets/magazine-samples/Group 3.png';
import group4 from '../assets/magazine-samples/Group 4.png';
import group5 from '../assets/magazine-samples/Group 5.png';
import group6 from '../assets/magazine-samples/Group 6.png';
import group7 from '../assets/magazine-samples/Group 7.png';

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

  const pages = [group1, group2, group3, group4, group5, group6, group7];

  const magazineSamples = [
    { id: 1, title: 'Twisted Into Love', cover: group1, date: 'Wedding Edition 2024' },
    { id: 2, title: 'Together Always', cover: group2, date: 'Travel & Love 2024' },
    { id: 3, title: 'Sketch of Romance', cover: group3, date: 'Artistic Edition' },
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
              {pages.map((img, index) => (
                <MagazinePage key={index} image={img} number={index + 1} title={`Page ${index + 1}`} caption="Izhaar Magazine" />
              ))}
            </HTMLFlipBook>
          </div>

          <div className="viewer-controls">
            <button
              className="nav-btn"
              onClick={prevButtonClick}
              disabled={currentPage === 0}
            >
              <IoChevronBack /> Previous
            </button>

            <span className="page-indicator">
              PAGE {currentPage + 1} OF {pages.length}
            </span>

            <button
              className="nav-btn"
              onClick={nextButtonClick}
              disabled={currentPage === pages.length - 1}
            >
              Next <IoChevronForward />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Magazine;