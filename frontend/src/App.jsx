import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from "./components/layout/Container";
import Home from "./components/pages/Home";
import Nav from "./components/layout/Nav";
import Tasks from "./components/pages/Tasks";
import Account from "./components/pages/Account";
import Login from "./components/pages/Login";

const NavigationWraper = () => {
  const location = useLocation();
  return location.pathname !== "/" && <Nav />;
}

function App() {

  return (
    <Router>
      <NavigationWraper />

      <Container customClass="min_heiht">

        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/home" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/my-account" element={<Account />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
