// store/youtube-store.ts
import { create } from 'zustand'

type YouTubeData = {
  socials: {
    followers: string;
    username: string;
    name: string;
    profileImage: string;
  };
  posts: Array<{
    id: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
  }>;
}

type YouTubeStore = {
  youtubeData: YouTubeData | null;
  setYoutubeData: (data: YouTubeData) => void;
}

export const useYoutubeStore = create<YouTubeStore>((set) => ({
  youtubeData: null,
  setYoutubeData: (data) => set({ youtubeData: data }),
}))