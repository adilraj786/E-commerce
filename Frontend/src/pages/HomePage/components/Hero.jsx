import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/context/FirebaseConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const HeroSection = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const q = query(
          collection(db, "banners"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const bannerList = snapshot.docs.map((doc) => doc.data().bannerImage);
        setBanners(bannerList);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const heightClasses =
    "h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]";

  if (banners.length === 0) {
    return (
      <div
        className={`w-full ${heightClasses} flex items-center justify-center bg-gray-100`}
      >
        <p className="text-gray-500 text-lg">Loading Banner...</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${heightClasses}`}>
      {banners.length > 1 ? (
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-full"
        >
          {banners.map((url, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={url}
                alt={`Banner ${idx + 1}`}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <img
          src={banners[0]}
          alt="Single Banner"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      )}
    </div>
  );
};

export default HeroSection;
