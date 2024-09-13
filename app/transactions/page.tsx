"use client"

import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { transactionTableColumns } from '../constants'
import axios from 'axios'
import { io } from "socket.io-client"
import moment from 'moment'
import Link from 'next/link'
import Footer from '../components/Footer'

const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  reconnection: true
})
const page = () => {
  const [transacs, setTransacs]: any = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState(false)
  useEffect(() => {
    console.log("Socket", socket)
  })
  useEffect(() => {
    fetchTransactions()
  }, [])
  useEffect(() => {
    socket.on("new-transaction", (transactions) => {
      setTransacs(transactions)
    })
  })

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:8282/api")
      setTransacs(res.data)
      setIsLoading(false)
    } catch (err) {
      console.log(err)
      setIsLoading(false)
    }
  }

  const toggleStatus = () => {
    setStatus(!status)
  }
  return (
    <>
      <div>
        <Navbar />
        <div className='mt- px-[10vh] pt-[10vh] pb-[5vh]'>
          <section className="bg-white  rounded-xl dark:bg-gray-900">
            <div className="max-w-screen-xl px-4 h-[30vh] py-8 mx-auto ">
              <h1 className='px-[10vw] py-12 text-3xl text-center font-bold'>All Transactions</h1>
              <form className="max-w-md mx-auto">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                  <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
                  <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                </div>
              </form>

            </div>
          </section>
        </div>
        <div>
          <div className='px-[10vw]'>
            <div>
              <div>
                <div>
                  <button onClick={() => toggleStatus()} className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Status</button>
                </div>
                <div className={status ? "flex flex-col z-20 gap-4 bg-black h-24 transition delay-200 px-4 rounded-md" : "h-0 transition hidden"}>
                  <div className=''>
                    <input type="checkbox" />
                    Confirmed
                  </div>
                  <div>
                    <input type="checkbox" />
                    Not Confirmed
                  </div>
                </div>
              </div>
            </div>


            {
              isLoading ? <div className='flex items-center justify-center h-[5vh] text-md'>Loading ...</div> :
                <div className="relative my-4 overflow-x-auto shadow-md sm:rounded-lg h-[60vh] overflow-y-scroll">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="p-4">
                          <div className="flex items-center">
                            <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                          </div>
                        </th>
                        {
                          transactionTableColumns.map((val) => <th key={val} scope="col" className="px-6 py-3">
                            {val}
                          </th>)
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        transacs.map((t: any) =>
                          <tr key={t.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="w-4 p-4">
                              <div className="flex items-center">
                                {/* <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"> */}
                                <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                              </div>
                            </td>

                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                             
                            <Link href={'/transactions/'+t?.id}> {t.id}</Link>
                            </th>
                            <td className="px-6 py-4">
                              <Link href={'/transactions/'+t?.id}>
                              {t.sender}</Link>
                            </td>
                            <td className="px-6 py-4">
                            <Link href={'/transactions/'+t?.id}> {t.receiver}</Link>
                            </td>
                            <td className="px-6 py-4">
                            <Link href={'/transactions/'+t?.id}> {t.value}</Link>
                            </td>
                            <td className="px-6 py-4">
                            <Link href={'/transactions/'+t?.id}> {moment(parseInt(t.timeStamp)).format('MMMM Do YYYY, h:mm:ss a')}</Link>
                              
                            </td>
                            {/* <td className="flex items-center px-6 py-4">
                              <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                              <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3">Remove</a>
                            </td> */}
                          </tr>)
                      }

                    </tbody>
                  </table>
                </div>
            }


          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default page