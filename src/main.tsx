import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Home from './pages/Home/index.tsx'
import Movies from './pages/Movies/index.tsx'
import Cast from './pages/Movies/nestedRoutes/Cast.tsx'
import Crew from './pages/Movies/nestedRoutes/Crew.tsx'
import Details from './pages/Movies/nestedRoutes/Details.tsx'
import Releases from './pages/Movies/nestedRoutes/Releases.tsx'
import Review from './pages/Review/index.jsx'
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
                        <Route path="/movies/:id" element={<Movies />}>
                            <Route index element={<Cast />} />
                            <Route path="cast" element={<Cast />} />
                            <Route path="crew" element={<Crew />} />
                            <Route path="details" element={<Details />} />
                            <Route path="releases" element={<Releases />} />
                        </Route>
                        <Route path="/review/:id" element={<Review />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </NextUIProvider>
    </React.StrictMode>
)
