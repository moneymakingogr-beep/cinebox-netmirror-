import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "dist");
const assetsDir = path.join(dist, "assets");

assert.ok(fs.existsSync(path.join(dist, "index.html")), "production index exists");
const html = fs.readFileSync(path.join(dist, "index.html"), "utf8");
assert.match(html, /<div id="root"><\/div>/, "React root is in the production shell");
assert.match(html, /CineBox — Discover Movies/, "discovery page title is published");
assert.match(html, /application\/ld\+json/, "website structured metadata is retained");
assert.match(html, /og:image/, "Open Graph metadata is retained");
assert.doesNotMatch(html, /Big Buck Bunny|test-videos\.co\.uk|videojs/i, "sample videos are not referenced");

const bundles = fs
  .readdirSync(assetsDir)
  .filter((name) => name.endsWith(".js"))
  .map((name) => fs.readFileSync(path.join(assetsDir, name), "utf8"));
assert.ok(bundles.length > 0, "React JavaScript bundle exists");
const application = bundles.join("\n");
for (const feature of [
  "Trending on TMDB",
  "Popular Movies",
  "Popular TV Shows",
  "Popular Anime",
  "Load more",
  "My List",
  "View on TMDB",
]) {
  assert.ok(application.includes(feature), `application bundle contains ${feature}`);
}
for (const sample of [
  "Big Buck Bunny",
  "The Sample Reel",
  "Sample Foundry",
  "filesamples.com",
  "test-videos.co.uk",
  "SAMPLE SOURCE",
]) {
  assert.ok(!application.includes(sample), `application bundle excludes ${sample}`);
}

for (const asset of ["icon.svg", "og-image.svg", "site.webmanifest"]) {
  assert.ok(fs.existsSync(path.join(assetsDir, asset)), `production asset exists: ${asset}`);
}
assert.ok(
  !fs.existsSync(path.join(assetsDir, "vendor", "video.min.js")),
  "unused video player is not published",
);
assert.ok(fs.existsSync(path.join(dist, "robots.txt")), "robots.txt is published");
assert.ok(fs.existsSync(path.join(dist, "sitemap.xml")), "sitemap.xml is published");

const styles = fs
  .readdirSync(assetsDir)
  .filter((name) => name.endsWith(".css") && name.startsWith("index-"))
  .map((name) => fs.readFileSync(path.join(assetsDir, name), "utf8"))
  .join("\n");
for (const selector of [".navbar", ".hero", ".card-grid", ".catalog-pagination"]) {
  assert.ok(styles.includes(selector), `CineBox styles are bundled: ${selector}`);
}
assert.ok(!styles.includes(".video-js"), "unused video player styles are removed");

console.log("Production smoke checks passed.");
