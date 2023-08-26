'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useAuth } from './FirebaseAuthProvider'

export interface IFirebaseDataContext {}

export const FirebaseDataContext = createContext<IFirebaseDataContext | undefined>(undefined)

export interface IFirebaseDataProvider {
    children: ReactNode
}

export const FirebaseDataProvider = (props: IFirebaseDataProvider) => {
    const { auth, storage } = useAuth()

    const [checkSubscriberFlag, setCheckSubscriberFlag] = useState(false)

    const subscriber = (user) => {}

    useEffect(() => {
        const listenerCleaner = onAuthStateChanged(auth, (user) => {
            setCheckSubscriberFlag(false)
            subscriber(user)
        })

        return () => {
            listenerCleaner()
        }
    }, [auth])

    return (
        <FirebaseDataContext.Provider value={{}}>
            {checkSubscriberFlag ? props.children : <></>}
        </FirebaseDataContext.Provider>
    )
}

export const useData = () => {
    const ctx = useContext(FirebaseDataContext)

    if (!ctx) {
        throw new Error('Data Context not found!')
    }

    return ctx
}
