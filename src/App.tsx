import './App.scss';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import User from './pages/User';
import Admin from './pages/Admin';
import NewSafe from './pages/NewSafe';
import { useAuth } from './providers/AuthProvider';
import ProtectedRoute from './providers/ProtectedRoute';
import { useEffect } from 'react';

function App() {
    const { user } = useAuth();
    const location = useLocation()

    useEffect(()=>{
        window.scrollTo(0, 0)
    },[location.pathname])
    

    return (
       
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />


                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/admin/safe/new" element={<ProtectedRoute><NewSafe edit={false} /></ProtectedRoute>} />
                <Route path="/admin/safe/:id" element={<ProtectedRoute><NewSafe edit={true} /></ProtectedRoute>} />


                <Route
                    path="*"
                    element={
                        user ? (
                            user.role === "admin" ? (
                                <Navigate to="/admin" />
                            ) : (
                                <Navigate to="/user" />
                            )
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
     
    );
}

export default App;
