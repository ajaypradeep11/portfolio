import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { inter, kanit } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
export default async function Page() {
  const { totalPaidInvoices, totalPendingInvoices, numberOfInvoices, numberOfCustomers } = await fetchCardData();
  return (
    <main>
      <h1 className={`${inter.className} mb-4 text-xl md:text-2xl text-white`}>
        {/* Dashboard */}
      </h1>
      <div className="custom-bg w-full h-screen flex items-center justify-center sm:flex-row">
        <div className="relative mx-auto flex w-full max-w-[800px] flex-col space-y-2.5 p-4 md:-mt-48 z-10">
          <h1 className={`${kanit.className}  mb-3 text-7xl text-white text-center -ml-5`}>I develop and design products</h1>
        </div>
      </div>

      <div className="custom-bg w-full flex items-center max-w-[1400px] justify-center sm:flex-row p-4">
        <div className={`${kanit.className}   mb-3 text-3xl text-white font-thin -ml-5`}>
          <h4 className=" font-light mb-2">About</h4>
          <p className="text-2xl mb-6">
            Hey there! 👋 I'm Ajay Pradeep, a versatile full-stack developer on a mission to craft seamless digital experiences.
          </p>
          <p className="text-2xl mb-6">
            Currently, my tech playground revolves around JavaScript and TypeScript, where I dive deep into Firebase NoSQL databases, wield the power of Google Cloud Functions for serverless architectures, and orchestrate smooth CI/CD pipelines with Bitbucket. 🚀 I'm also delving into the world of Docker containers to amplify deployment efficiency.
          </p>
          <p className="text-2xl mb-6">
            In my previous roles, I specialized in Java and Spring development. I managed deployments using Jenkins and handled PostgreSQL databases with ease. 📦
          </p>
          <p className="text-2xl mb-6">
            Always hungry for knowledge, I'm currently immersing myself in Google Cloud Platform and sharpening my networking skills for Google Cloud Run and cloud networking. 🌐
          </p>
          <p className="text-2xl mb-6">
            When I'm not coding, you'll find me indulging in some intense gaming sessions, battling it out in Warzone, Overwatch, or hitting the pitch in Rocket League. 🎮 On quieter days, I love capturing moments through my lens, so be sure to check out my photography portfolio in the dedicated tab! 📷
          </p>
          <p className="text-2xl mb-6">
            Additionally, when I need to unwind, you'll catch me cruising through the night with my tunes playlist, KDM Machine, perfect for those late-night drives. 🚗💨
          </p>
          <p className="text-2xl mb-6">
            Curious to learn more? Feel free to check out my resume! 📄
          </p>
          <br></br>
          {/* <div className="text-2xl links" data-aos="fade-up"> */}
            <button className="bg-blue-600 text-base text-2x1 text-gray-200 hover:bg-blue-700 py-3 px-5 rounded">
              Download resume
            </button>
          {/* </div> */}
        </div>
      </div>
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>

      </div> */}
    </main>
  );
}