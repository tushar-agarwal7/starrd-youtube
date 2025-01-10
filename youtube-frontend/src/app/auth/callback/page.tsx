// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useYoutubeStore } from '@/app/store/youtube-store';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setYoutubeData = useYoutubeStore(state => state.setYoutubeData);

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get('code');

      if (!code) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange code for tokens');
        }

        const data = await response.json();
        console.log('Received data:', data); // Debug log
        setYoutubeData(data);
        router.push('/');
      } catch (error) {
        console.error('Callback error:', error);
        router.push('/?error=callback_failed');
      }
    }

    handleCallback();
  }, [searchParams, router, setYoutubeData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-xl mb-4">Processing authentication...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
      </div>
    </div>
  );
}