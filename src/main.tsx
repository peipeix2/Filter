import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Home from './pages/Home/index.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <NextUIProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route index element={<Home />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </NextUIProvider>
    </React.StrictMode>
)
