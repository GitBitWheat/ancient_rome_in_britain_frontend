const LinkCell = ({ data }) => {
    const link = data.value.startsWith('https://') ? data.value : `https://${data.value}`;
    return (
        <a href={link}>
            {data.value}
        </a>
    );
};

export default LinkCell;