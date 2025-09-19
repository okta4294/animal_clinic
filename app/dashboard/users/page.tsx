import React from 'react'
import {AddTable} from './_components/add-table'

const page = () => {
  return (
   <div className='grid gap-3 px-6'>
             <h1 className='text-4xl font-bold mt-0'>Users</h1>
       
             <div className='grid gap-1'>
               <AddTable />
             </div>
           </div>
  )
}

export default page
