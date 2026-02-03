import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { client } from "../../lib/sanity";
import { CircularProgress, Alert, Box } from "@mui/material";
import "./LyricsPage.css";

function LyricsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    try {
      setLoading(true);
      setError(null);

      const query = `*[_type == "song"] | order(album asc, order asc) {
        _id,
        title,
        album,
        slug
      }`;

      const data = await client.fetch(query);
      setSongs(data);
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError("Failed to load songs");
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
        setError("Song not found");
      } else {
        setSong(data);
      }
    } catch (err) {
      console.error("Error fetching song:", err);
      setError("Failed to load song");
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

  // Group songs by album
  const groupSongsByAlbum = (songs) => {
    const grouped = {};
    songs.forEach((song) => {
      const albumKey = song.album || 'Singles';
      if (!grouped[albumKey]) {
        grouped[albumKey] = [];
      }
      grouped[albumKey].push(song);
    });
    return grouped;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Detail view (individual song)
  if (slug && song) {
    return (
      <div className="lyrics-page">
        <div className="lyrics-detail">
          <Link to="/lyrics" className="lyrics-back-link">← Back to all songs</Link>
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

  // List view (all songs grouped by album)
  const groupedSongs = groupSongsByAlbum(songs);

  if (songs.length === 0) {
    return (
      <Box p={2}>
        <Alert severity="info">No songs found. Add songs in the Sanity Studio.</Alert>
      </Box>
    );
  }

  return (
    <div className="lyrics-page">
      <div className="lyrics-list-view">
        {Object.keys(groupedSongs)
          .sort((a, b) => {
            // Put "Singles" at the end
            if (a === 'Singles') return 1;
            if (b === 'Singles') return -1;
            return a.localeCompare(b);
          })
          .map((album) => (
            <div key={album} className="lyrics-album-group">
              <h2 className="lyrics-album-title">{album}</h2>
              <div className="lyrics-songs-list">
                {groupedSongs[album].map((song) => (
                  <Link
                    key={song._id}
                    to={`/lyrics/${song.slug.current}`}
                    className="lyrics-song-item"
                  >
                    {song.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default LyricsPage;
