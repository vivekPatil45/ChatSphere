import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Auth, Chat, Profile } from './pages'
import PrivateRoute from './routes/PrivateRoute'
import AuthRoute from './routes/AuthRoute'

const App = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <Auth />
              </AuthRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path='*' element={<Navigate to="/auth"/>}/>

        </Routes>
      </BrowserRouter>
    )
}

export default App
