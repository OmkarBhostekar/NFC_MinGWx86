'use client'

import React from 'react'
import { MainContextProvider } from './MainContext'

type Props = {}

const Providors = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <MainContextProvider>
            {children}
        </MainContextProvider>
    )
}

export default Providors