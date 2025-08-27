import React, { useEffect, useState } from "react";
import PlantCard from "../components/PlantCard";
import { getAllPlants } from "../api/plantsApi";
import "./PlantList.css";

const PlantList = () => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await getAllPlants();
        setPlants(data);
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    };

    fetchPlants();
  }, []);

  return (
    <div>
      <h2>Plant List</h2>
      <div className="plants-grid">
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
};

export default PlantList;
