"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import YouPNG from "@/assets/map/you.png";
import UserIcon from "@/assets/map/user.png";
import CameraIcon from '@/assets/map/camera.png'
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  InfoBox,
} from "@react-google-maps/api";
import {
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from "@material-tailwind/react";
import { data } from "autoprefixer";
import { AiFillCar } from "react-icons/ai";
import { MdCreateNewFolder, MdLocationOn } from "react-icons/md";
import { BiSolidMessageRoundedDetail } from 'react-icons/bi'
import { RxCross2 } from "react-icons/rx";
import Slider from "@/components/Slider";
import { GoDotFill } from "react-icons/go";
import { HiChevronDown } from "react-icons/hi";
import { TripType } from "@/types/MainTypes";

type Props = {};

const TripDetail = () => {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
      "AIzaSyBmy2F0EtGGkSn-yEgVMfsjAQ-q3qZW49w",
    libraries: ["places"],
  });
  const { tid } = useParams()
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const data = [
    {
      label: "Find Ride",
      value: "find",
      icon: AiFillCar,
      desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people
      who are like offended by it, it doesn't matter.`,
    },
    {
      label: "Offer Ride",
      value: "offer",
      icon: MdCreateNewFolder,
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
  ];
  const [activeMarker, setActiveMarker] = useState(-1);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const [a, setA] = useState("")
  const [b, setB] = useState("")

  const [infoDomReady, setInfoDomReady] = useState(false);

  const [trip, setTrip] = useState<TripType | null>(null)

  const [markers, setMarkers] = useState<{
    longitude: number,
    latitude: number,
    img: string,
    desc: string
  }[]>([])

  const center = {
    lat: 19.0645,
    lng: 72.8359,
  };
  const [tab, setTab] = useState("find");

  async function getLatLong(address: string) {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBmy2F0EtGGkSn-yEgVMfsjAQ-q3qZW49w`
    );
    const data = await res.json();
    console.log(data.results[0].geometry.location);
    return data.results[0].geometry.location;
  }

  const sendResult = async (result: google.maps.DirectionsResult) => {
    fetch("https://edumate.glitch.me/poly", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: result.routes[0].overview_polyline,
      }),
    })
      .then(res => res.json())
      .then(response => {
        console.log("User's Location Info: ", response)
        setMarkers(response?.data)
      })
      .catch((e)=>{
        console.log(e);
        alert("Something went wrong!")
      })

  }
  async function calculateRoute(a: string, b: string) {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      // @ts-ignore
      origin: a,
      // @ts-ignore
      destination: b,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    console.log(results);

    await sendResult(results)
    setDirectionsResponse(results)
    setDistance(results?.routes[0]?.legs[0]?.distance?.text || "NA")
    setDuration(results?.routes[0]?.legs[0]?.duration?.text || "NA")
  }

  const fetchData = (id: string) => {

    fetch(`https://edumate.glitch.me/getpooldetail/${id}`)
      .then(res => res.json())
      .then((data) => {
        console.log("trips", data);
        setTrip(data.data)
        const tempData : TripType = data.data;
        calculateRoute(tempData.source, tempData?.destination);
      }).catch((e) => {
        console.log(e)
        alert("Something went wrong!")
      })
  }

  useEffect(() => {
    if (isLoaded && tid) fetchData(tid as string);
  }, [isLoaded, tid]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  const handleActiveMarker = (marker: number) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col relative">
      <div className="h-full w-full bg-gray-400">
        <GoogleMap
          onClick={() => setActiveMarker(-1)}
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => {
            // const trafficLayer = new google.maps.TrafficLayer();
            // trafficLayer.setMap(map);
            // setMap(map);
          }}
        >
          <Marker
            onClick={() => handleActiveMarker(0)}
            position={center}
            icon={YouPNG.src || "http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
          />

          {
            markers.map((marker, index) => (
              <Marker
                key={index}
                onClick={() => handleActiveMarker(index + 1)}
                position={{ lat: marker.latitude, lng: marker.longitude }}
                icon={CameraIcon.src || "http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
              >
                {/* Infobox */}
                {
                  activeMarker === index + 1 && (
                    <InfoBox
                      options={{ closeBoxURL: ``, enableEventPropagation: true }}
                      onDomReady={() => setInfoDomReady(true)}
                      onUnmount={() => setInfoDomReady(false)}
                    >
                      <div className="flex flex-col items-center justify-center bg-white p-4 rounded-md shadow-xl">
                        {/* <div className="flex items-center justify-center">
                          <img src={YouPNG.src || "http://maps.google.com/mapfiles/ms/icons/green-dot.png"} alt="You" className="w-8 h-8" />
                          <span className="text-sm font-semibold text-black">You</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <span className="text-xs font-semibold text-black">Lat: {center.lat.toFixed(4)}</span>
                          <span className="text-xs font-semibold text-black">Lng: {center.lng.toFixed(4)}</span>
                        </div> */}

                        <div className='absolute right-2 top-2 cursor-pointer bg-white p-1'>
                          <RxCross2 className='w-6 h-6 text-black' onClick={() => handleActiveMarker(-1)} />
                        </div>
                        <Slider marker={marker} />
                      </div>
                    </InfoBox>
                  )
                }
              </Marker>
            ))
          }

          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      <div className="absolute bottom-0 left-0 right-0 min-h-[20%] h-fit flex flex-col rounded-t-2xl bg-white text-black p-2">
        <div className="w-full p-2">
          <p className="font-bold">Ride Start on 25 Mar, 10:30 am</p>
        </div>
        <div className='w-full p-2 flex flex-col space-y-4 border-b-2 border-dashed border-gray-500 '>
          <div className='flex items-center space-x-1'>
            <GoDotFill className="text-green-600 w-3 h-3 mx-0.5" />
            <p className='text-[0.8rem]'>{trip?.source}</p>
          </div>
          <div className='flex items-center space-x-1'>
            <HiChevronDown className="text-green-600 font-bold w-4 h-4" />
            <p className='text-[0.8rem]'>{trip?.destination}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 py-4">
          <div className="flex w-12 h-12 border rounded-md border-green-500">
            <img src={UserIcon.src} className="w-full object-contain" alt="" />
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <p>{trip?.createdby}</p>
              <p>Rs. {trip?.cost}</p>
            </div>
            <div className="flex items-center justify-between text-black">
              <p className="text-xs font-extralight">Seats {trip?.max}</p>
              <p className="text-xs font-extralight">{trip?.member} Pass</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center p-2">
            <BiSolidMessageRoundedDetail className="w-8 h-8 text-green-500" />
          </div>
          <button className="w-full p-2 text-sm rounded-full bg-green-500 text-white">
            OFFER RIDE
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
