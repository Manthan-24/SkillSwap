import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import RequestsInbox from "./pages/RequestsInbox";

import NotFound from "./pages/NotFound";
import { PrivateRoute } from "./Routes/PrivateRoute";
import PublicRoute from "./Routes/PublicRoute";

function App() {
  return (
    <Router>
   
      <Routes>
        <Route element={<PublicRoute/>}>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<PrivateRoute/>}>
          
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/inbox" element={<RequestsInbox />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;