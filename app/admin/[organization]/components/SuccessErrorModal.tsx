import React from 'react'

const SuccessErrorModal = ({ success = true }) => {
  return (
    <div>
      {success ? (
        <p className="text-green">Event saved successfully 🎉🎉</p>
      ) : (
        <p className="text-red-500">
          Error occurred please try again
        </p>
      )}
    </div>
  )
}

export default SuccessErrorModal
