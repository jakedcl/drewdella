/**
 * Built-in music catalog. Shown when Studio fields are empty.
 * Sanity values override these field by field. Do not invent facts here.
 *
 * Thx4itall liner notes are Drew's own words from Blog 2 (2026-02-14), verbatim.
 */

export const THX4ITALL_STORY = [
  "“My album is out now too. That was also a way I attempted to heal. I don't have much to say except to enjoy it. Enjoy V-day too. Play this album with caution. And to the one who knows , really, thank you for it all, 4 everything.”",
  "— Drew Della, Blog 2, February 14, 2026",
].join("\n");

export const MUSIC_CATALOG = [
  {
    title: "Thx4itall.",
    slug: "thx4itall",
    date: "2026-02-14",
    order: 1,
    featured: true,
    subtitle: "4 someone I miss daily",
    story: THX4ITALL_STORY,
    cover: "/covers/thx4itall.jpg",
    coverAlt: "Thx4itall. cover",
    links: [
      { label: "Spotify", url: "https://open.spotify.com/album/1nqFw70MQdVAo2N7JwUQsQ" },
      { label: "Apple Music", url: "https://geo.music.apple.com/us/album/thx4itall/1873166500" },
      { label: "YouTube Music", url: "https://youtu.be/48-QiA1XLj4" },
      { label: "Bandcamp", url: "https://drewdella.bandcamp.com/album/thx4itall" },
      { label: "Deezer", url: "https://www.deezer.com/album/907232702" },
    ],
    tracks: [
      { title: "Sorry In Advance", duration: "4:19" },
      { title: "Backwards", duration: "3:08" },
      { title: "Slowdnce", duration: "1:16" },
      { title: "I Like It When You..", duration: "3:45" },
      { title: "Stranger Danger", duration: "2:32" },
      { title: "Shot Me Down", duration: "7:34" },
      { title: "Wimbledon", duration: "2:09" },
      { title: "Don't Be So Dramatic", duration: "2:41" },
      { title: "Changed On Me", duration: "4:29" },
      { title: "Recreate You (in my lab)", duration: "6:17" },
    ],
  },
  {
    title: "DELLACORE VOL. 2",
    slug: "dellacore-vol-2",
    date: "2025-02-28",
    order: 2,
    featured: false,
    subtitle: "",
    story: "",
    cover: "/covers/dellacore-vol-2.jpg",
    coverAlt: "DELLACORE VOL. 2 cover",
    links: [
      { label: "Spotify", url: "https://open.spotify.com/album/3JUujmkgIBx4C28vWschmL" },
      { label: "Apple Music", url: "https://geo.music.apple.com/us/album/dellacore-vol-2/1797768104" },
    ],
    tracks: [
      { title: "Day Off Work", duration: "3:50" },
      { title: "Cleopatra", duration: "2:29" },
      { title: "All too quiet...", duration: "2:10" },
      { title: "FLY!", duration: "1:21" },
      { title: "Run 2 U", duration: "2:05" },
      { title: "Piece me together :)", duration: "2:22" },
      { title: "Be Myself 4 once", duration: "5:04" },
      { title: "I need ya!", duration: "2:56" },
    ],
  },
  {
    title: "DELLACORE VOL. 1",
    slug: "dellacore-vol-1",
    date: "2024-09-06",
    order: 3,
    featured: false,
    subtitle: "",
    story: "",
    cover: "/covers/dellacore-vol-1.jpg",
    coverAlt: "DELLACORE VOL. 1 cover",
    links: [
      { label: "Spotify", url: "https://open.spotify.com/album/7uXhqWRkfCr95ya4wh3AmV" },
      { label: "Apple Music", url: "https://geo.music.apple.com/gb/album/dellacore-vol-1/1765358701" },
    ],
    tracks: [
      { title: "Pray for Bronny", duration: "3:34" },
      { title: "Johnny Burnette", duration: "2:11" },
      { title: "Cuckoo", duration: "2:28" },
      { title: "Crash Site!", duration: "1:40" },
      { title: "Bryan Mills", duration: "1:17" },
      { title: "Endless", duration: "2:56" },
      { title: "WAKE UP!", duration: "2:36" },
      { title: "15, 16", duration: "2:50" },
      { title: "Sad, Political", duration: "2:30" },
      { title: "Feelin my mind is...", duration: "2:07" },
    ],
  },
  {
    title: "SUCH IS LIFE!",
    slug: "such-is-life",
    date: "2023-08-11",
    order: 4,
    featured: false,
    subtitle: "",
    story: "",
    cover: "/covers/such-is-life.jpg",
    coverAlt: "SUCH IS LIFE! cover",
    links: [
      { label: "Spotify", url: "https://open.spotify.com/album/3iyWYgrGOuDPiUkZayiTqv" },
      { label: "Apple Music", url: "https://geo.music.apple.com/us/album/such-is-life/1701323137" },
      { label: "Bandcamp", url: "https://drewdella.bandcamp.com/album/such-is-life" },
    ],
    tracks: [
      { title: "No One Knows Me.", duration: "3:06" },
      { title: "Distracted.", duration: "3:14" },
      { title: "The Intro!", duration: "1:02" },
      { title: "6 Shots!", duration: "2:48" },
      { title: "Find God!", duration: "1:10" },
      { title: "Bassline!", duration: "2:51" },
      { title: "Goodbye Sadboy!", duration: "2:50" },
      { title: "Back 2 Life!", duration: "1:14" },
      { title: "Julia Fox!", duration: "4:03" },
      { title: "I Wish We Talked More!", duration: "4:30" },
    ],
  },
];
