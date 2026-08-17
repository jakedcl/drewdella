import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { client } from "../../lib/sanity";
import {
  SearchResults,
  SearchResult,
  formatCite,
  formatElapsed,
  snippetFromPortableText,
  blogPreviewSnippet,
} from "../../components/SearchResults/SearchResults.jsx";
import "./AllPage.css";

const POPUP = {
  id: "merch",
  title: "CONGRATULATIONS!!!",
  body: "You may have already won exclusive Drew Della merch.",
  cta: "Enter store →",
  to: "/shop",
};

function VintagePopup({ title, body, cta, to, onClose }) {
  return (
    <div className="win-popup">
      <div className="win-popup-bar">
        <span className="win-popup-title">{title}</span>
        <button
          type="button"
          className="win-popup-x"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="win-popup-body">
        <p>{body}</p>
        <Link className="win-popup-cta" to={to}>
          {cta}
        </Link>
      </div>
    </div>
  );
}

function mixResults({ releases, posts, songs, socials }) {
  const mixed = [];
  const take = [
    ...(releases || []).map((item) => ({ kind: "music", item })),
    ...(posts || []).map((item) => ({ kind: "blog", item })),
    ...(songs || []).map((item) => ({ kind: "lyrics", item })),
    ...(socials || []).map((item) => ({ kind: "social", item })),
  ];

  const buckets = {
    music: take.filter((x) => x.kind === "music"),
    blog: take.filter((x) => x.kind === "blog"),
    lyrics: take.filter((x) => x.kind === "lyrics"),
    social: take.filter((x) => x.kind === "social"),
  };

  const order = ["music", "blog", "lyrics", "social"];
  let added = true;
  while (added) {
    added = false;
    for (const key of order) {
      const next = buckets[key].shift();
      if (next) {
        mixed.push(next);
        added = true;
      }
    }
  }
  return mixed;
}

export default function AllPage() {
  const [data, setData] = useState({
    releases: [],
    posts: [],
    songs: [],
    socials: [],
  });
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState("0.12");
  const [closed, setClosed] = useState(() => new Set());

  useEffect(() => {
    const fetchAll = async () => {
      const started = performance.now();
      try {
        const query = `{
          "releases": *[_type == "musicRelease"] | order(order asc)[0...4] {
            _id, title, description, url
          },
          "posts": *[_type == "blogPost"] | order(date desc)[0...3] {
            _id, title, date, slug, "preview": pt::text(content), "imageCount": count(content[_type == "image"])
          },
          "songs": *[_type == "song"] | order(albumOrder asc, order asc)[0...3] {
            _id, title, album, slug, "preview": pt::text(lyrics)
          },
          "socials": *[_type == "socialLink"] | order(order asc)[0...3] {
            _id, title, url, description
          }
        }`;
        const next = await client.fetch(query);
        setData(next || {});
        setElapsed(formatElapsed(performance.now() - started));
      } catch (err) {
        console.error("Error fetching all results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  const mixed = mixResults(data);
  const count = mixed.length + 3;
  const popupOpen = !closed.has(POPUP.id);

  const renderMixed = (entry, key) => {
    const { kind, item } = entry;
    if (kind === "music") {
      return (
        <SearchResult
          key={key}
          href={item.url}
          title={item.title}
          cite={formatCite(item.url)}
          snippet={item.description}
        />
      );
    }
    if (kind === "blog") {
      const slugValue = item.slug?.current || item.slug;
      return (
        <SearchResult
          key={key}
          internal
          href={`/blog/${slugValue}`}
          title={item.title}
          cite={`drewdella.com › blog › ${slugValue}`}
          snippet={blogPreviewSnippet(item)}
        />
      );
    }
    if (kind === "lyrics") {
      const slugValue = item.slug?.current || item.slug;
      const albumLine = item.album
        ? `Lyrics from ${item.album}.`
        : "Single.";
      return (
        <SearchResult
          key={key}
          internal
          href={`/lyrics/${slugValue}`}
          title={`${item.title} lyrics`}
          cite={`drewdella.com › lyrics › ${slugValue}`}
          snippet={[albumLine, snippetFromPortableText(item.preview, 120)]
            .filter(Boolean)
            .join(" ")}
        />
      );
    }
    return (
      <SearchResult
        key={key}
        href={item.url}
        title={item.title}
        cite={formatCite(item.url)}
        snippet={item.description}
      />
    );
  };

  return (
    <div className="all-page">
      <SearchResults count={count} elapsed={elapsed}>
        <div className="serp-result">
          <cite className="serp-cite">
            www.drewdella.com
            <span className="serp-cite-arrow" aria-hidden>
              ▼
            </span>
          </cite>
          <Link className="serp-title" to="/home">
            Drew Della
          </Link>
          <p className="serp-snippet">
            Official site. Music, lyrics, photos, videos, blog, and live shows
            — a Google parody of the artist formerly searching for himself.
          </p>
        </div>

        <SearchResult
          sponsored
          internal
          href="/shop"
          title="Drew Della merch — new drops incoming"
          cite="www.drewdella.com/shop"
          snippet="Official store. New album coming soon. New merch on the way. Shop tees, vinyl, and whatever Della cooked this week."
        />
        <SearchResult
          sponsored
          internal
          href="/maps"
          title="Live shows NYC+ — dates on the map"
          cite="www.drewdella.com/maps"
          snippet="Tour stops plotted. Zoom in, don’t be late, and screenshot the pin before it moves."
        />

        {popupOpen && (
          <VintagePopup
            {...POPUP}
            onClose={() =>
              setClosed((prev) => {
                const next = new Set(prev);
                next.add(POPUP.id);
                return next;
              })
            }
          />
        )}

        {mixed.map((entry) => renderMixed(entry, entry.item._id))}
      </SearchResults>
    </div>
  );
}
