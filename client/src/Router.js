import { HashRouter, Routes, Route } from "react-router-dom";
import Sheet from "./features/Sheet/Sheet";
import Login from "./pages/Login";
import Admin from "./features/Sheet/Admin";

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/Sheet" element={<Sheet />} />
        <Route path="/" element={<Login />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  )
}

export default Router;