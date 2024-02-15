import Image from 'next/image'
import Link from 'next/link'

const items = {
  about: {
    item: 'About us',
    href: 'https://info.streameth.org',
  },
  contact: {
    item: 'Contact',
    href: 'https://info.streameth.org/#team',
  },
  docs: {
    item: 'Docs',
    href: 'https://streameth.notion.site/a473a629420b4942904c851155a18c9b?v=4a29b97e7fd94bbbb38269cb808d3ac4',
  },
  privacy: {
    item: 'Privacy',
    href: 'https://streameth.org/privacy',
  },
  terms: {
    item: 'Terms',
    href: 'https://streameth.org/terms',
  },
}

const Footer = ({ active }: { active?: string }) => {
  const year = new Date().getFullYear()

  return (
    <footer className="flex flex-wrap justify-center items-center mt-5 mb-3 md:mb-5 z-[99999999]">
      <Image
        className="hidden mr-2 md:block"
        src="/logo.png"
        alt="Streameth logo"
        width={30}
        height={30}
      />
      {/* Visible only on small screens */}
      <div className="flex justify-center pb-1 w-full text-sm text-black md:hidden">
        © {year} StreamETH International B.V.
      </div>
      {/* Visible on larger screens */}
      <div className="hidden text-sm text-black md:block">
        © {year} StreamETH International B.V.
      </div>
      {Object.entries(items).map(([key, { item, href }]) => (
        <Link
          key={key}
          href={href}
          className={`mx-2 text-sm ${
            active === key ? 'font-bold' : 'font-light'
          } text-black underline hover:no-underline`}>
          {item}
        </Link>
      ))}
    </footer>
  )
}

export default Footer
