/**
 * Nested layout for a single article. Adds a fixed overlay that
 * swaps the site-wide wallpaper2 backdrop for the original wallpaper
 * the client wants behind every post. The overlay matches the fixed
 * sizing of body::before so it covers cleanly without affecting any
 * scrolling, click targets, or stacking elsewhere on the page.
 */
export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="article-wallpaper" aria-hidden />
      {children}
    </>
  );
}
