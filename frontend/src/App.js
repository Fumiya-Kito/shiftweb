// import logo from './logo.svg';
import Header from "./components/Header";

import { HashRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ProfileUpdateScreen from "./screens/ProfileUpdateScreen";
import { LoginProvider } from "./context";
import { ProfileProvider } from "./context";
import { ShiftProvider } from "./context";

import ShiftConfirmScreen from "./screens/ShiftConfirmScreen";
import ShiftUpdateScreen from "./screens/ShiftUpdateScreen";
import ShiftSubmitScreen from "./screens/ShiftSubmitScreen";
import ShiftItemForm from "./components/ShiftItemForm";
import ShiftItemUpdateForm from "./components/ShiftItemUpdateForm";

import DemoProfileScreen from "./demo/DemoProfileScreen";
import DemoProfileUpdateScreen from "./demo/DemoProfileUpdateScreen";
import DemoSubmitScreen from "./demo/DemoSubmitScreen";
import DemoShiftUpdateScreen from "./demo/DemoShiftUpdateScreen";
import DemoShiftConfirmScreen from "./demo/DemoShiftConfirmScreen";
import DemoUserListScreen from "./demo/DemoUserListScreen";
import DemoUserEditScreen from "./demo/DemoUserEditScreen";
import DemoShiftListScreen from "./demo/DemoShiftListScreen";

import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ShiftListScreen from "./screens/ShiftListScreen";

function App() {
  return (
    <Router>
      <LoginProvider>
        <ShiftProvider>
          <ProfileProvider>
            <Header />
            <main className="py-3">
              <Container>
                <Route path="/" component={HomeScreen} exact />
                <Route path="/register" component={RegisterScreen} />
                <Route path="/login" component={LoginScreen} />
                <Route
                  path="/shifts/confirm/:id"
                  component={ShiftConfirmScreen}
                />

                <Route path="/profile" component={ProfileScreen} />
                <Route path="/update/profile" component={ProfileUpdateScreen} />
                <Route path="/shifts/test" component={ShiftItemForm} />
                <Route
                  path="/update/test/:id"
                  component={ShiftItemUpdateForm}
                />
                <Route
                  path="/shifts/update/:id"
                  component={ShiftUpdateScreen}
                />
                <Route path="/shifts/submit" component={ShiftSubmitScreen} />

                <Route path="/demo/profile" component={DemoProfileScreen} />
                <Route
                  path="/demo/update/profile"
                  component={DemoProfileUpdateScreen}
                />
                <Route path="/demo/shift/submit" component={DemoSubmitScreen} />
                <Route
                  path="/demo/shifts/update/:id"
                  component={DemoShiftUpdateScreen}
                />
                <Route
                  path="/demo/shifts/confirm/:id"
                  component={DemoShiftConfirmScreen}
                />
                <Route
                  path="/demo/admin/userlist"
                  component={DemoUserListScreen}
                />
                <Route
                  path="/demo/admin/user/:id/edit"
                  component={DemoUserEditScreen}
                />
                <Route
                  path="/demo/admin/shiftlist"
                  component={DemoShiftListScreen}
                />

                <Route path="/admin/userlist" component={UserListScreen} />
                <Route path="/admin/user/:id/edit" component={UserEditScreen} />
                <Route path="/admin/shiftlist" component={ShiftListScreen} />
              </Container>
            </main>
          </ProfileProvider>
        </ShiftProvider>
      </LoginProvider>
    </Router>
  );
}

export default App;
