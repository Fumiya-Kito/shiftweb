import logo from './logo.svg';
import Header from './components/Header'

import { HashRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import HomeScreen from './screens/HomeScreen'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import ProfileScreen from './screens/ProfileScreen'
import ProfileUpdateScreen from './screens/ProfileUpdateScreen'
import { LoginProvider } from './context'
import { ProfileProvider } from './context'
import { ShiftProvider } from './context'


import ShiftConfirmScreen from './screens/ShiftConfirmScreen'
import ShiftUpdateScreen from './screens/ShiftUpdateScreen'
import ShiftSubmitScreen from './screens/ShiftSubmitScreen'
import ShiftItemForm from './components/ShiftItemForm'
import ShiftItemUpdateForm from './components/ShiftItemUpdateForm'


function App() {
  return (
    <Router>
      <LoginProvider>
        <ShiftProvider>
          <ProfileProvider>
            <Header />
        <main className='py-3'>
          <Container>
              <Route  path='/' component={HomeScreen} exact />
              <Route path='/register' component={RegisterScreen} />
              <Route path='/login' component={LoginScreen}/>
              <Route path='/shifts/confirm/:id' component={ShiftConfirmScreen} />
              
                <Route path='/profile' component={ProfileScreen} />
                <Route path='/update/profile' component={ProfileUpdateScreen}/>
                <Route path='/shifts/test' component={ShiftItemForm}/>
                <Route path='/update/test/:id' component={ShiftItemUpdateForm}/>
                <Route path='/shifts/update/:id' component={ShiftUpdateScreen}/>
                <Route path='/shifts/submit' component={ShiftSubmitScreen} />
              
          </Container>
        </main>
            </ProfileProvider>
        </ShiftProvider>
      </LoginProvider>
    </Router>
  );
}

export default App;
