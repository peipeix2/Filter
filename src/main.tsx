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
import Read from './pages/Read/index.tsx'
import Comment from './pages/Read/Comment.tsx'
import Profile from './pages/Profile/index.tsx'
import Discover from './pages/Profile/Discover.tsx'
import Activity from './pages/Profile/Activity.tsx'
import Network from './pages/Profile/Network.tsx'
import EditPage from './pages/Review/EditPage.tsx'
import Likes from './pages/Profile/Likes.tsx'
import Setting from './pages/Profile/Setting.tsx'
import Gallery from './pages/Gallery/index.tsx'
import Calendar from './pages/Profile/Calendar.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClientProvider, QueryClient } from 'react-query'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="/:category" element={<Gallery />} />
              <Route path="/movies/:id" element={<Movies />}>
                <Route index element={<Cast />} />
                <Route path="cast" element={<Cast />} />
                <Route path="crew" element={<Crew />} />
                <Route path="details" element={<Details />} />
                <Route path="releases" element={<Releases />} />
              </Route>
              <Route path="/review/:id" element={<Review />} />
              <Route path="/review/revision/:reviewId" element={<EditPage />} />
              <Route path="/read/:userId/:id" element={<Read />} />
              <Route path="/comment/:userId/:id" element={<Comment />} />
              <Route path="/profile/:userId" element={<Profile />}>
                <Route index element={<Activity />} />
                <Route path="discover" element={<Discover />} />
                <Route path="activity" element={<Activity />} />
                <Route path="network" element={<Network />} />
                <Route path="likes" element={<Likes />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="setting" element={<Setting />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </NextUIProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
