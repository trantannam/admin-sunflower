import Layout from 'components/Layout';
import Login from 'pages/Login';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import './sass/index.scss';

function App() {
  const { userSignin } = useSelector(state => state);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userSignin.name) {
      return navigate('/login')
    }
  }, [userSignin])
  
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        {
          userSignin.accessToken &&
          <Route path="*" element={<Layout/>}/>
        }
      </Routes>
      <ToastContainer style={{ fontSize: 15, zIndex: 1000 }} />
    </div>
  );
}

export default App;
