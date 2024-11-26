import './AllPage.css';

export default function AllPage() {
  const items = [
  {
    title: 'Della Phase 4',
    url: '', // Replace with actual URL if available
    description: 'Della Phase 4 has begun. Stay tuned for more.',
  },
  {
    title: 'Dellacore Vol. 1',
    url: 'https://li.sten.to/dellacore', // Replace with actual URL if available
    description: 'A two-part project. Ushering in a new era. Stay tuned for Vol. 2.',
  },
  {
    title: 'SIL - Album',
    url: 'https://li.sten.to/suchislife', // Replace with actual URL if available
    description: 'My 3rd album: I made this in the corner of whatever room was empty. Half on voice memo. A letter to myself. A letter to a good friend of mine.',
  },
  {
    title: 'IIAWMS - Album',
    url: 'https://li.sten.to/iiawms', // Replace with actual URL if available
    description: 'My 2nd album: I lost most of it when my hard drive corrupted. This is what was left.',
  },
  {
    title: 'Vol. 1 - The Color Water',
    url: 'https://li.sten.to/TheColorWater', // Replace with actual URL if available
    description: 'My 1st album.',
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
