"use client"
import React, { useState, useEffect } from 'react';
import { WeatherType } from '../types/MainTypes';
// import icons
import {
  IoMdSunny,
  IoMdRainy,
  IoMdCloudy,
  IoMdSnow,
  IoMdThunderstorm,
  IoMdSearch,
} from 'react-icons/io';

import {
  BsCloudHaze2Fill,
  BsCloudDrizzleFill,
  BsEye,
  BsWater,
  BsThermometer,
  BsWind,
} from 'react-icons/bs';

import { TbTemperatureCelsius } from 'react-icons/tb';
import { ImSpinner8 } from 'react-icons/im';

// api key
const APIkey = 'bcf2048bc3be154bded8f277f580ba2e';

type Props = {
  data: WeatherType;
  dstAirport: string;
};

const WeatherCard = ({ data , dstAirport} : Props) => {
  // const [data, setData] = useState<WeatherType>();
  const [location, setLocation] = useState('Mumbai');
  const [inputValue, setInputValue] = useState('');
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // fetch the data
  // useEffect(() => {
  //   // set loading to true
  //   setLoading(true);
  //   // const url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${location}&units=metric&appid=${APIkey}`
  //   const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;

  //   axios
  //     .get(url)
  //     .then((res) => {
  //       // set the data after 1500 ms
  //       setTimeout(() => {
  //         setData(res.data);
  //         // set loading to false
  //         setLoading(false);
  //         console.log(res);
  //       }, 1500);
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       setErrorMsg(err);
  //     });
  // }, [location]);

  // error message
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg('');
    }, 2000);
    // clear timer
    return () => clearTimeout(timer);
  }, [errorMsg]);

  // if data is false show the loader
  if (!data) {
    return (
      <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center'>
        <div>
          <ImSpinner8 className='text-5xl animate-spin text-white' />
        </div>
      </div>
    );
  }

  // set the icon according to the weather
  let icon;

  switch (data.weather[0].main) {
    case 'Clouds':
      icon = <IoMdCloudy />;
      break;
    case 'Haze':
      icon = <BsCloudHaze2Fill />;
      break;
    case 'Rain':
      icon = <IoMdRainy className='text-[#31cafb]' />;
      break;
    case 'Clear':
      icon = <IoMdSunny className='text-[#ffde33]' />;
      break;
    case 'Drizzle':
      icon = <BsCloudDrizzleFill className='text-[#31cafb]' />;
      break;
    case 'Snow':
      icon = <IoMdSnow className='text-[#31cafb]' />;
      break;
    case 'Thunderstorm':
      icon = <IoMdThunderstorm />;
      break;
  }

  // date object
  const date = new Date();

  return (
    <div className='w-full mb-[20px] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-1 lg:px-0'>
      {/* form */}
      {/* <form
        className={`${
          animate ? 'animate-shake' : 'animate-none'
        } h-16 bg-black/30 w-full max-w-[450px]
      rounded-full backdrop-blur-[32px] mb-8`}
      >
        <div className='h-full relative flex items-center justify-between p-2'>
          <input
            onChange={(e) => handleInput(e)}
            className='flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-full'
            type='text'
            placeholder='Search by city or country'
          />
          <button
            onClick={(e) => handleSubmit(e)}
            className='bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition'
          >
            <IoMdSearch className='text-2xl text-white' />
          </button>
        </div>
      </form> */}
      {/* card */}
      <div className='w-full md:min-w-[360px] max-w-[310px] text-gray-900 bg-gray-200 dark:bg-gray-800 max-h-[500px] dark:text-white backdrop-blur-[32px] rounded-[32px] hover:shadow-md hover:shadow-[#ff6f2a] py-12 px-6'>
        {loading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <ImSpinner8 className='text-white text-5xl animate-spin' />
          </div>
        ) : (
          <div>
            {/* card top */}
            <div className='flex items-center gap-x-5'>
              {/* icon */}
              <div className='text-[87px]'>{icon}</div>
              <div>
                {/* country name */}
                <div className='text-2xl font-semibold'>
                  {dstAirport}
                </div>
                {/* date */}
                <div>
                  {/* {date?.getUTCDate()}/{date?.getUTCMonth() + 1}/
                  {date?.getUTCFullYear()} */}
                  {
                    data?.dt_txt.toString().split(' ')[0].split('-').reverse().join('-')
                  }
                </div>
              </div>
            </div>
            {/* card body */}
            <div className='my-10'>
              <div className='flex justify-center items-center'>
                {/* temp */}
                <div className='text-6xl lg:text-7xl leading-none'>
                  {data?.main?.temp}
                </div>
                {/* celsius icon */}
                <div className='text-4xl'>
                  <TbTemperatureCelsius />
                </div>
              </div>
              {/* weather description */}
              <div className='capitalize text-center'>
                {data?.weather[0]?.description}
              </div>
            </div>
            {/* card bottom */}
            <div className='max-w-[378px] mx-auto flex flex-col gap-y-6'>
              <div className='grid grid-cols-2'>
                <div className='flex items-center gap-x-2'>
                  {/* icon */}
                  <div className='text-[20px] text-[#ff6f2a]'>
                    <BsEye />
                  </div>
                  <div>
                    {/* Visibility */}
                    <span className='ml-2 text-[#f88049]'>{data?.visibility / 1000} km</span>
                  </div>
                </div>
                <div className='flex items-center gap-x-2'>
                  {/* icon */}
                  <div className='text-[20px] text-[#ff6f2a]'>
                    <BsCloudHaze2Fill />
                  </div>
                  <div className='flex'>
                    {/* Cloudiness */}
                    <div className='flex ml-2 text-[#f88049]'>
                      {data?.clouds?.all} %
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-2'>
                <div className='flex items-center gap-x-2'>
                  {/* icon */}
                  <div className='text-[20px] text-[#ff6f2a]'>
                    <BsWater />
                  </div>
                  <div>
                    {/* Humidity  */}
                    <span className='ml-2 text-[#f88049]'>{data?.main?.humidity} %</span>
                  </div>
                </div>
                <div className='flex items-center gap-x-2'>
                  {/* icon */}
                  <div className='text-[20px] text-[#ff6f2a]'>
                    <BsWind />
                  </div>
                  <div>
                    {/* Wind  */}
                    <span className='ml-2 text-[#f88049]'>{data?.wind?.speed} m/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;