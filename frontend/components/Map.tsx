"use client";

import { MdSwapVert } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";
import {
  BsArrowBarRight,
  BsArrowRight,
  BsFillLayersFill,
} from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import YouPNG from '@/assets/map/you.png'
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  InfoBox,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'
import { useMainContext } from '@/context/MainContext'
import Slider from './Slider'
import CameraIcon from '@/assets/map/camera.png'
import { GiPathDistance } from 'react-icons/gi'
import { BsClockHistory } from 'react-icons/bs'
import { useRouter } from "next/navigation";
import { AiFillAlert } from "react-icons/ai";
import Hospital from "@/assets/map/hospital.png";
import PoliceCar from "@/assets/map/police-car.png";
import { HiClipboardDocumentList } from 'react-icons/hi2'
// import Police from "@/assets/map/police.png";

function Map() {
  const router = useRouter();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyBmy2F0EtGGkSn-yEgVMfsjAQ-q3qZW49w",
    libraries: ['places'],
  })

  const [ecoRoute, setEcoRoute] = useState(false)

  const [map, setMap] = useState<google.maps.Map | null>(
    /** @type google.maps.Map */ null
  );
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const [activeMarker, setActiveMarker] = useState(-1);
  const [infoDomReady, setInfoDomReady] = useState(false);

  const [doctorAlert, setDoctorAlert] = useState(false);
  const [policeAlert, setPoliceAlert] = useState(false);

  const [markers, setMarkers] = useState<{
    longitude: number,
    latitude: number,
    img: string,
    desc: string
  }[]>([])

  const [docMarkers, setDocMarkers] = useState<{
    longitude: number,
    latitude: number,
  }[]>([])

  const [polMarkers, setPolMarkers] = useState<{
    longitude: number,
    latitude: number,
  }[]>([])

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

  async function getLatLong(address: string) {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBmy2F0EtGGkSn-yEgVMfsjAQ-q3qZW49w`
    );
    const data = await res.json();
    console.log(data.results[0].geometry.location);
    return data.results[0].geometry.location;
  }


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
  // const center = { lat: userCoords?.lat || 19.0645, lng: userCoords?.lng || 72.8359 }

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
      .then(res => res.json())
      .then(response => {
        console.log("User's Location Info: ", response)
        setMarkers(response?.data)
      })

  }

  async function calculateRoute() {
    // @ts-ignore
    if (
      originRef?.current?.value === "" ||
      destiantionRef?.current?.value === ""
    ) {
      console.log("Origin and destination fields must not be empty");
      return;
    } else {
      console.log("hi");
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    try {
      const results = await directionsService.route({
        // @ts-ignore
        origin: originRef?.current?.value,
        // @ts-ignore
        destination: destiantionRef?.current?.value,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true
      })
      console.log(results)

      await sendResult(results)
      setDirectionsResponse(results)
      setDistance(results?.routes[0]?.legs[0]?.distance?.text || "NA")
      setDuration(results?.routes[0]?.legs[0]?.duration?.text || "NA")
    } catch (e) {
      alert("No route could be found between the origin and destination.")
      console.log(e)
    }
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

  const handleAlert = ()=>{
    fetch(`/api/get-coords`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doc: doctorAlert,
        pol: policeAlert,
        lat: userCoords?.lat,
        lng: userCoords?.lng,
      }),
    })
    .then((e)=> e.json())
    .then((data)=>{
      console.log("Coords", data)
      setDocMarkers(data?.doc?.map((e : any)=>{
        return {
          longitude: e.geometry.location.lng,
          latitude: e.geometry.location.lat,
        }
      }))
      setPolMarkers(data?.pol?.map((e : any)=>{
        return {
          longitude: e.geometry.location.lng,
          latitude: e.geometry.location.lat,
        }
      }))
    })
  }

  return (
    <div className="flex relative flex-col items-center h-screen w-screen">
      <div className="absolute left-0 top-0 h-full w-full">
        {/* Google Map Box */}
        <GoogleMap
          onClick={() => setActiveMarker(-1)}
          center={userCoords}
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
            setMap(map);
          }}
        >
          <Marker
            onClick={() => handleActiveMarker(0)}
            position={userCoords}
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
          {
            docMarkers?.map((marker, index) => (
              <Marker
                key={index}
                onClick={() => handleActiveMarker(index + 1)}
                position={{ lat: marker.latitude, lng: marker.longitude }}
                icon={Hospital.src || "http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
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
                      </div>
                    </InfoBox>
                  )
                }
              </Marker>
            ))
          }
          {
            polMarkers?.map((marker, index) => (
              <Marker
                key={index}
                onClick={() => handleActiveMarker(index + 1)}
                position={{ lat: marker.latitude, lng: marker.longitude }}
                icon={PoliceCar.src || "http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
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
                      </div>
                    </InfoBox>
                  )
                }
              </Marker>
            ))
          }

          {directionsResponse && (
            <DirectionsRenderer routeIndex={
              ecoRoute ? 1 : 0
            }
             directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      <div className="p-4 w-[90%] md:w-70% mx-auto rounded-lg m-4 bg-white shadow-lg min-w-fit z-10 relative">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 justify-between">
          <div className="flex-grow-1  flex space-x-2 items-center">
            <Autocomplete
              onPlaceChanged={() => {
                console.log('Place Changed')
              }}
              className='w-full'
            >
              <input ref={originRef} className="flex-grow bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="search" placeholder='Origin'></input>
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
                if (!originRef.current?.value || !destiantionRef.current?.value) return;
                calculateRoute()
              }} />
          </div>
        </div>
        {
          distance && duration && (
            <div className="flex space-x-4 mt-4 justify-between w-full text-black">
              <span className='w-[50%] flex items-center truncate'><GiPathDistance className="w-5 h-5 mr-1 text-green-500" />{distance}</span>
              <span className='w-[50%] flex items-center truncate'><BsClockHistory className="w-5 h-5 mr-1 text-green-500" />{duration}</span>
            </div>
          )
        }
        {
          directionsResponse && directionsResponse?.routes?.length > 1 && (
            <div
              className={`absolute top-[102%] left-0 w-fit flex items-center justify-center ${ecoRoute ? "bg-green-500 text-white" : "bg-white text-green-500"} rounded-full py-1 px-2 text-sm cursor-pointer`}
              onClick={() => {
                setEcoRoute(!ecoRoute)
              }}
            >
              Eco Route
            </div>
          )
        }
      </div>

      {/* Menu - ahowing having buttons for parking data, traffic data, carbon efficient data,  and more */}
      {menu && (
        <div
          // onClick={() => {
          //   showMenu(false);
          // }}
          className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 z-10"
        >
          <div
            onClick={() => {
              showMenu(false);
            }}
            className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 -z-10" />
          <div className="fixed bottom-14 left-14 right-14 rounded-md bg-white text-black shadow-md">
            <div className="flex flex-col space-y-2 p-6">
              <div className="flex space-x-2 items-center">
                <input id="doc" checked={doctorAlert} type="checkbox" className="w-4 h-4" onChange={(e) => { setDoctorAlert(e.target.checked) }} />
                <label htmlFor="doc" className="text-black font-semibold text-lg">Doctor</label>
              </div>
              <div className="flex space-x-2 items-center">
                <input id="pol" checked={policeAlert} type="checkbox" className="w-4 h-4" onChange={(e) => { setPoliceAlert(e.target.checked) }} />
                <label htmlFor="pol" className="text-black font-semibold text-lg">Police</label>
              </div>
              <div className="flex space-x-2 items-center w-full justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(doctorAlert, policeAlert)
                    handleAlert()
                    showMenu(false)
                  }}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Btn*/}
      <div className="fixed bottom-4 left-4">
        <AiFillAlert
          onClick={() => {
            showMenu(true);
          }}
          className="bg-red-500 hover:bg-red-700 text-white w-10 h-10 p-2 rounded-full"
          style={{ boxShadow: "red 0px 0px 31px 2px" }}
        />
      </div>
      <div className="fixed bottom-4 left-20">
        <HiClipboardDocumentList
          onClick={() => {
            router.push("/my-trips")
          }}
          className="bg-green-500 hover:bg-green-700 text-white w-10 h-10 p-2 rounded-full"
        />
      </div>

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
