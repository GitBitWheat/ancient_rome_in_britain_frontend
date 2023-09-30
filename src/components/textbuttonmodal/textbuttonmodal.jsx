import { useState, useEffect, useCallback, Fragment } from 'react';
import { Button } from 'devextreme-react';
import { Modal } from 'react-bootstrap';

const replaceNewlinesWithBrs = text => text ? text.split('\n').reduce((prev, curr) => {
        if (prev.length > 0) {
            prev.push(<br key={prev.length}/>);
        }
        prev.push(<Fragment key={prev.length}>{curr}</Fragment>);
        return prev;
    }, []) : null;

const TextButtonModal = ({ btnText, modalHeaderText, modalBodyText }) => {

    const [isOpen, setIsOpen] = useState(false);
    const onClick = useCallback(() => {
        setIsOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const [fixedModalBodyText, setFixedModalBodyText] = useState('');
    useEffect(() => {
        setFixedModalBodyText(replaceNewlinesWithBrs(modalBodyText));
    }, [modalBodyText]);

    return (
        <div>
            <Button
                text={btnText}
                onClick={onClick}
            />
            <Modal
                show={isOpen}
                onHide={handleClose}
                size='lg'
                centered
            >
                <Modal.Header closeButton>{modalHeaderText}</Modal.Header>
                <Modal.Body>{fixedModalBodyText}</Modal.Body>
            </Modal>
        </div>
    );
};

export default TextButtonModal;