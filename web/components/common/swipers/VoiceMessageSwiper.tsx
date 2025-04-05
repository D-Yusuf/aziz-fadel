import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import VoiceMessage from '../VoiceMessage';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface VoiceMessageSwiperProps {
  voiceMessages: string[];
  className?: string;
}

export default function VoiceMessageSwiper({ voiceMessages, className = '' }: VoiceMessageSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    // Pause autoplay when voice is playing
    swiperRef.current?.autoplay.stop();
  };

  const handlePause = () => {
    setIsPlaying(false);
    // Resume autoplay when voice is paused
    swiperRef.current?.autoplay.start();
  };

  return (
    <div className='relative w-full max-w-5xl mx-auto px-2'>
      {/* Custom navigation arrows with icons */}
      <button 
        className="voice-swiper-button-next absolute top-1/2 -translate-y-1/2 left-0 md:-left-8 z-10 w-10 h-10 flex items-center justify-center bg-white shadow-md rounded-full text-accent hover:bg-gray-50 transition-colors hidden md:flex"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <FaChevronLeft size={16} />
      </button>
      
      <button 
        className="voice-swiper-button-prev absolute top-1/2 -translate-y-1/2 right-0 md:-right-8 z-10 w-10 h-10 flex items-center justify-center bg-white shadow-md rounded-full text-accent hover:bg-gray-50 transition-colors hidden md:flex"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <FaChevronRight size={16} />
      </button>
      
      <div className="px-2 md:px-6">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: true
          }}
          pagination={{
            clickable: true,
            el: '.voice-swiper-pagination',
            bulletClass: 'swiper-pagination-bullet !bg-accent !w-3 !h-3 !mx-1',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-accent !w-4 !h-4',
            enabled: true,
          }}
          navigation={{
            nextEl: '.voice-swiper-button-next',
            prevEl: '.voice-swiper-button-prev',
            enabled: true,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="voiceSwiper"
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
              pagination: {
                enabled: false,
              },
              navigation: {
                enabled: true,
              },
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
              pagination: {
                enabled: false,
              },
              navigation: {
                enabled: true,
              },
            },
          }}
        >
          {voiceMessages.map((voiceSrc, index) => {
            const normalizedIndex = index % voiceMessages.length;
            const isActive = normalizedIndex === activeIndex;
            
            return (
              <SwiperSlide key={index} className="flex justify-center items-center py-4">
                <VoiceMessage 
                  audioSrc={voiceSrc} 
                  isDisabled={!isActive}
                  onPlay={handlePlay}
                  onPause={handlePause}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      
      <div className="voice-swiper-pagination !relative !mt-6 !flex !justify-center !gap-2 md:!hidden"></div>

      <style jsx global>{`
        .voice-swiper-button-prev:after,
        .voice-swiper-button-next:after {
          content: none;
        }
        
        .voiceSwiper {
          padding: 10px 0;
        }
        
        .voiceSwiper .swiper-slide {
          height: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
} 