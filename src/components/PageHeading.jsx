const TITLES = {
  "/": "Drew Della",
  "/all": "Drew Della",
  "/music": "Music",
  "/images": "Images",
  "/videos": "Videos",
  "/blog": "Blog",
  "/connect": "Socials",
  "/lyrics": "Lyrics",
  "/shop": "Store",
  "/maps": "Maps",
};

export function headingFor(pathname) {
  if (!pathname) return "Drew Della";
  if (pathname.startsWith("/blog/") && pathname !== "/blog") return null;
  if (pathname.startsWith("/lyrics/") && pathname !== "/lyrics") return null;
  if (pathname.startsWith("/music/") && pathname !== "/music") return null;
  return TITLES[pathname] || null;
}

export default function PageHeading({ pathname }) {
  const title = headingFor(pathname);
  if (!title) return null;
  return <h1 className="sr-only">{title}</h1>;
}
