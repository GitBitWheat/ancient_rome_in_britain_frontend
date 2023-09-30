import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../searchbar/searchbar';
import './homepage.css';

const HomePage = () => {

    const nav = useNavigate();
    const onSearchBarEnterKey = useCallback(_event => {
        nav('/entries');
    }, [nav]);

    return <div className="home-page-container">
        <h1 className='title'>The Reception of Ancient Rome in British Children's Culture 1945-2020</h1>
        <SearchBar
            className='home-page-search-bar'
            onEnterKey={onSearchBarEnterKey}
        />
    </div>;
};

export default HomePage;