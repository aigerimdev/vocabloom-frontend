// Create AudioButton.tsx component
import React, { useState } from 'react';
import { convertTextToSpeech, playAudio } from '../endpoints/api';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeHigh, faVolumeLow } from '@fortawesome/free-solid-svg-icons'

interface AudioButtonProps {
    text: string;
    voiceId?: string;
    className?: string;
    size?: number;
}

const AudioButton: React.FC<AudioButtonProps> = ({
    text,
    voiceId = 'Joanna',
    className = '',
    size = 24
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleAudioClick = async () => {
        if (!text?.trim()) {
            alert('No text to convert to speech');
            return;
        }

        setIsLoading(true);

        try {
            const audioUrl = await convertTextToSpeech(text, voiceId);

            if (audioUrl) {
                setIsPlaying(true);
                await playAudio(audioUrl);
                setIsPlaying(false);
            } else {
                alert('Failed to convert text to speech');
            }
        } catch (error) {
            console.error('Audio playback error:', error);
            alert('Error playing audio');
            setIsPlaying(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleAudioClick}
            disabled={isLoading || !text?.trim()}
            className={`audio-button ${className} ${isLoading ? 'loading' : ''} ${isPlaying ? 'playing' : ''}`}
            title="Listen to pronunciation"
            type="button"
        >
            {isLoading ? (
                <FontAwesomeIcon icon={faVolumeHigh} beatFade />
            ) : isPlaying ? (
                <FontAwesomeIcon icon={faVolumeHigh} fade />
            ) : (
                <FontAwesomeIcon icon={faVolumeLow} />
            )}
        </button>
    );
};

export default AudioButton;