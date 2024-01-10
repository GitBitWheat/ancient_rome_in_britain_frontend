import { useState } from "react";
import { FormControl } from "react-bootstrap";
import axios from "axios";

/**
 * Image edit cell
 * @param {Object} props Component props
 * @param {import("./editcellprops").EditCellProps} props.data Data prop
 */
const ImageEditCell = ({ data, serviceURL, token }) => {

    // Last image selected by the input.
    // Saved so it can be removed from the server storage when another image is selected.
    const [last, setLast] = useState(data.value || null);

    /** @param {import("react").ChangeEvent<HTMLInputElement>} event */
    const onChange = event => {
        if (!(!!token)) {
            console.error('No authorization token for uploading image');
            return;
        }

        if (last) {
            const deleteConfig = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            try {
                axios.delete(`${serviceURL}/${last}`, deleteConfig)
                .then(response => {
                    console.log('File deleted from server storage successfully:', response.data);
                });
            } catch(err) {
                console.error('Error deleting file from server storage:', err);
            }
        }
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        const postConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            axios.post(serviceURL, formData, postConfig)
            .then(response => {
                console.log('File uploaded successfully:', response.data);
                data.setValue(response.data.filename);
                setLast(response.data.filename);
            });
        } catch(err) {
            console.error('Error uploading file:', err);
            setLast(null);
        }
    };

    return (
        <FormControl
            type='file'
            accept='image/*'
            multiple={false}
            onChange={onChange}
        />
    );
};

export default ImageEditCell;