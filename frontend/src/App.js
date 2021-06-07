import logo from './logo.svg';
import Header from './components/Header'

import { HashRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import HomeScreen from './screens/HomeScreen'

function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/' component={HomeScreen}/>
        </Container>
      </main>
    </Router>
  );
}

export default App;
