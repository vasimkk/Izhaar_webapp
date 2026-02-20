import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Importing assets
import M11 from '../../../assets/magazine-samples/M1/M11.png';
import M21 from '../../../assets/magazine-samples/M2/M21.png';
import M31 from '../../../assets/magazine-samples/M3/M31.png';

const MagazineSection = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);

    const magazineSamples = [
        { id: 1, title: 'Twisted Into Love', cover: M11, date: 'Wedding Edition 2024' },
        { id: 2, title: 'Together Always', cover: M21, date: 'Travel & Love 2024' },
        { id: 3, title: 'Soul Connection', cover: M31, date: 'Legacy Edition' },
    ];

    // Auto-slide logic
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % magazineSamples.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [magazineSamples.length]);

    // Handle scroll alignment
    useEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const items = container.querySelectorAll('.mag-item-wrap');
            if (items[activeIndex]) {
                const item = items[activeIndex];
                const scrollLeft = item.offsetLeft - (container.offsetWidth / 2) + (item.offsetWidth / 2);
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [activeIndex]);

    return (
        <div className="magazine-section-container relative w-full overflow-hidden py-10">
            <style>{`
                .mag-scroll-container {
                    display: flex;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    gap: 50px;
                    padding: 30px 20px 60px 20px;
                }
                .mag-scroll-container::-webkit-scrollbar {
                    display: none;
                }
                .mag-item-wrap {
                    flex-shrink: 0;
                    width: 240px; /* Reduced size */
                    scroll-snap-align: center;
                    perspective: 1500px;
                    cursor: pointer;
                }
                .book {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1 / 1.4;
                    transform-style: preserve-3d;
                    transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .active-mag .book {
                    transform: rotateY(-25deg) scale(1.05);
                }
                .book-cover {
                    position: absolute;
                    inset: 0;
                    z-index: 10;
                    transform-origin: left;
                    transition: transform 1.5s cubic-bezier(0.25, 1, 0.5, 1);
                    transform-style: preserve-3d;
                    border-radius: 2px 5px 5px 2px;
                    box-shadow: 10px 10px 25px rgba(0,0,0,0.3);
                }
                .active-mag .book-cover {
                    transform: rotateY(-110deg);
                }
                
                /* THE REAL WHITE PAGES FEEL */
                .book-inner {
                    position: absolute;
                    inset: 0;
                    background: #fff;
                    z-index: 1;
                    border-radius: 2px;
                    box-shadow: inset 5px 0 15px rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    text-align: center;
                    overflow: hidden;
                }
                
                /* Center Crease for Flipbook look */
                .book-inner::after {
                    content: '';
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 40px;
                    background: linear-gradient(to right, rgba(0,0,0,0.08) 0%, transparent 100%);
                    z-index: 2;
                }

                /* Multiple Page Layers (Page Stack) */
                .page-layer {
                    position: absolute;
                    inset: 0;
                    background: #fff;
                    border: 1px solid #eee;
                    border-radius: 2px;
                    box-shadow: 2px 0 5px rgba(0,0,0,0.05);
                }
                .page-layer-1 { transform: translateZ(-2px) translateX(2px); }
                .page-layer-2 { transform: translateZ(-4px) translateX(4px); }
                .page-layer-3 { transform: translateZ(-6px) translateX(6px); }

                /* Spine of the book */
                .book-spine {
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 25px;
                    background: linear-gradient(to right, rgba(0,0,0,0.3), transparent);
                    z-index: 15;
                    pointer-events: none;
                }

                .book::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: #fff;
                    transform: translateZ(-10px);
                    border-radius: 2px 5px 5px 2px;
                    box-shadow: -5px 0 15px rgba(0,0,0,0.1);
                    z-index: -1;
                }
            `}</style>

            {/* Header */}
            <div className="flex flex-col mb-8 px-6">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-10 h-[1px] bg-gradient-to-r from-pink-500 to-transparent"></span>
                    <span className="text-[9px] font-black text-pink-400 uppercase tracking-[0.3em]">Boutique Archive</span>
                </div>
                <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white tracking-wide italic">
                    Featured Stories
                </h3>
                <p className="text-white/60 text-[10px] mt-2 leading-relaxed max-w-xs">
                    Order your <span className="text-pink-400 font-bold">Digital Magazine</span> here and download it as soon as it's ready.
                </p>
            </div>

            {/* Carousel Slider */}
            <div ref={scrollRef} className="mag-scroll-container">
                {magazineSamples.map((mag, idx) => (
                    <div
                        key={mag.id}
                        className={`mag-item-wrap ${idx === activeIndex ? 'active-mag' : 'opacity-40 grayscale group hover:opacity-100 hover:grayscale-0'}`}
                        onClick={() => navigate('/magazine')}
                    >
                        <div className="book">
                            {/* Visual Stack of Pages */}
                            <div className="page-layer page-layer-3" />
                            <div className="page-layer page-layer-2" />
                            <div className="page-layer page-layer-1" />

                            <div className="book-inner">
                                <h4 className="text-gray-800 font-serif text-base italic leading-tight">"A story of love..."</h4>
                                <p className="text-pink-500 text-[10px] font-bold uppercase tracking-widest mt-4">Tap to Read</p>
                            </div>

                            <div className="book-cover">
                                <div className="book-spine"></div>
                                <img src={mag.cover} alt={mag.title} className="w-full h-full object-cover rounded-sm" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                                    <h4 className="text-white font-bold text-base">{mag.title}</h4>
                                    <p className="text-pink-400 text-[8px] uppercase tracking-[0.2em] mt-1">{mag.date}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-2">
                {magazineSamples.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1 transition-all duration-500 rounded-full ${idx === activeIndex ? 'w-6 bg-pink-500' : 'w-1.5 bg-white/20'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default MagazineSection;
