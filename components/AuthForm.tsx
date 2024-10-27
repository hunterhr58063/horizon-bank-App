"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form
} from "@/components/ui/form"
import { Loader2 } from 'lucide-react'
import { authFormSchema } from '@/lib//utils'
import CustomInput from './CustomInput'
import { useRouter } from 'next/navigation'
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions'
import PlaidLink from './PlaidLink'


const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const formSchema = authFormSchema(type)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            //sign up with App write & create plaid token


            if (type === 'sign-up') {
                const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    address1: data.address1!,
                    city: data.city!,
                    state: data.state!,
                    postalCode: data.postalCode!,
                    dateOfBirth: data.dateOfBirth!,
                    ssn: data.ssn!,
                    email: data.email,
                    password: data.password
                }
                const newUser = await signUp(userData);
                setUser(newUser)
            }
            if (type === 'sign-in') {

                const response = await signIn({
                    email: data.email,
                    password: data.password
                })
                if (response) router.push('/')
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
        setIsLoading(false)

    }
    return (
        <section className='auth-form'>
            <header className='flex flex-col gap-5 md:gap-8'>
                <Link href={'/'} className='cursor-pointer items-center gap-1 flex'>
                    <Image width={34} height={34} src={'/icons/logo.svg'}
                        alt='Horizon Logo'
                    />
                    <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Horizon</h1>
                </Link>
                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className='text-24 lg::text-36 font-semibold text-gray-900'>
                        {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : "Sign Up"}
                        <p className='text-16 font-normal text-gray-600'>
                            {user ? 'Link your account to get started' : 'Please enter your details'}
                        </p>
                    </h1>
                </div>
            </header>
            {user ? (
                <div className="flex flex-col gap-4">
                    <PlaidLink user={user} variant="primary" />
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {type === 'sign-up' && (
                                <>
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} label='First Name' name='firstName' placeholder='Enter Your First Name' />
                                        <CustomInput control={form.control} label='Last Name' name='lastName' placeholder='Enter Your Last Name' />
                                    </div>
                                    <CustomInput control={form.control} label='Address' name='address1' placeholder='Enter Your Address' />
                                    <CustomInput control={form.control} label='City' name='city' placeholder='Enter Your City' />
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} label='State' name='state' placeholder='Example: Rejasthan' />

                                        <CustomInput control={form.control} label='Postal Code' name='postalCode' placeholder='Example: 111101' />
                                    </div>
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} label='Date of Birth' name='dateOfBirth' placeholder='YYYY-MM-DD' />

                                        <CustomInput control={form.control} label='SSN' name='ssn' placeholder='Example: 1234' />
                                    </div>


                                </>
                            )}
                            <CustomInput key={"Email"} control={form.control} label='Email' name='email' placeholder='Enter Your Email' />
                            <CustomInput key={"password"} control={form.control} label='Password' name='password' placeholder='Enter Your Password' />
                            <div className="flex flex-col gap-4">
                                <Button type="submit" className='form-btn' disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className='animate-spin' />&nbsp;
                                            Loading...
                                        </>
                                    ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <footer className='flex justify-center gap-1'>
                        <p className='text-14 font-normal text-gray-600'>{type === 'sign-in' ? "Don't have an account?" : 'Already have an account'} </p>
                        <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
                            className='form-link'>
                            {type === 'sign-in' ? 'Sign up' : 'Sign in'}</Link>
                    </footer>
                </>
            )}
        </section>
    )
}

export default AuthForm
