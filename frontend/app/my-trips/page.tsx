import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import Card from "@/components/Card"

type Props = {}

const page = (props: Props) => {
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
            Array(10).fill(0).map((obj, idx)=>{
              return <Card key={idx} />
            })
          }
        </div>
      </div>
    </main>
  )
}

export default page