import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// create navigation
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Home.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/app" element={<App />} />
            </Routes>
        </Router>
    </StrictMode>
)
