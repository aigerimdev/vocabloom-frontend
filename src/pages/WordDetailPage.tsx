import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { WordData } from '../types/word';
import '../styles/WordResultCard.css';


const BASE_URL = 'https://vocabloom-backend.onrender.com/api';

const WordDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [word, setWord] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/words/${id}/`, {
          withCredentials: true,
        });

        const normalizedMeanings = res.data.meanings.map((m: any) => ({
          ...m,
          partOfSpeech: m.part_of_speech,
        }));

        setWord({
          ...res.data,
          meanings: normalizedMeanings,
        });
      } catch (error: any) {
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error('Error fetching word:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/words/${id}/`, {
        withCredentials: true,
      });
      navigate('/my-words');
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  if (loading) return <p>Loading word...</p>;
  if (notFound) return <p>Word not found.</p>;

  return (
    <div className="word-card">
      <div className="word-detail-container">
        <h2>{word?.word}</h2>
        {word?.phonetic && <p className="phonetic">/{word.phonetic}/</p>}
        {word?.audio && <audio controls src={word.audio} />}
        {word?.meanings.map((meaning, idx) => (
          <div key={idx}>
            <h4>{meaning.partOfSpeech}</h4>
            <ul>
              {meaning.definitions.map((def, i) => (
                <li key={i}>
                  {def.definition}
                  {def.example && <em> – {def.example}</em>}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button onClick={handleDelete} className="delete-button">Delete Word</button>
      </div>
    </div>

  );
};

export default WordDetailPage;
