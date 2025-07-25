import { useParams, useNavigate } from 'react-router-dom';
import '../styles/WordResultCard.css';


const WordDetailPage = () => {
  const { word } = useParams();
  const navigate = useNavigate();

  const storedWords = JSON.parse(localStorage.getItem('savedWords') || '[]');
  const selectedWord = storedWords.find((w: any) => w.word.toLowerCase() === word?.toLowerCase());

  const handleDelete = () => {
    const updatedWords = storedWords.filter((w: any) => w.word.toLowerCase() !== word?.toLowerCase());
    localStorage.setItem('savedWords', JSON.stringify(updatedWords));
    navigate('/my-words');
  };

  if (!selectedWord) return <p>Word not found</p>;

  return (
    <div className="word-card">
      <h2>{selectedWord.word}</h2>

      {selectedWord.phonetic && <p className="phonetic">/{selectedWord.phonetic}/</p>}

      {selectedWord.audio && (
        <audio controls>
          <source src={selectedWord.audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}

      {Array.isArray(selectedWord.meanings) &&
        selectedWord.meanings.map((m: any, index: number) => (
          <div key={index}>
            <h3>{m.partOfSpeech}</h3>
            <ul>
              {m.definitions.map((d: any, i: number) => (
                <li key={i}>
                  <p>{d.definition}</p>
                  {d.example && <em>{d.example}</em>}
                </li>
              ))}
            </ul>
          </div>
        ))}

      <button className="save-tag-button" onClick={handleDelete}>🗑 Delete</button>
    </div>
  );

};

export default WordDetailPage;
