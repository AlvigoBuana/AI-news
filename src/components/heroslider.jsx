import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

export default function HeroSlider({ trendingNews }) {
  if (!trendingNews || trendingNews.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <Swiper
        // Hapus 'EffectFade' dari modul
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        // --- PROPERTI 'effect="fade"' DIHAPUS DARI SINI ---
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        className="w-full h-[400px] rounded-2xl bg-zinc-200 dark:bg-zinc-800"
      >
        {trendingNews.map((article) => (
          <SwiperSlide key={article.url}>
            {/* Mengembalikan tampilan slide yang lengkap dan keren */}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full relative group"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <span className="inline-block bg-indigo-600 px-3 py-1 text-sm font-semibold rounded-full mb-2">
                  {article.topic}
                </span>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight line-clamp-2">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm md:text-base opacity-90 line-clamp-2">
                  {article.description}
                </p>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}