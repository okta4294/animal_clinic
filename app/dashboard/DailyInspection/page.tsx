import React from 'react'
import {AddModal} from './_components/add-modal'
import {AddTable} from './_components/add-table'


const Page = () => {
  return (
    <div className='grid gap-3 px-6'>
      <h1 className='text-4xl font-bold mt-0'>Daily Inspection</h1>

      <div className='grid gap-1'>
        <AddModal />
        <AddTable />
      </div>
    </div>
  )
}

export default Page
