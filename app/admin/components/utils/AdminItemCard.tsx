import React, { ReactNode } from 'react'

const AdminItemCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border p-2 rounded bg-white min-w-[270px] w-[270px] h-[190px]">
      {children}
    </div>
  )
}

export default AdminItemCard
