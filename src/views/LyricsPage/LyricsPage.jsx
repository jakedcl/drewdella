"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { client } from "../../lib/sanity";
import { CircularProgress, Box } from "@mui/material";
import {
  SearchResults,
  SearchResult,
  formatElapsed,
  snippetFromPortableText,
  pathCite,
  datedSnippet,
} from "../../components/SearchResults/SearchResults.jsx";
import SerpMessage from "../../components/SerpMessage/SerpMessage.jsx";
import "./LyricsPage.css";

function LyricsPage() {
  const params = useParams() || {};
  const slug = params.slug;
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState("0.12");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("album");

  useEffect(() => {
    if (slug) {
      // Fetch individual song
      fetchSong(slug);
    } else {
      // Fetch all songs for list view
      fetchSongs();
    }
  }, [slug]);

  const fetchSongs = async () => {
    const started = performance.now();
    try {
      setLoading(true);
      setError(null);

      const query = `*[_type == "song"] | order(albumOrder asc, album asc, order asc) {
        _id,
        title,
        album,
        albumOrder,
        order,
        slug,
        "preview": pt::text(lyrics),
        "date": *[_type == "musicRelease" && lower(title) == lower(^.album)][0].date
      }`;

      const data = await client.fetch(query);
      setSongs(data);
      setElapsed(formatElapsed(performance.now() - started));
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError("load-failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchSong = async (songSlug) => {
    try {
      setLoading(true);
      setError(null);

      const query = `*[_type == "song" && slug.current == $slug][0] {
        _id,
        title,
        album,
        lyrics[]{
          ...,
          _type == "image" => {
            ...,
            asset->
          },
          _type == "block" => {
            ...,
            markDefs[]{
              ...,
              _type == "link" => {
                ...
              }
            }
          }
        },
        slug
      }`;

      const data = await client.fetch(query, { slug: songSlug });
      if (!data) {
        setError("not-found");
      } else {
        setSong(data);
      }
    } catch (err) {
      console.error("Error fetching song:", err);
      setError("load-failed");
    } finally {
      setLoading(false);
    }
  };

  const renderLyrics = (lyrics) => {
    if (!lyrics) return null;

    return lyrics.map((block, index) => {
      if (block._type === 'block') {
        const style = block.style || 'normal';

        // Handle text with marks (bold, italic, links, etc.)
        const renderText = (children, markDefs = []) => {
          if (!children) return '';
          return children.map((child, childIndex) => {
            let text = child.text || '';

            // Handle marks (decorators and annotations)
            if (child.marks && child.marks.length > 0) {
              // Process marks in reverse order to properly nest elements
              child.marks.slice().reverse().forEach(mark => {
                if (mark === 'strong') {
                  text = <strong key={`${childIndex}-strong`}>{text}</strong>;
                } else if (mark === 'em') {
                  text = <em key={`${childIndex}-em`}>{text}</em>;
                } else if (mark === 'code') {
                  text = <code key={`${childIndex}-code`} className="lyrics-code">{text}</code>;
                } else {
                  // Handle annotations (like links) - mark is a key
                  const markDef = markDefs.find(def => def._key === mark);
                  if (markDef && markDef._type === 'link') {
                    text = (
                      <a
                        key={`${childIndex}-link`}
                        href={markDef.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lyrics-link"
                      >
                        {text}
                      </a>
                    );
                  }
                }
              });
            }

            return <React.Fragment key={childIndex}>{text}</React.Fragment>;
          });
        };

        const textContent = block.children ? renderText(block.children, block.markDefs || []) : '';

        // Handle lists
        if (block.listItem) {
          const ListTag = block.listItem === 'bullet' ? 'ul' : 'ol';
          return (
            <ListTag key={index} className="lyrics-list">
              <li className="lyrics-list-item">{textContent}</li>
            </ListTag>
          );
        }

        switch (style) {
          case 'h1':
            return <h1 key={index} className="lyrics-h1">{textContent}</h1>;
          case 'h2':
            return <h2 key={index} className="lyrics-h2">{textContent}</h2>;
          case 'h3':
            return <h3 key={index} className="lyrics-h3">{textContent}</h3>;
          case 'blockquote':
            return <blockquote key={index} className="lyrics-blockquote">{textContent}</blockquote>;
          default:
            return <p key={index} className="lyrics-paragraph">{textContent}</p>;
        }
      }

      return null;
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    const missing = error === "not-found";
    return (
      <SerpMessage
        title={missing ? "That song isn’t here." : "Lyrics are taking a break."}
        detail={
          missing
            ? "The link may be old, or the title changed. Try searching lyrics again."
            : "Couldn’t load lyrics right now. Try again in a bit."
        }
        links={[
          { to: "/lyrics", label: "All lyrics" },
          { to: "/music", label: "Music" },
          { to: "/", label: "All results" },
        ]}
      />
    );
  }

  // Detail view (individual song)
  if (slug && song) {
    return (
      <div className="lyrics-page">
        <div className="lyrics-detail">
          <Link href="/lyrics" className="lyrics-back-link">← Back to search results</Link>
          <div className="lyrics-header">
            <h1 className="lyrics-title">{song.title}</h1>
            {song.album && (
              <p className="lyrics-album">{song.album}</p>
            )}
          </div>
          <div className="lyrics-content">
            {renderLyrics(song.lyrics)}
          </div>
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <SearchResults count={0} elapsed={elapsed}>
        <SerpMessage
          title="No lyrics to show yet."
          detail="Song words will show up here when they’re ready."
          links={[
            { to: "/music", label: "Music" },
            { to: "/", label: "All results" },
          ]}
        />
      </SearchResults>
    );
  }

  const q = query.trim().toLowerCase();
  const filtered = songs
    .filter((item) => item.slug && (item.slug.current || item.slug))
    .filter((item) => {
      if (!q) return true;
      return [item.title, item.album, item.preview].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(q)
      );
    })
    .slice()
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "title-desc") return b.title.localeCompare(a.title);
      const albumA = a.album || "Singles";
      const albumB = b.album || "Singles";
      if (albumA !== albumB) return albumA.localeCompare(albumB);
      return (a.order ?? 0) - (b.order ?? 0);
    });

  return (
    <SearchResults
      count={filtered.length}
      elapsed={elapsed}
      query={query}
      onQueryChange={setQuery}
      queryPlaceholder="Search lyrics"
      sort={sort}
      onSortChange={setSort}
      sortOptions={[
        { value: "album", label: "Album" },
        { value: "title", label: "Title A–Z" },
        { value: "title-desc", label: "Title Z–A" },
      ]}
    >
      {filtered.length === 0 ? (
        <p className="serp-empty">No lyrics match “{query}”.</p>
      ) : (
        filtered.map((item) => {
          const slugValue = item.slug?.current || item.slug;
          const albumLine = item.album
            ? `Lyrics from ${item.album}.`
            : "Single.";
          const preview = snippetFromPortableText(item.preview, 140);
          return (
            <SearchResult
              key={item._id}
              internal
              href={`/lyrics/${slugValue}`}
              title={`${item.title} lyrics`}
              cite={pathCite("lyrics", slugValue)}
              snippet={datedSnippet(item.date, albumLine, preview)}
            />
          );
        })
      )}
    </SearchResults>
  );
}

export default LyricsPage;
