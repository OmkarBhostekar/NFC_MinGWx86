import Image from 'next/image'
import Hero from '@/components/Hero'
import Map from '@/components/Map'
import GetLocation from '@/components/GetLocation'

export default function Home() {
  return (
    <>
     {/* <Hero /> */}
     <GetLocation />
     <Map />
    </>
  )
}
