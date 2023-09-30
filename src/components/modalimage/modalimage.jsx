import { useState, useCallback } from "react";
import { Modal } from "react-bootstrap"
import './modalimage.css';

const ModalImage = ({ src, alt }) => {

    const [isOpen, setIsOpen] = useState(false);
    const onClick = useCallback(() => {
        setIsOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <div>
            <img
                src={src}
                alt={alt}
                onClick={onClick}
                className="modal-image-outside"
            />
            <Modal
                show={isOpen}
                onHide={handleClose}
                size="sm"
                contentClassName="modal-image-content"
            >
                <Modal.Body className="modal-image-body">
                    <img
                        src={src}
                        alt={alt}
                        className="modal-image-inside"
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalImage;