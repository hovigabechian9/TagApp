//import logo from './logo.svg';
import {Route, Routes} from 'react-router-dom'
import './App.css';
import {Amplify} from 'aws-amplify';
import awsconfig from './aws-exports';
import {Authenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // Assurez-vous d'importer les styles si nécessaire
import 'bootstrap/dist/css/bootstrap.min.css';

import SiteNav from './Common/SiteNav';
import HomePage from './Home/HomePage';
import Tag_AWS from "./Common/Tag_AWS";

Amplify.configure(awsconfig);

function App() {
  return (
    <Authenticator>
      {({ signOut}) => (
        <div>
          <SiteNav signOut={signOut} />
          
          <Routes>
            <Route path='*' element={<HomePage />} />
            <Route path='/' exact={true} element={<HomePage />} />    
            <Route path='/Tag' exact={true} element={<Tag_AWS />} />       
          </Routes>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
