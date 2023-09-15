import React from 'react'
import { AiFillCar } from 'react-icons/ai'
import { GoDotFill } from 'react-icons/go'
import { HiChevronDown } from 'react-icons/hi'
type Props = {}

const Card = (props: Props) => {
    return (
        <div className='flex flex-col space-y-4 p-2 bg-gray-200 rounded-lg'>
            <div className='w-full'>
                <div className='flex items-center justify-between'>
                    <p className='text-sm text-black font-semibold'>2:30 PM</p>
                    <p className='text-sm text-black'>Pass : <span className='text-xs text-green-500'>4</span></p>
                </div>
                <div className='flex items-center space-x-1'>
                    <AiFillCar className="text-green-500 w-3 h-3" />
                    <p className='text-xs font-extralight'>26 march, 2023</p>
                </div>
            </div>
            <div className='w-full'>
                <div className='flex items-center space-x-1'>
                    <GoDotFill className="text-green-500 w-3 h-3" />
                    <p className='text-[0.8rem]'>Mumbai, Maharashtra</p>
                </div>
                <div className='flex items-center space-x-1'>
                    <HiChevronDown className="text-green-500 font-bold w-3 h-3" />
                    <p className='text-[0.8rem]'>Nagpur, Maharashtra</p>
                </div>
            </div>
        </div>
    )
}

export default Card