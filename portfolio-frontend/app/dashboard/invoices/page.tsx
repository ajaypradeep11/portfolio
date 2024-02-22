import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { inter, kanit } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
import Image from 'next/image';
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  console.log(query)
  return (
    <div className="flex w-full ">
      <div className="w-1/2 max-w-[500px]">
        <div className="w-full flex items-center justify-center sm:flex-row mt-5">
          <div className="relative mx-auto flex w-full max-w-[800px] flex-col space-y-2.5 p-4 z-10">
            <h1 className={`${kanit.className}  mb-3 text-4xl text-white  -ml-5`}>Skills 🛠️</h1>
            <div className="mt-3">
              <h2 className={`${kanit.className}  mb-3 text-2xl text-white  -ml-5`}>Frontend development 🖌️</h2>
              <p className="mb-3 text-white">
                HTML - CSS - JavaScript - TypeScript - React.js - Next.js
              </p>
            </div>
            <div className="mt-3">
              <h2 className={`${kanit.className} mt-3 mb-3 text-2xl text-white  -ml-5`}>Backend development ⚙️</h2>
              <p className="mb-3 text-white">
                trpc - Java - DWR - Spring Boot - NestJS
              </p>
            </div>
            <div className="mt-3">
              <h2 className={`${kanit.className} mt-3 mb-3 text-2xl text-white  -ml-5`}>Database 🗄️</h2>
              <p className="mb-3 text-white">
                PostgreSQL - MySQL - Elasticsearch - Firebase - SQLite
              </p>
            </div>
            <div className="mt-3">
              <h2 className={`${kanit.className} mt-3 mb-3 text-2xl text-white  -ml-5`}>Devops 🤖</h2>
              <p className="mb-3 text-white">
                Bitbucket - GitLab CI/CD - Jenkins - Docker
              </p>
            </div>
            <div className="mt-3">
              <h2 className={`${kanit.className} mt-3 mb-3 text-2xl text-white  -ml-5`}>Cloud ☁️</h2>
              <p className="mb-3 text-white">
                Google Cloud Platform
              </p>
            </div>
            <div className="mt-3">
              <h2 className={`${kanit.className} mt-3 mb-3 text-2xl text-white  -ml-5`}>Networking 🌐</h2>
              <p className="mb-3 text-white">
                DNS - Networking Configuration
              </p>
            </div>
            {/* <Image className='technologies' src="/step1.png" alt="Frontend development" width={100} height={100} /> */}
          </div>
        </div>
      </div>

      <div className={`${kanit.className} w-3/4 max-w-[1000px] overflow-auto`}>
        <div className="w-full  flex items-center sm:flex-row p-4">
          <div className={`${kanit.className}  mb-3 text-3xl text-white font-thin mt-5`}>
            <h4 className=" font-light mb-2">Experience</h4>
          </div>
        </div>
        <a href='https://www.lawyerconveyance.ca/' target="_blank">
        <div className="w-full flex custom-bg-grey rounded ">
          <div className="w-1/2 ">
            <div className="ml-4 p-4 mb-4 text-1xl text-white">
              <h1 className="text-white">
                Full Stack Developer
              </h1>
              <h1 className="text-white">
                2023 - Present
              </h1>
              <h1 className="text-white">
                Full Time
              </h1>
              <h1 className="mb-3 text-white">
                Sarnia, Ontario, Canada
              </h1>
            </div>
          </div>
          <div className="w-3/4 ">
            <div className="ml-4 p-4 mb-4 text-1xl text-white">
              <h1 className="mb-3 text-white">
                -  Lando Limited - LCS (Lawyer Conveyance System)
              </h1>
              {/* <p className="mb-3 ml-3 text-white">
                Developed and maintained the front-end and back-end of the web application.
            </p> */}
            </div>
          </div>
        </div>
        </a>
        <a href='https://thelocalninja.com/' target="_blank">
        <div className="w-full mt-5 flex custom-bg-grey rounded ">
          <div className="w-1/2 ">
            <div className="ml-4 p-4 mb-4 text-1xl text-white">
              <h1 className="text-white">
                Lead Developer - Operating Manager
              </h1>
              <h1 className=" text-white">
                2024 - Present
              </h1>
              <h1 className="text-white">
                Freelance
              </h1>
              <h1 className="mb-3 text-white">
                Ottawa, Ontario, Canada
              </h1>
            </div>
          </div>
          <div className="w-3/4 ">
            <div className="ml-4 p-4 mb-4 text-1xl text-white">
              <h1 className="mb-3 text-white">
                -  The Local Ninja (E-Commerce Platform)
              </h1>
              {/* <p className="mb-3 ml-3 text-white">
                Developed and maintained the front-end and back-end of the web application.
            </p> */}
            </div>
          </div>
        </div>
        </a>
        <a href='http://about.consultarer.com/' target="_blank">
        <div className="w-full mt-5 flex custom-bg-grey rounded">
          <div className="w-1/2 ">
            <div className="ml-4 p-4 mb-4 text-1xl text-white">
              <h1 className="text-white">
                Software Engineer
              </h1>
              <h1 className=" text-white">
                2023 - 2024
              </h1>
              <h1 className="text-white">
                Part Time
              </h1>
              <h1 className="mb-3 text-white">
                Ottawa, Ontario, Canada
              </h1>
            </div>
          </div>
          <div className="w-3/4 ">
            <div className="ml-4 p-4 mb-4 text-1xl text-bold text-white">
              <h1 className="mb-3 text-white">
                -  Consultarer 
              </h1>
              {/* <p className="mb-3 ml-3 text-white">
                Developed and maintained the front-end and back-end of the web application.
            </p> */}
            </div>
          </div>
        </div>
        </a>
        <div className="w-full mt-5 flex custom-bg-grey rounded">
          <div className="w-1/2 ">
            <div className="ml-4 p-4 mb-4 text-1xl text-white">
              <h1 className="text-white">
              Developer
              </h1>
              <h1 className=" text-white">
                2020 - 2021
              </h1>
              <h1 className="text-white">
                Full Time
              </h1>
              <h1 className="mb-3 text-white">
                Chennai, Tamil Nadu, India
              </h1>
            </div>
          </div>
          <div className="w-3/4 ">
            <div className="ml-4 p-4 mb-4 text-1xl text-white">
              <h1 className="mb-3 text-white">
                -  Inlustro Learning Private Limited
              </h1>
              {/* <p className="mb-3 ml-3 text-white">
                Developed and maintained the front-end and back-end of the web application.
            </p> */}
            </div>
          </div>
        </div>
        <div className="w-full mt-5 flex custom-bg-grey rounded">
          <div className="w-1/2 ">
            <div className="ml-4 p-4 mb-4 text-1xl text-white">
              <h1 className="text-white">
              Trainee engineer - Development
              </h1>
              <h1 className=" text-white">
                2018 - 2020
              </h1>
              <h1 className="text-white">
                Full Time
              </h1>
              <h1 className="mb-3 text-white">
                Chennai, Tamil Nadu, India
              </h1>
            </div>
          </div>
          <div className="w-3/4 ">
            <div className="ml-4 p-4 mb-4 text-1xl text-white">
              <h1 className="mb-3 text-white">
                -  Infoview Technologies Private Limited
              </h1>
              {/* <p className="mb-3 ml-3 text-white">
                Developed and maintained the front-end and back-end of the web application.
            </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}