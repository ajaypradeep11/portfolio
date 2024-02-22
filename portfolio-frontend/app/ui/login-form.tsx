'use client';

import { inter } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import Image from 'next/image';
export default function LoginForm() {

  // const handleSubmit = (event: { preventDefault: () => void; }) => {
  //   event.preventDefault(); // Prevent the form from being submitted in the default way
  //   // Dispatch an action to update the form state
  //   dispatch;
  // };

  return (
    // <form onSubmit={handleSubmit}  className="space-y-3">

    <div className="flex flex-col md:flex-row">
      <div className="flex justify-center items-center md:w-1/4 justify-center items-center mt-24 md:mt-2 mb-4 md:mb-0 md:order-first">
        <Image
          className='rounded-full '
          src="/self1.png" // Path to your image
          alt="Description of the image"
          width={200} // Desired width
          height={200} // Desired height
        />
      </div>
      <div className="md:w-3/4 flex flex-col justify-center items-center">
        <h1 className="mb-3 text-2xl text-white text-center">
          Hey, it's Ajay Pradeep 🚀
        </h1>
        <p className="mb-3 text-lg text-white text-center">
          A passionate Full Stack Developer dedicated to building and optimizing the performance of user-centric, high-impact applications for global customers. With a knack for writing clean, readable, and maintainable code.
        </p>
        <p className="mb-3 text-lg text-white text-center">
          <span style={{ "color": "#ecaaaa" }}>React.js | Next.js </span><span style={{ "color": "#aaecd6" }}>| JavaScript/TypeScript | Java </span><span style={{ "color": "#aac9ec" }}>| Firebase | PostgreSQL </span><span style={{ "color": "#eaaaec" }}>| Docker | GCP</span>
        </p>
        <p className="mb-3 text-lg text-white text-center">
          <span style={{ "color": "#eccdaa" }}> Git | Bitbucket | CI/CD </span>
        </p>
        <button className="bg-blue-600 text-sm text-gray-200 hover:bg-blue-700 py-3 px-5 rounded" style={{ "pointerEvents": "auto" }}>
          Explore my work
        </button>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="small-button mt-4 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}