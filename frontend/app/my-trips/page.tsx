'use client'
import React, { useEffect, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import Card from "@/components/Card"

type Props = {}

const MyTrips = (props: Props) => {


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

  return (
    <main className='flex relative flex-col items-center h-screen w-screen overflow-auto bg-white'>
      <div className="w-full p-4 flex items-center space-x-2 sticky top-0 bg-white shadow-lg">
        <IoIosArrowBack className="w-6 h-6 text-black" />
        <p className='text-black text-lg font-bold'>My List</p>
      </div>
      <div
        className='w-full p-4'
      >
        <div
          className='flex flex-col w-full space-y-2 text-black'
        >
          {
            trips && trips.map((obj, idx) => {
              return <Card key={idx} trip={obj} />
            })
          }
        </div>
      </div>
    </main>
  )
}

export default MyTrips