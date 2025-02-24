import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Container from "./components/layout/Container";
import Home from "./components/pages/Home";
import Nav from "./components/layout/Nav";
import Tasks from "./components/pages/Tasks";
import Account from "./components/pages/Account";
import Login from "./components/pages/Login";

function App() {

  return (
    <Router>
      <Nav />

      <Container customClass="min_heiht">

        <Routes>
          <Route default path="/" element={<Login />} />
          <Route exact path="/home" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/my-account" element={<Account />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
