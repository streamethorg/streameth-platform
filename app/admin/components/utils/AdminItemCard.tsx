import React, { ReactNode } from 'react'

const AdminItemCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border p-2 rounded bg-white ">{children}</div>
  )
}

export default AdminItemCard
