import StreamethLogoGray from '@/lib/svg/StreamethLogoGray';
import Image from 'next/image';
import Link from 'next/link';

const items = {
  // about: {
  //   item: 'About us',
  //   href: 'https://info.streameth.org',
  // },
  // contact: {
  //   item: 'Contact',
  //   href: 'https://info.streameth.org/#team',
  // },
  data_request: {
    item: 'Data Request',
    href: '/data-request',
  },
  privacy: {
    item: 'Privacy',
    href: '/privacy',
  },
  terms: {
    item: 'Terms',
    href: '/terms',
  },
};

const Footer = ({ active }: { active?: string }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col justify-center items-center px-4 mt-5 mb-3 space-y-2 md:px-0 md:mb-5 z-[99999999]">
      <a className="mb-2 cursor-pointer" href="/">
        <StreamethLogoGray height={25} className="" />
      </a>
      <div className="flex items-center">
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
            } text-gray-500 underline hover:no-underline`}
          >
            {item}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
