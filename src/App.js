import './App.css';
import AppRoutesControl from './routes/Index';
import { AuthProvider } from './context/AuthContext';
import { StyleProvider } from './context/StyleContext';
import { BrowserRouter } from 'react-router-dom';


const App = () => {
  

  return (
    <BrowserRouter>
     <StyleProvider>
      <AuthProvider>
      <AppRoutesControl/>
     </AuthProvider>
    </StyleProvider>
   </BrowserRouter>
  );
}

export default App;
