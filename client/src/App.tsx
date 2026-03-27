import { useState } from "react";
import { Routes, Route, Router, Link } from "react-router-dom";
import Users from "./pages/user";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <div> <Link to="pages/user">User Page</Link> </div>
      <div>
        <Routes>
          <Route path="/pages/user" element={<Users />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
