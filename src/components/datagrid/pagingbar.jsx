import { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";

const mouseDownEventHandlerPreventEffect = event => {event.preventDefault();};

export const PagingBar = ({ setPagingIndex=_idx=>{}, numPages }) => {
    const [localPagingIndex, setLocalPagingIndex] = useState(0);

    // Is the prev/next pagination item disabled
    // Wrapped in useState and useEffect because otherwise it produces an error for some reason
    const [isPrevDisabled, setIsPrevDisabled] = useState(true);
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    useEffect(() => {
        setIsPrevDisabled(localPagingIndex <= 0)
        setIsNextDisabled(numPages ? (localPagingIndex >= numPages - 1) : true);
    }, [localPagingIndex, numPages]);

    // Which items are hidden
    // Wrapped in useState and useEffect because otherwise it produces an error for some reason
    const [hidden, setHidden] = useState({ '-2': true, '-1': true, '+1': true, '+2': true });
    useEffect(() => {
        setHidden({
            '-2': localPagingIndex - 2 < 0,
            '-1': localPagingIndex - 1 < 0,
            '+1': localPagingIndex + 1 > numPages - 1,
            '+2': localPagingIndex + 2 > numPages - 1,
        });
    }, [localPagingIndex, numPages]);

    if (!(!!numPages) || numPages <= 1) {
        return <></>;
    }

    const generateOnClick = idx => _event => {
        setPagingIndex(idx);
        setLocalPagingIndex(idx);
    };

    return (
        <Pagination onMouseDown={mouseDownEventHandlerPreventEffect}>
            <Pagination.First onClick={generateOnClick(0)}/>
            <Pagination.Prev onClick={generateOnClick(localPagingIndex - 1)} disabled={isPrevDisabled}/>
            
            <Pagination.Item
                onClick={generateOnClick(localPagingIndex - 2)}
                hidden={hidden['-2']}
            >
                {localPagingIndex - 1}
            </Pagination.Item>
            <Pagination.Item
                onClick={generateOnClick(localPagingIndex - 1)}
                hidden={hidden['-1']}
            >
                {localPagingIndex}
            </Pagination.Item>
            <Pagination.Item
                onClick={generateOnClick(localPagingIndex)}
                active
            >
                {localPagingIndex + 1}
            </Pagination.Item>
            <Pagination.Item
                onClick={generateOnClick(localPagingIndex + 1)}
                hidden={hidden['+1']}
            >
                {localPagingIndex + 2}
            </Pagination.Item>
            <Pagination.Item
                onClick={generateOnClick(localPagingIndex + 2)}
                hidden={hidden['+2']}
            >
                {localPagingIndex + 3}
            </Pagination.Item>

            <Pagination.Next onClick={generateOnClick(localPagingIndex + 1)} disabled={isNextDisabled}/>
            <Pagination.Last onClick={generateOnClick(numPages - 1)}/>
        </Pagination>
    );
};

export default PagingBar;