// Import Swiper React components
// import { Pagination, Navigation } from 'swiper/modules';
// import { Swiper, SwiperSlide } from 'swiper/react';

// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
import Cat from '@/assets/map/cat.jpg'
import Test from '@/assets/map/test.jpg'

export default function Slider() {
    return (
        <div
         className='w-[200px]'
        >
            {/* <Swiper
                pagination={{
                    type: 'fraction',
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper w-[300px]"
            >
                <SwiperSlide className=''> Slide 1</SwiperSlide>
                <SwiperSlide className=''> Slide 2</SwiperSlide>
            </Swiper> */}

            <img src={Test.src}  className="w-full object-cover" alt="" />
            <p className='line-clamp-2 w-full text-black text-base mt-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi harum nulla aspernatur est facere quaerat cumque molestiae distinctio doloremque iure!</p>
        </div>

    );
};