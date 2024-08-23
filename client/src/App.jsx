import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Auth, Chat, Profile } from './pages'
import PrivateRoute from './routes/PrivateRoute'
import AuthRoute from './routes/AuthRoute'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData ,selectedUserData} from './store/slices/authSlice'

const App = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  console.log(API_URL);
  
  const userData = useSelector(selectedUserData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/user-data`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.user._id) {
          dispatch(setUserData(data.user));
        }
      } catch (error) {
        dispatch(setUserData(undefined));
      } finally {
        setLoading(false);
      }
    };

    if (!userData) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return <div>Loading...</div>;
  }



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
