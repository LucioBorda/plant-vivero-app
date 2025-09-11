import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import PlantList from "./pages/PlantList";
import PlantForm from "./pages/PlantForm";
import CategoryForm from "./pages/CategoryForm";
import PlantDetail from "./pages/PlantsDetail";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="app-container"> {/* ← Esta clase es CLAVE */}
        <Header />
        <main> {/* ← main va directo aquí, sin container extra */}
          <Routes>
            <Route path="/" element={<PlantList />} />
            <Route path="/plants/new" element={<PlantForm />} />
            <Route path="/categories/new" element={<CategoryForm />} />
            <Route path="/plants/:id" element={<PlantDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;