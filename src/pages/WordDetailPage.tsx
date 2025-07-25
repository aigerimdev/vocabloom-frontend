import { useParams, useNavigate } from 'react-router-dom';

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
    <div>
      <h2>{selectedWord.word}</h2>
      <p>{selectedWord.phonetic}</p>
      <audio controls src={selectedWord.audio}></audio>

      {selectedWord.meanings.map((m: any, index: number) => (
        <div key={index}>
          <h4>{m.part_of_speech}</h4>
          <ul>
            {m.definitions.map((d: any, i: number) => (
              <li key={i}>
                <strong>{d.definition}</strong>
                <br />
                <em>{d.example}</em>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button onClick={handleDelete}>🗑 Delete</button>
    </div>
  );
};

export default WordDetailPage;
