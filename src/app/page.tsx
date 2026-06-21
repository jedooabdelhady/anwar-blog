import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ThreeCards from "@/components/ThreeCards";
import VideoCards from "@/components/VideoCards";
import BlogGrid from "@/components/BlogGrid";
import Footer from "@/components/Footer";
import { TopWaves, BottomWaves } from "@/components/DecorativeWaves";
import { getAllPosts } from "@/sanity/lib/fetch";
import { getSiteSettings } from "@/sanity/lib/settings";

export const revalidate = 60;

export default async function Home() {
  const [posts, settings] = await Promise.all([
    getAllPosts(),
    getSiteSettings(),
  ]);

  return (
    <div className="relative flex-1 w-full">
      <TopWaves />
      <Header active="/" />
      <main>
        <Hero
          title={settings.siteName}
          quotes={settings.heroQuotes}
        />
        <ThreeCards
          cardPublic={settings.cardPublic}
          cardPrivate={settings.cardPrivate}
          cardInquiry={settings.cardInquiry}
        />
        <VideoCards videos={settings.videos} />
        <BlogGrid
          posts={posts.slice(0, 6)}
          title={settings.blogSection.title}
          subtitle={settings.blogSection.subtitle}
        />
      </main>
      <Footer />
      <BottomWaves />
    </div>
  );
}
