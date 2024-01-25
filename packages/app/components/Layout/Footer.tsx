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
    href: '#',
  },
  terms: {
    item: 'Terms',
    href: 'https://streameth.notion.site/StreamETH-International-B-V-Terms-and-Conditions-4d6c7924134c4b2886bd171d2bad0966',
  },
}

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="flex justify-center items-center mb-5 z-[99999999]">
      <Image
        className="hidden lg:block"
        src="/logo.png"
        alt="Streameth logo"
        width={30}
        height={30}
      />
      <div className="mx-2 text-sm text-black">
        © {year} StreamETH International B.V.
      </div>
      {Object.entries(items).map(([key, { item, href }]) => (
        <Link
          key={key}
          href={href}
          className="mx-2 text-sm font-light text-black underline">
          {item}
        </Link>
      ))}
    </footer>
  )
}

export default Footer
