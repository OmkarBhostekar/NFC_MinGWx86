'use client'

import { useMainContext } from '@/context/MainContext';
import React, { useEffect, useState } from 'react'

const GetLocation = () => {
    // const [latitude, setLatitude] = useState<number>(0);
    // const [longitude, setLongitude] = useState<number>(0);

    // const fetchApiData = (latitude:number, longitude:number) => {
    //     fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`)
    //     .then(res => res.json())
    //     .then(response => {
    //         console.log("User's Location Info: ", response)
    //     })
    //     .catch((status) => {
    //         console.log('Request failed.  Returned status of', status)
    //     })
    // };

    const { setUserCoords }: any = useMainContext();

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                console.log(`${lat}, ${long}`);
                setUserCoords({
                    lat,
                    lng: long
                })
            },
                error => {
                    console.error(error);
                    // setLocation('Unable to retrieve your location');
                }
            );
        } else {
            alert("Geolocation not supported")
        }

    }, []);

    return (
        <></>
    )
}

export default GetLocation