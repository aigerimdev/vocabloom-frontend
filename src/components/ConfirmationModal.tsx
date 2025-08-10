import React, { useEffect } from 'react';
import '../styles/ConfirmationModal.css';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'warning' | 'danger' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    type = 'warning',
}) => {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onCancel]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onCancel();
    };

    if (!isOpen) return null;

    return (
        <div
            className="confirmation-modal-backdrop"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
        >
            <div className="confirmation-modal">
                <div className="confirmation-modal-header">
                    <h3 id="confirmation-title" className={`confirmation-title ${type}`}>{title}</h3>
                </div>
                <div className="confirmation-modal-body">
                    <p>{message}</p>
                </div>
                <div className="confirmation-modal-actions">
                    {cancelText !== '' && (
                        <button className="confirmation-btn cancel-btn" onClick={onCancel}>
                            {cancelText}
                        </button>
                    )}
                    <button className={`confirmation-btn confirm-btn ${type}`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
