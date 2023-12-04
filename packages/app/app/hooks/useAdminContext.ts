import React from 'react'
import { EventFormContext } from '../admin/[organization]/components/EventFormContext'

const UseAdminContext = () => {
  const context = React.useContext(EventFormContext)
  if (!context) {
    throw new Error(
      `useAdminContext must be used within a EventFormContext`
    )
  }
  return context
}

export default UseAdminContext
