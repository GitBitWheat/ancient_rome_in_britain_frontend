import './infopage.css';

const InfoPage = ({ text }) => {
    return <div className='info-page-container'>
        <p className='stroke'>{text}</p>
    </div>;
};

export default InfoPage;