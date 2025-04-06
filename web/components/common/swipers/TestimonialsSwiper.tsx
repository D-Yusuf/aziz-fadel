import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

interface Testimonial {
  name: string;
  text: string;
}

interface TestimonialsSwiperProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSwiper({ testimonials }: TestimonialsSwiperProps) {
  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="px-2 md:px-6">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            el: '.testimonials-swiper-pagination',
            bulletClass: 'swiper-pagination-bullet !bg-accent !w-3 !h-3 !mx-1',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-accent !w-4 !h-4',
          }}
          navigation={{
            nextEl: '.testimonials-swiper-button-next',
            prevEl: '.testimonials-swiper-button-prev',
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="testimonialsSwiper !pb-12"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="flex justify-center items-center py-4">
              <div className="bg-secondary rounded-lg p-6 relative shadow-sm">
                <div className="absolute -top-4 right-6 bg-accent rounded-full p-2">
                  <FaQuoteRight className="text-white text-xl" />
                </div>
                <div className="absolute -bottom-4 left-6 bg-accent rounded-full p-2">
                  <FaQuoteLeft className="text-white text-xl" />
                </div>
                <div className="mt-4 space-y-4">
                  <p className="text-gray-600 text-right leading-relaxed">{testimonial.text}</p>
                  <p className="text-accent font-semibold text-right">{testimonial.name}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <div className="testimonials-swiper-pagination !relative !bottom-0 !mt-6 !flex !justify-center !gap-2"></div>
    </div>
  );
} 