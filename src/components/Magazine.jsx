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

const MagazinePage = React.forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        <img src={props.image} alt={`Page ${props.number}`} className="page-image" />
      </div>
    </div>
  );
});

const Magazine = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedMag, setSelectedMag] = useState(null);
  const flipBook = useRef(null);

  const pages = [group1, group4, group2, group3, group5, group6, group7];

  const magazineSamples = [
    { id: 1, title: 'Twisted Into Love', cover: group1, date: 'Wedding Edition 2024' },
    { id: 2, title: 'Together Always', cover: group2, date: 'Travel & Love 2024' },
    { id: 3, title: 'Sketch of Romance', cover: group3, date: 'Artistic Edition' },
    { id: 4, title: 'Love Prescribed', cover: group4, date: 'Doctors Diaries' },
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

          <div className="flipbook-wrapper">
            <HTMLFlipBook
              width={550}
              height={733}
              size="stretch"
              minWidth={315}
              maxWidth={1000}
              minHeight={420}
              maxHeight={1533}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={onPage}
              className="flipbook"
              ref={flipBook}
            >
              {pages.map((img, index) => (
                <MagazinePage key={index} image={img} number={index + 1} />
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