import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginContextProvider } from './components/contexts/logincontext';
import { SearchFiltersContextProvider } from "./components/contexts/searchfilterscontext";

import NavigationBar from './components/navigationbar/navigationbar';
import HomePage from './components/homepage/homepage';
import EntryGridsPage from './components/entrygridspage/entrygridspage';
import InfoPage from './components/infopage/infopage';
import LoginPage from './components/loginpage/loginpage';
import ListsPage from './components/listspage/listspage';
import info from './static/info.json';
              
function App() {
    return (
        <BrowserRouter>
        <LoginContextProvider>
            <div className="App">
                <NavigationBar/>
                <SearchFiltersContextProvider>
                    <div className='app-content'>
                        <Routes>
                            <Route index element={<HomePage/>}/>
                            <Route path='/entries' element={<EntryGridsPage/>}/>
                            <Route path='/about' element={<InfoPage text={info.about}/>}/>
                            <Route path='/contact' element={<InfoPage text={info.contact}/>}/>
                            <Route path='/login' element={<LoginPage/>}/>
                            <Route path='/lists' element={<ListsPage/>}/>
                        </Routes>
                    </div>
                </SearchFiltersContextProvider>
            </div>
        </LoginContextProvider>
        </BrowserRouter>
    );
}

export default App;