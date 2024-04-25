import StreamethLogoGray from '@/lib/svg/StreamethLogoGray'
import Image from 'next/image'
import Link from 'next/link'

const items = {
  // about: {
  //   item: 'About us',
  //   href: 'https://streameth.org',
  // },
  // contact: {
  //   item: 'Contact',
  //   href: 'https://streameth.org/#team',
  // },
  // docs: {
  //   item: 'Docs',
  //   href: 'https://streameth.notion.site/a473a629420b4942904c851155a18c9b?v=4a29b97e7fd94bbbb38269cb808d3ac4',
  // },
  privacy: {
    item: 'Privacy',
    href: '/privacy',
  },
  terms: {
    item: 'Terms',
    href: '/terms',
  },
}

const Footer = ({ active }: { active?: string }) => {
  const year = new Date().getFullYear()

  return (
    <footer className="flex flex-wrap justify-center items-center mt-5 mb-3 space-y-2 md:mb-5 z-[99999999]">
      <StreamethLogoGray height={25} className="mb-2" />
      {/* Visible only on small screens */}
      <div className="flex justify-center w-full text-sm text-gray-500 md:hidden">
        © {year} StreamETH International B.V.
      </div>
      {/* Visible on larger screens */}
      <div className="hidden text-sm text-gray-500 md:block">
        © {year} StreamETH International B.V. |
      </div>
      {Object.entries(items).map(([key, { item, href }]) => (
        <Link
          key={key}
          href={href}
          className={`mx-1 text-sm ${
            active === key ? 'font-bold' : 'font-light'
          } text-gray-500 underline hover:no-underline`}>
          {item}
        </Link>
      ))}
    </footer>
  )
}

export default Footer
