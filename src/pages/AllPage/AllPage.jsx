import './AllPage.css';

export default function AllPage() {
  const items = [
    {
      title: 'Dellacore Vol. 2',
      url: 'https://li.sten.to/dellacorevol2', // Replace with actual URL if available
      description: "This is how I'm most comfortable: just me, my guitar, my love songs, and some other stuff. Welcome to the new era. Enjoy.",
    },
    {
      title: 'Dellacore Vol. 1',
      url: 'https://li.sten.to/dellacore', // Replace with actual URL if available
      description: 'A two-part project. Ushering in a new era. Stay tuned for Vol. 2.',
    },
    {
      title: 'SUCH IS LIFE!',
      url: 'https://li.sten.to/suchislife', // Replace with actual URL if available
      description: 'The last of the trifecta: I made this in the corner of whatever room was empty. Half on voice memo. A letter to myself. A letter to a good friend of mine.',
    },
    {
      title: 'I AM IN A WEIRD MENTAL STATE',
      url: 'https://li.sten.to/iiawms', // Replace with actual URL if available
      description: 'My second album: I lost most of it when my hard drive corrupted. This is what was left.',
    },
    {
      title: 'The Color Water',
      url: 'https://li.sten.to/TheColorWater', // Replace with actual URL if available
      description: 'My first album.',
    },
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
