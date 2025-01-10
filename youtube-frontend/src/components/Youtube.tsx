'use client';

import { useState } from 'react';
import { useYoutubeStore } from '@/app/store/youtube-store';

export default function YouTubeConnect() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const youtubeData = useYoutubeStore(state => state.youtubeData);

  const handleConnect = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/url');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      setError('Failed to initialize YouTube connection');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {!youtubeData ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Connect Your YouTube Channel
              </h1>
              <p className="text-gray-300 text-lg mb-8">
                Access your channel statistics and manage your content in one place
              </p>
            </div>
            <button
              onClick={handleConnect}
              disabled={loading}
              className="group relative px-8 py-4 bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-3">
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/>
                    </svg>
                    <span className="font-semibold text-lg">Connect with YouTube</span>
                  </>
                )}
              </div>
            </button>
            {error && (
              <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                <p>{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 py-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Channel Overview
              </h2>
              <div className="flex items-center space-x-6">
                <img
                  src={youtubeData.socials.profileImage}
                  alt={youtubeData.socials.name}
                  className="w-24 h-24 rounded-full ring-4 ring-red-500/30"
                />
                <div>
                  <h3 className="text-2xl font-bold mb-2">{youtubeData.socials.name}</h3>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                    </svg>
                    <p className="text-lg">
                      {new Intl.NumberFormat().format(parseInt(youtubeData.socials.followers))} subscribers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Recent Videos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {youtubeData.posts.map(post => (
                  <div key={post.id} className="group bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/20">
                    <div className="relative">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-semibold text-lg mb-3 line-clamp-2">{post.title}</h4>
                      <div className="flex items-center text-gray-300 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}