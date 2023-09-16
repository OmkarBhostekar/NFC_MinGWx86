import React from 'react'
import { AiFillCar } from 'react-icons/ai'
import { GoDotFill } from 'react-icons/go'
import { HiChevronDown } from 'react-icons/hi'
import { TripType } from '@/types/MainTypes'
import { FaUser } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useMainContext } from '@/context/MainContext'
type Props = {
    trip: TripType,
    parent: string
}

const Card = ({ trip, parent }: Props) => {

    const router = useRouter();

    // const { setTrip } : any = useMainContext();

    return (
        <div className='flex flex-col space-y-4 p-2 bg-gray-200 rounded-lg'
            onClick={() => {
                // setTrip(trip)
                router.push(`/trip-detail/${trip?._id}${parent === "my-trips" ? "?from=my-trips" : ""}`)
            }}
        >
            <div className='w-full'>
                <div className='flex items-center justify-between'>
                    <p className='text-sm text-black font-semibold'>Start Time : {trip?.startTime}</p>
                    <p className='text-sm text-black'>Pass : <span className='text-xs text-green-500'>{trip?.member}</span></p>
                </div>
                <div className='flex items-center space-x-1'>
                    <FaUser className="text-green-500 w-3 h-3" />
                    <p className='text-xs font-extralight'>{trip?.createdby}</p>
                </div>
            </div>
            <div className='w-full'>
                <div className='flex items-center space-x-1'>
                    <GoDotFill className="text-green-500 w-3 h-3" />
                    <p className='text-[0.8rem]'>{trip?.source}</p>
                </div>
                <div className='flex items-center space-x-1'>
                    <HiChevronDown className="text-green-500 font-bold w-3 h-3" />
                    <p className='text-[0.8rem]'>{trip?.destination}</p>
                </div>
            </div>
        </div>
    )
}

export default Card