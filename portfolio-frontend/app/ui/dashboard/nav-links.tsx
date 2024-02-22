'use client';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'About me', href: '/dashboard'},
  {
    name: 'Work Experience',
    href: '/dashboard/invoices',
  },
  { name: 'Development Projects', href: '/dashboard/devprojects' },
  { name: 'Design Projects', href: '/dashboard/designprojects' },
  { name: 'Misc', href: '/dashboard/misc' },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        // const LinkIcon = link.icon;
        return (
           <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] transparent-bg grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-800 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            {/* <LinkIcon className="w-6" /> */}
            <p className="md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
