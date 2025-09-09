import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import PlantList from "./pages/PlantList";
import PlantForm from "./pages/PlantForm";
import CategoryForm from "./pages/CategoryForm";
import PlantDetail from "./pages/PlantsDetail";

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<PlantList />} />
          <Route path="/plants/new" element={<PlantForm />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/plants/:id" element={<PlantDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
