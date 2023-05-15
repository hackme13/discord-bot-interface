import './App.css';
import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom"
import { useState } from 'react';

import "@arco-design/web-react/dist/css/arco.css"

//importing pages
import Sidebar from './components/sidebar/Sidebar';
import Login from './pages/login/login.route';
import Signup from './pages/signup/signup.route';
import Home from './pages/home/home.route';
import PageNotFound from './pages/pageNotFound';
import { useEffect } from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import IdleTimer from './pages/login/idleTimer';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token){
      setLoggedIn(false)
    } else {
      setLoggedIn(true);
    }
  }, [loggedIn]);

  useEffect(() => {
    const timer = new IdleTimer({
      timeout: 600, //expire after 5 minutes
      onTimeout: () => {
        if (window.localStorage.getItem('token')){
            window.localStorage.removeItem("token")
            setLoggedIn(false)
            window.location.reload()
        }
      },
      onExpired: () => {
        if (window.localStorage.getItem('token')){
            window.localStorage.removeItem("token")
            setLoggedIn(false)
            window.location.reload()
        }
      }
    });

    return () => {
      timer.cleanUp();
    };
  }, []);

 
  return (
    <>
      <div className="App">
        <div className='app-wrapper'>
          {
            loggedIn === true ? 
            <BrowserRouter>
            <Sidebar />
            <Outlet />
            <QueryClientProvider client={queryClient}>
            <div className='main'>
                  <Routes>
                    <Route path='/' element={<Home />} />

                    {/* 👇️ only match this when no other routes match */}
                    <Route path="*" element={<PageNotFound />} logStatus={{loggedIn}} />
                  </Routes>
            </div>
            </QueryClientProvider>
          </BrowserRouter>
          : 
            <BrowserRouter>
              <Routes>
                <Route path='/login' element={<Login logStatus={{loggedIn, setLoggedIn}}/>} />
                <Route path='/signup' element={<Signup />} />

                {/* 👇️ only match this when no other routes match */}
                <Route path="/*" element={<PageNotFound />} />
              </Routes>
            </BrowserRouter>
        }
        </div>
      </div>
    </>
  );
}

export default App;
