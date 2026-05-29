'use client';

import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <span className="text-orange-400 text-3xl font-bold">404</span>

      <div className="mt-8 cursor-pointer flex justify-center gap-2">
        <button onClick={() => router.push('/')}>Back to Home</button>
      </div>
    </div>
  );
};

export default NotFound;
