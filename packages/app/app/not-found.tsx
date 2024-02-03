import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-gray-100 text-gray-800 flex flex-col items-center justify-center h-screen">
      <h2 className="text-4xl font-bold mb-4">404: Not Found</h2>
      <p className="text-lg mb-6">
        Could not find the requested resource.
      </p>
      <Link href="/">
        <p className="px-6 py-3 bg-blue-500  rounded-full hover:bg-blue-700 transition-colors">
          Return Home
        </p>
      </Link>
    </div>
  )
}
