"use client";

import { MdSwapVert } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";
import {
  BsArrowBarRight,
  BsArrowRight,
  BsFillLayersFill,
} from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import YouPNG from "@/assets/map/you.png";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  InfoBox,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import { useMainContext } from "@/context/MainContext";
import Slider from "./Slider";
import { useRouter } from "next/navigation";

function Map() {
  const router = useRouter();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
      "AIzaSyBmy2F0EtGGkSn-yEgVMfsjAQ-q3qZW49w",
    libraries: ["places"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(
    /** @type google.maps.Map */ null
  );
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const [activeMarker, setActiveMarker] = useState(-1);
  const [infoDomReady, setInfoDomReady] = useState(false);

  const [menu, showMenu] = useState(false);

  const mapLayerOptions = [
    "Traffic Layer",
    "Transit Layer",
    "Bicycling Layer",
    "Weather Layer",
    "Cloud Layer",
    "Panoramio Layer",
    "Places Layer",
    "Photos Layer",
    "Carbon Layer",
  ];

  const [selectedOption, setSelectedOption] = useState("");

  const goToPool = async () => {
    if (
      originRef.current?.value.length === 0 ||
      destiantionRef.current?.value.length === 0
    ) {
      alert("Please enter origin and destination");
      return;
    }
    const a = originRef.current?.value!;
    const b = destiantionRef.current?.value!;
    const aLatLong = await getLatLong(a);
    const bLatLong = await getLatLong(b);

    router.push(
      `/ridepool?a=${a}&b=${b}&aLat=${aLatLong.lat}&aLong=${aLatLong.lng}&bLat=${bLatLong.lat}&bLong=${bLatLong.lng}`
    );
  };

  // const infoBoxOpts = {
  //   closeBoxURL: "",
  //   infoBoxClearance: new window.google.maps.Size(24, 24),
  //   pixelOffset: new window.google.maps.Size(-150, -60),
  //   alignBottom: true
  // };

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef<HTMLInputElement>();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef<HTMLInputElement>();

  const { userCoords }: any = useMainContext();
  const center = {
    lat: userCoords?.lat || 19.0645,
    lng: userCoords?.lng || 72.8359,
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen justify-center items-center">
        <h1>Loading...</h1>
      </div>
    );
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
      .then((res) => res.json())
      .then((response) => {
        console.log("User's Location Info: ", response);
      });
  };
  async function getLatLong(address: string) {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBmy2F0EtGGkSn-yEgVMfsjAQ-q3qZW49w`
    );
    const data = await res.json();
    console.log(data.results[0].geometry.location);
    return data.results[0].geometry.location;
  }

  async function calculateRoute() {
    // @ts-ignore
    if (
      originRef?.current?.value === "" ||
      destiantionRef.current.value === ""
    ) {
      console.log("Origin and destination fields must not be empty");
      return;
    } else {
      console.log("hi");
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      // @ts-ignore
      origin: originRef?.current?.value,
      // @ts-ignore
      destination: destiantionRef?.current?.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    console.log(results);

    await sendResult(results);
    setDirectionsResponse(results);
    setDistance(results?.routes[0]?.legs[0]?.distance?.text || "NA");
    setDuration(results?.routes[0]?.legs[0]?.duration?.text || "NA");
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    // @ts-ignore
    originRef.current.value = "";
    // @ts-ignore
    destiantionRef.current.value = "";
  }

  const handleActiveMarker = (marker: number) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  return (
    <div className="flex relative flex-col items-center h-screen w-screen">
      <div className="absolute left-0 top-0 h-full w-full">
        {/* Google Map Box */}
        <GoogleMap
          onClick={() => setActiveMarker(-1)}
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: false,
          }}
          onLoad={(map) => {
            // const trafficLayer = new google.maps.TrafficLayer();
            // trafficLayer.setMap(map);
            setMap(map);
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
                  {/* <div className="flex items-center justify-center">
                      <img src={YouPNG.src || "http://maps.google.com/mapfiles/ms/icons/green-dot.png"} alt="You" className="w-8 h-8" />
                      <span className="text-sm font-semibold text-black">You</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-xs font-semibold text-black">Lat: {center.lat.toFixed(4)}</span>
                      <span className="text-xs font-semibold text-black">Lng: {center.lng.toFixed(4)}</span>
                    </div> */}

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
      <div className="p-4 w-[90%] md:w-70% mx-auto rounded-lg m-4 bg-white shadow-base min-w-fit z-10">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 justify-between">
          <div className="flex-grow-1  flex space-x-2 items-center">
            <Autocomplete className="w-full">
              <input
                ref={originRef}
                className="flex-grow bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                type="search"
                placeholder="Origin"
              ></input>
            </Autocomplete>
            <MdSwapVert
              className={`text-gray-700 w-8 h-8`}
              aria-label="center back"
              onClick={() => {
                if (!originRef.current?.value || !destiantionRef.current?.value)
                  return;
                const temp = originRef.current.value;
                originRef.current.value = destiantionRef.current.value;
                destiantionRef.current.value = temp;
              }}
            />
          </div>
          <div className="flex-grow-1 flex space-x-2 items-center">
            <Autocomplete className="w-full">
              <input
                ref={destiantionRef}
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                type="search"
                placeholder="Destination"
              ></input>
            </Autocomplete>
            <RiSendPlaneFill
              className={`text-green-500 w-8 h-8`}
              aria-label="center back"
              onClick={() => {
                if (!originRef.current.value || !destiantionRef.current.value)
                  return;
                calculateRoute();
              }}
            />
          </div>
        </div>
        {/* <div className="flex space-x-4 mt-4 justify-between w-full">
          <span className='w-[50%]'>Distance: {distance}</span>
          <span className='w-[50%]'>Duration: {duration}</span>
        </div> */}
      </div>

      {/* Menu - ahowing having buttons for parking data, traffic data, carbon efficient data,  and more */}
      {menu && (
        <div
          onClick={() => {
            showMenu(false);
          }}
          className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50"
        >
          <div className="fixed bottom-14 right-14 rounded-md bg-white shadow-md w-[80%] h-32">
            {/* <select 
                className='w-full h-full rounded-md'
                value={selectedOption}
                onChange={(e)=>{
                  setSelectedOption(e.target.value)
                }}
              name="" id="">
                {
                  mapLayerOptions.map((option, index) => (
                    <option
                      key={index}
                      value={option}
                      onClick={() => {
                        setSelectedOption(option)
                      }}
                    >
                      {option}
                    </option>
                  ))
                }
              </select> */}
            Nothing Here!
          </div>
        </div>
      )}

      {/* Floating Btn*/}
      {/* <div className="fixed bottom-4 right-4">
        <BsFillLayersFill
          onClick={() => {
            showMenu(true);
          }}
          className="bg-green-500 hover:bg-green-700 text-white w-10 h-10 p-2 rounded-full"
        />
      </div> */}

      <div className="fixed bottom-4 right-4">
        <BsArrowRight
          onClick={() => {
            goToPool();
          }}
          className="bg-green-500 hover:bg-green-700 text-white w-14 h-14 p-4 rounded-full"
        />
      </div>
    </div>
  );
}

export default Map;
