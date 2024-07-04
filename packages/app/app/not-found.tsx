import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h2 className="mb-4 text-4xl font-bold">404: Not Found</h2>
      <p className="mb-6 text-lg">Could not find the requested resource.</p>
      <Link href="/">
        <p className="bg-blue-500 hover:bg-blue-700 rounded-full px-6 py-3 transition-colors">
          Return Home
        </p>
      </Link>
    </div>
  );
}
