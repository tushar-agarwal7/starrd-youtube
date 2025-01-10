'use client'
import { useState } from 'react';

export default function YouTubeConnectTwo() {
  const [channelId, setChannelId] = useState('');
  const [youtubeData, setYoutubeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    if (!channelId) {
      setError('Please enter a YouTube channel ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/youtube/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch YouTube data');
      }

      const data = await response.json();
      setYoutubeData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          placeholder="Enter YouTube Channel ID"
          className="border p-2 rounded mr-2 text-black"
        />
        <button
          onClick={handleConnect}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-red-400"
        >
          {loading ? 'Loading...' : 'Connect with YouTube'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {youtubeData && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl text-black font-bold mb-4">Channel Information</h2>
            <div className="flex items-center space-x-4">
              <img
                src={youtubeData.socials.profileImage}
                alt={youtubeData.socials.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <p className="font-semibold text-black">{youtubeData.socials.name}</p>
                <p className='text-black'>Followers: {new Intl.NumberFormat().format(youtubeData.socials.followers)}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-black">Recent Videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeData.posts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 text-black">{post.title}</h4>
                    <p className="text-sm text-black">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
