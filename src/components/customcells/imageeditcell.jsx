import { useState, useCallback } from "react";
import axios from "axios";

const defaultServiceURL = 'actions/files/images';

/**
 * Numeric value custom edit cell
 * @param {Object} props Component props
 * @param {import("devextreme/ui/data_grid").ColumnCellTemplateData} props.data Data prop
 */
const ImageEditCell = ({ data, serviceURL=defaultServiceURL }) => {

    // Last image selected by the input.
    // Saved so it can be removed from the server storage when another image is selected.
    const [last, setLast] = useState(null);

    const onChange = useCallback(
        /** @param {import("react").ChangeEvent<HTMLInputElement>} event */
        event => {
            if (last) {
                try {
                    axios.delete(`${serviceURL}/${last}`)
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
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            };
            try {
                axios.post(serviceURL, formData, config)
                .then(response => {
                    console.log('File uploaded successfully:', response.data);
                    data.setValue(response.data.filename);
                    setLast(response.data.filename);
                });
            } catch(err) {
                console.error('Error uploading file:', err);
                setLast(null);
            }
        },
    [serviceURL, data, last]);

    return (
        <input
            type='file'
            accept='image/*'
            multiple={false}
            onChange={onChange}
        />
    );
};

export default ImageEditCell;