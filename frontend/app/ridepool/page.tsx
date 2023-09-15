// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import YouPNG from "@/assets/map/you.png";
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
import { BsCircleFill } from "react-icons/bs";
import { FaLocation } from "react-icons/fa";

type Props = {};

const RidePool = (props: Props) => {
  const params = useSearchParams();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
      "AIzaSyBmy2F0EtGGkSn-yEgVMfsjAQ-q3qZW49w",
    libraries: ["places"],
  });
  console.log(params);
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
  const a = params.get("a");
  const b = params.get("b");
  const aLat = parseInt(params.get("aLat"));
  const aLng = parseInt(params.get("aLng"));
  const bLat = parseInt(params.get("bLat"));
  const bLng = parseInt(params.get("bLng"));
  const center = {
    lat: aLat || 19.0645,
    lng: aLng || 72.8359,
  };
  const [tab, setTab] = useState("find");

  async function calculateRoute(a, b) {
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

    setDirectionsResponse(results);
  }

  useEffect(() => {
    if (isLoaded) calculateRoute(a, b);
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-white flex flex-col">
      <div className="h-2/5 w-full bg-gray-400">
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
            icon={
              YouPNG.src ||
              "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            }
          >
            {/* Infobox */}
            {activeMarker === 0 && (
              <InfoBox
                options={{ closeBoxURL: ``, enableEventPropagation: true }}
                onDomReady={() => setInfoDomReady(true)}
                onUnmount={() => setInfoDomReady(false)}
              >
                <div className="flex flex-col items-center justify-center bg-white p-4 rounded-md shadow-xl">
                  <div className="absolute right-2 top-2 cursor-pointer bg-white p-1">
                    <RxCross2
                      className="w-6 h-6 text-black"
                      onClick={() => handleActiveMarker(-1)}
                    />
                  </div>
                  <Slider />
                </div>
              </InfoBox>
            )}
          </Marker>

          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      <div className="flex flex-col bg-green-500 p-1 rounded-2xl">
        <Tabs value="find">
          <TabsHeader
            className="bg-transparent"
            indicatorProps={{
              className: "bg-white rounded-2xl shadow-none !text-gray-900",
            }}
          >
            {data.map(({ label, value, icon }) => (
              <Tab key={value} value={value}>
                <div
                  className="flex items-center gap-2"
                  onClick={() => setTab(value)}
                >
                  {React.createElement(icon, { className: "w-5 h-5" })}
                  {label}
                </div>
              </Tab>
            ))}
          </TabsHeader>
        </Tabs>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row px-5 py-2 mt-4 items-center">
          <BsCircleFill className="h-6 w-6 p-1 text-green-500" />
          <div className="w-5"></div>
          <div className="text-black">{a}</div>
        </div>
        <div className="h-[1px] bg-gray-400"></div>
        <div className="flex flex-row px-5 py-2 mt-4 items-center">
          <MdLocationOn className="h-5 w-5 text-red-500" />
          <div className="w-5"></div>
          <div className="text-black">{b}</div>
        </div>
      </div>
    </div>
  );
};

export default RidePool;
