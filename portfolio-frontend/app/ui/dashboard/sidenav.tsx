import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import { redirect } from 'next/navigation';
import Image from 'next/image';
// import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* <Link
        className="transparent-bg mb-2 flex h-20 items-end justify-center rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-30 flex justify-center items-center">
          <Image
            src="/self1.png" // Path to your image
            alt="Description of the image"
            width={300} // Desired width
            height={300} // Desired height
          />
        </div>
      </Link> */}
      <div className="flex grow flex-row justify-center space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        {/* <div className="custom-bg-grey hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div> */}
        <form action={async () => {
          'use server';
          redirect('/login')
        }}>
          <button className="transparent-bg flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:items-center md:p-2 md:px-3">
            {/* <PowerIcon className="w-6" /> */}
            <div className="hidden md:block">Home</div>
          </button>
        </form>
      </div>
    </div>
  );
}
