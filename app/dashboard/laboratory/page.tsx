import React from 'react'
import {AddTable} from './_components/add-table'
import {AddModal} from './_components/add-modal'

const page = () => {
  return (
   <div className='grid gap-3 px-6'>
             <h1 className='text-4xl font-bold mt-0'>Laboratory Test</h1>
       
             <div className='grid gap-1'>
             <AddModal />
             <AddTable />
             </div>
           </div>
  )
}

export default page
