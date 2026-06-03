// Twitter reuses the same generator — re-export so we have a /twitter-image
// route that matches the OG image, keeping previews consistent across networks.
export { default, alt, size, contentType } from "./opengraph-image";
