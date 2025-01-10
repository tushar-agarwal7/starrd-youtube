import YouTubeConnectTwo from "@/components/YoutubeTwo";
import YouTubeConnect from "@/components/Youtube";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
    <div className="container mx-auto py-8">
      <h1 className="text-3xl text-black font-bold mb-8 text-center">YouTube Channel </h1>
      <YouTubeConnect/>
      {/* <YouTubeConnectTwo/> */}
    </div>
  </div>
  );
}
