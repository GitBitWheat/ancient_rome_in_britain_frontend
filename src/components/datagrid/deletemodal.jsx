import { Modal, Button } from "react-bootstrap";

export const defaultDeleteRecord = () => {console.error('No record chosen to delete');};

export const DeleteModal = ({ show, deleteRecord, handleClose }) => {
    const deleteThenClose = () => {
        deleteRecord();
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Body>Are you sure you want to delete this record?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={deleteThenClose}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;