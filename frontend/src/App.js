import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Advising from './components/Advising';
import ApiTest from './components/ApiTest';
import AuthPage from './components/AuthPage';
import Chatbot from './components/Chatbot';
import FreeTierVoiceChat from './components/FreeTierVoiceChat';
import Home from './components/Home';
import './components/Layout.css';
import Marketplace from './components/Marketplace';
import Navbar from './components/Navbar';
import './components/styles.css';
import SupplyChainOptimizer from './components/SupplyChainOptimizer';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('leafx_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('leafx_user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('leafx_user');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className='App'>
                <Navbar user={user} onLogout={handleLogout} />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route
                        path='/auth'
                        element={
                            <AuthPage
                                onLogin={handleLogin}
                                user={user}
                            />
                        }
                    />
                    <Route
                        path='/chatbot'
                        element={
                            user ? (
                                <Chatbot user={user} />
                            ) : (
                                <AuthPage
                                    onLogin={handleLogin}
                                    redirectPath='/chatbot'
                                />
                            )
                        }
                    />
                    <Route
                        path='/marketplace'
                        element={
                            user ? (
                                <Marketplace user={user} />
                            ) : (
                                <AuthPage
                                    onLogin={handleLogin}
                                    redirectPath='/marketplace'
                                />
                            )
                        }
                    />
                    <Route
                        path='/advising'
                        element={
                            user ? (
                                <Advising user={user} />
                            ) : (
                                <AuthPage
                                    onLogin={handleLogin}
                                    redirectPath='/advising'
                                />
                            )
                        }
                    />
                    <Route
                        path='/voice-chat'
                        element={
                            user ? (
                                <FreeTierVoiceChat user={user} />
                            ) : (
                                <AuthPage
                                    onLogin={handleLogin}
                                    redirectPath='/voice-chat'
                                />
                            )
                        }
                    />
                    <Route
                        path='/supply-chain'
                        element={
                            user ? (
                                <SupplyChainOptimizer user={user} />
                            ) : (
                                <AuthPage
                                    onLogin={handleLogin}
                                    redirectPath='/supply-chain'
                                />
                            )
                        }
                    />
                    <Route
                        path='/api-test'
                        element={<ApiTest />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
