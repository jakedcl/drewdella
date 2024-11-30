import './ConnectPage.css';

export default function ConnectPage() {
  const items = [
    {
      title: 'Instagram - thedrewdella',
      url: 'https://www.instagram.com/thedrewdella',
      description: 'Drew Della (@thedrewdella) on Instagram: "A kid on the ferry thought I was spider-man..."',
    },
    {
      title: 'YouTube - Drew Della',
      url: 'https://www.youtube.com/drew-della',
      description: 'Drew Della LIVE @ ECONO LODGE | Music videos · Releases · Videos · Shorts · WAKE UP AND GRIND 13 #albumnew #music',
    },
    {
      title: 'SoundCloud - Drew Della',
      url: 'https://soundcloud.com/drew-della',
      description: 'Play Drew Della on SoundCloud and discover followers on SoundCloud | Stream tracks, albums, playlists on desktop and mobile.',
    },

    {
      title: 'Twitter - thedrewdella',
      url: 'https://www.x.com/drewdella',
      description: 'Rapper, Producer, Comedian, Speculator, Musician. New York, NY."',
    },
    // Add more items as needed
  ];

  return (
    <div className="all-results-container">
      {items.map((item, index) => (
        <div key={index} className="result-item">
          <div className="result-content">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="result-title">
              {item.title}
            </a>
            <p className="result-description">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
