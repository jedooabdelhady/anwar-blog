import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ThreeCards from "@/components/ThreeCards";
import BlogGrid from "@/components/BlogGrid";
import Footer from "@/components/Footer";
import { TopWaves, BottomWaves } from "@/components/DecorativeWaves";
import { getAllPosts } from "@/sanity/lib/fetch";

export const revalidate = 60;

export default async function Home() {
  const posts = await getAllPosts();
  return (
    <div className="relative flex-1 w-full">
      <TopWaves />
      <Header active="/" />
      <main>
        <Hero />
        <ThreeCards />
        <BlogGrid posts={posts.slice(0, 6)} />
      </main>
      <Footer />
      <BottomWaves />
    </div>
  );
}
