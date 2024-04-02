import React from 'react'
import LibraryTable from '../components/library/LibraryTable'

const Library = ({
  params,
}: {
  params: { organization: string }
}) => {
  return <LibraryTable organization={params.organization} />
}

export default Library
