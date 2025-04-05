import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import { Navigation } from 'swiper/modules';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface Result {
  image: string | StaticImageData;
  text?: string;
}

interface ReviewSwiperProps {
  results: Result[];
  className?: string;
}

export default function ReviewSwiper({ results, className = '' }: ReviewSwiperProps) {
  return (
    <div className='relative'>
      <button 
        className="review-swiper-button-next absolute top-1/2 -translate-y-1/2 left-0 md:-left-8 z-10 w-10 h-10 flex items-center justify-center bg-white shadow-md rounded-full text-accent hover:bg-gray-50 transition-colors hidden md:flex"
      >
        <FaChevronLeft size={16} />
      </button>
      
      <button 
        className="review-swiper-button-prev absolute top-1/2 -translate-y-1/2 right-0 md:-right-8 z-10 w-10 h-10 flex items-center justify-center bg-white shadow-md rounded-full text-accent hover:bg-gray-50 transition-colors hidden md:flex"
      >
        <FaChevronRight size={16} />
      </button>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          reverseDirection: true
        }}
        pagination={{
          clickable: true,
          el: '.review-swiper-pagination',
          bulletClass: 'swiper-pagination-bullet !bg-accent !w-3 !h-3 !mx-1',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-accent !w-4 !h-4',
          enabled: true,
        }}
        navigation={{
          nextEl: '.review-swiper-button-next',
          prevEl: '.review-swiper-button-prev',

          enabled: true,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
        breakpoints={{
          640: {
            slidesPerView: 2,
            pagination: {
              enabled: false,
            },
            navigation: {
              enabled: true,
            },
          },
          1024: {
            slidesPerView: 3,
            pagination: {
              enabled: false,
            },
            navigation: {
              enabled: true,
            },
          },
        }}
      >
        {results.map((result, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col gap-4 bg-secondary rounded-lg !shadow-sm p-4">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={result.image}
                  alt={`Result ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw rounded-lg"
                />
              </div>
              {result.text && (
                <p className="text-center text-lg mt-auto font-semi-bold whitespace-nowrap">
                  {result.text}
                </p>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination !relative !mt-6 !flex !justify-center !gap-2 md:!hidden"></div>
    </div>
  );
} 