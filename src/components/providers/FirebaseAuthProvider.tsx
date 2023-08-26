'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { FirebaseOptions, initializeApp } from 'firebase/app'
import { Firestore, getFirestore } from 'firebase/firestore'
import {
    onAuthStateChanged,
    User as FirebaseUser,
    getAuth,
    IdTokenResult,
    signInAnonymously,
    Auth
} from 'firebase/auth'
import { usePathname } from 'next/navigation'

let fbToken: IdTokenResult | undefined

const firebaseOptions: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID
}

const firebaseApp = initializeApp(firebaseOptions)
export const firebaseAuth = getAuth(firebaseApp)
export const firebaseDb = getFirestore(firebaseApp)

export const getFirebaseToken = async () => {
    try {
        const user = firebaseAuth.currentUser

        if (user) {
            if (!fbToken || new Date(fbToken.expirationTime).getTime() < Date.now()) {
                return await user.getIdTokenResult(true)
            }

            return fbToken
        } else {
            return null
        }
    } catch (e) {
        console.error(e)
        return
    }
}

export interface IFirebaseAuthContext {
    auth: Auth
    storage: Firestore
}

export const FirebaseAuthContext = createContext<IFirebaseAuthContext | undefined>(undefined)

export interface IFirebaseAuthProvider {
    children: ReactNode
}

export const FirebaseAuthProvider = (props: IFirebaseAuthProvider) => {
    const currentPage = usePathname()
    const [checkLoginFlag, setCheckLoginFlag] = useState(false)

    const checkLogin = useCallback(async (user: FirebaseUser | null) => {
        if (!user) {
            await signInAnonymously(firebaseAuth)
            setCheckLoginFlag(true)
        }
    }, [])

    useEffect(() => {
        const listenerCleaner = onAuthStateChanged(firebaseAuth, (user) => {
            setCheckLoginFlag(false)
            checkLogin(user)
        })

        return () => {
            listenerCleaner()
        }
    }, [checkLogin, currentPage])

    return (
        <FirebaseAuthContext.Provider
            value={{
                auth: firebaseAuth,
                storage: firebaseDb
            }}
        >
            {checkLoginFlag ? props.children : <></>}
        </FirebaseAuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(FirebaseAuthContext)

    if (!ctx) {
        throw new Error('Auth Context not found!')
    }

    return ctx
}
