import { FaExclamationTriangle } from 'react-icons/fa'
import '../Product/ProductStyles.css';
import type { IConfirmModalProps } from '../../types/types';

export default function ConfirmModal({ show, title, message, onConfirm, onCancel }: IConfirmModalProps) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <FaExclamationTriangle className="icon" />
                    {title}
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="btn-modal-secondary" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button className="btn-modal-danger" onClick={onConfirm}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};