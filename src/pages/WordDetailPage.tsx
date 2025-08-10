import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { WordData } from '../types/word';
import { getAuthConfig } from '../endpoints/api';
import WordNote from "../components/WordNote";
import AudioButton from '../components/AudioButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import ConfirmationModal from '../components/ConfirmationModal';

import '../styles/WordDetailPage.css';

const BASE_URL = 'https://vocabloom-backend.onrender.com/api';
// const BASE_URL = 'http://127.0.0.1:8000/api';


const WordDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [word, setWord] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/words/${id}/`, getAuthConfig());

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

  const handleDeleteClick = (wordId: number, wordName: string) => {
    setWordToDelete({ id: wordId, name: wordName });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!wordToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/words/${id}/`, getAuthConfig());
      navigate('/my-words');
    } catch (error) {
      console.error('Error deleting word:', error);
    } finally {
      setShowDeleteConfirm(false);
      setWordToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setWordToDelete(null);
  };

  if (loading) return <p>Loading word...</p>;
  if (notFound) return <p>Word not found.</p>;

  return (
    <main className='protected-main'>
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      <div className="word-detail">
        <div className="word-detail-container">
          <h1 className='word-detail-title'>{word?.word}</h1>
          {word?.phonetic && <p className="word-detail-phonetic">/{word.phonetic}/</p>}
          {word?.audio && <audio controls src={word.audio} />}
          {word && (
            <WordNote
              word={word}
              onUpdated={(updated) => setWord(updated)}
            />
          )}
          {word?.meanings.map((meaning, idx) => (
            <div key={idx} className='word-detail-meanings'>
              <h2 className='word-detail-subtitle'>{meaning.partOfSpeech}</h2>
              <ul className='word-definitions'>
                {meaning.definitions.map((def, i) => (
                  <li key={i}>
                    <p className='word-definitions-definition'>- {def.definition}</p>
                    {def.example && (
                      <div className='word-definitions-example-div'>
                        <AudioButton
                          text={def.example ?? ""}
                          className="ml-2 text-blue-500"
                          size={16}
                        />
                        <p className='word-definitions-example'>{def.example && <em>{def.example}</em>}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <FontAwesomeIcon
            icon={faTrashCan}
            size="xs"
            className="delete-button"
            onClick={() => {
              if (word?.id && word?.word) {
                handleDeleteClick(word.id, word.word);
              }
            }}
          ></FontAwesomeIcon>
          {/* // <button onClick={handleDelete} className="delete-button">Delete Word</button> */}
        </div>
      </div>
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Word"
        message={`Are you sure you want to delete "${wordToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        type="danger"
      />
    </main>
  );
};

export default WordDetailPage;
