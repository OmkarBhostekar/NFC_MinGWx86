// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import YouPNG from "@/assets/map/you.png";
import { Select, Option, Button } from "@material-tailwind/react";

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
  Input,
} from "@material-tailwind/react";
import { data } from "autoprefixer";
import { AiFillCar } from "react-icons/ai";
import { MdCreateNewFolder, MdLocationOn, MdDateRange } from "react-icons/md";
import { BsCircleFill } from "react-icons/bs";
import { FaLocation } from "react-icons/fa";
import Card from "@/components/Card";
import { RxCross2 } from "react-icons/rx";
import Slider from "@/components/Slider";

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
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [Seats, setSeats] = useState(0);
  const [cost, setCost] = useState(0);


  const [trips, setTrips] = useState([]);
  const fetchData = () => {
    fetch("https://edumate.glitch.me/getuserpool")
      .then(res => res.json())
      .then((data) => {
        console.log("trips", data);
        setTrips(data.data)
      }).catch((e) => {
        console.log(e)
        alert("Something went wrong!")
      })
  }

  useEffect(() => {
    fetchData();
  }, [])

  const createRide = async () => {
    if (!date || !endDate || !Seats || !cost)
      return alert("Please fill all the fields");
    const res = await fetch("https://edumate.glitch.me/createp", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        createdby: "Omkar",
        source: a,
        destination: b,
        cost: cost,
        member: 1,
        max: Seats,
        startTime: date,
        endTime: endDate,
      }),
    });
    const data = await res.json();
    console.log(data);
  };

  const findPools = async () => { };

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
      <div className="absolute bottom-0 left-0 right-0 h-1/2 flex flex-col rounded-t-2xl bg-white text-black p-2">
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
        <div className="flex flex-col overflow-auto">
          {
            tab === "find" ? (
              <div
                className='w-full p-4'
              >
                <div
                  className='flex flex-col w-full space-y-2 text-black'
                >
                  {
                    trips && trips.map((obj, idx) => {
                      return <Card key={idx} trip={obj} parent="ridepool" />
                    })
                  }
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-row px-5 py-2 mt-4 items-center">
                  <div className="w-1/6">
                    <BsCircleFill className="h-6 w-6 p-1 text-green-500" />
                  </div>
                  <div className="w-5"></div>
                  <div className="text-black w-full">{a}</div>
                </div>
                <div className="mx-6 mt-2">
                  <div className="h-[1px] bg-gray-400"></div>
                </div>
                <div className="flex flex-row px-5 py-2 mt-4 items-center">
                  <div className="w-1/6">
                    <MdLocationOn className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="w-5"></div>
                  <div className="text-black w-full">{b}</div>
                </div>
                <div className="mx-6 mt-2">
                  <div className="h-[1px] bg-gray-400"></div>
                  <div className="text-green-500 mt-4 ml-6">Start time</div>
                  <div className="flex flex-row px-5 py-2 mt-1 items-center">
                    <div className="flex w-full flex-row border border-green-500 text-black rounded-lg p-2">
                      <input
                        type="datetime-local"
                        className="w-full"
                        onChange={(e) => {
                          setDate(e.target.value);
                          console.log(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-green-500 mt-4 ml-4">End time</div>
                  <div className="flex flex-row px-5 py-2 mt-1 items-center">
                    <div className="flex w-full flex-row border border-green-500 text-black rounded-lg p-2">
                      <input
                        type="datetime-local"
                        className="w-full"
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          console.log(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-row px-5 py-2 mt-3 text-black rounded-lg">
                    <Select
                      size="md"
                      label="Select seats"
                      onChange={(e) => {
                        console.log(`Selected ${e}`);
                        setSeats(parseInt(e));
                      }}
                    >
                      <Option value="2">2 Seats</Option>
                      <Option value="3">3 Seats</Option>
                      <Option value="4">4 Seats</Option>
                      <Option value="6">6 Seats</Option>
                    </Select>
                  </div>
                </div>
                <div className="w-full px-6 flex flex-row mt-4">
                  <div className="w-5"></div>
                  <Input
                    label="Ride Cost"
                    onChange={(e) => {
                      setCost(e.target.value);
                    }}
                  />
                  <div className="w-5"></div>
                </div>
                <div className="w-full flex flex-row mt-6 px-2">
                  <div className="w-5"></div>
                  <Button
                    color="green"
                    className="w-full "
                    onClick={() => {
                      createRide();
                    }}
                  >
                    Offer Ride
                  </Button>
                  <div className="w-5"></div>
                </div>
              </>
            )
          }
        </div>
      </div>
    </div >
  );
};

export default RidePool;
