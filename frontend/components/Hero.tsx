import React from 'react'

type Props = {}

const Hero = (props: Props) => {
    return (
        <section className="w-full bg-white my-bg-color sm:pl-12 sm:pr-12 pt-12">
            {/* <GetLocation /> */}
            <div className="grid px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                <div className="mr-auto place-self-center lg:col-span-7">
                    <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                        Predict your{" "}
                        <span className="underline underline-offset-3  decoration-4 sm:decoration-8 decoration-[#ff6f2a]">
                            flight prices
                        </span>{" "}
                        at one place
                    </h1>
                    <p className="max-w-2xl mb-6 font-light text-gray-500 md:text-lg lg:text-xl dark:text-gray-400">
                        Flycast is an innovative flight price predicting website that uses ML to analyze data and predict future prices.
                        With a user-friendly interface and price comparison tool, and exclusive deals, Flycast helps travelers save money on their travel expenses.
                        Click on following button to get more info...
                    </p>
                    <a
                        href="#services"
                        className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg my-btn-color"
                    >
                        More Info...
                    </a>
                    {/* <a
            href="#"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Speak to Sales
          </a> */}
                </div>
                <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                    {/* <img
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
            alt="hero"
          /> */}
                    {/* <Lottie options={DefaultOptions} height={400} width={500} /> */}
                    {/* <img src={Flight.src}/> */}
                </div>
            </div>
        </section>
    )
}

export default Hero