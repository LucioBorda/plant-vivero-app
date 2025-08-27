import { useEffect, useState } from "react";
import { getAllPlants, deletePlant } from "../api/plantsApi";

function PlantList() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    const data = await getAllPlants();
    setPlants(data);
  };

  const handleDelete = async (id) => {
    await deletePlant(id);
    loadPlants(); // recarga la lista
  };

  return (
    <div>
      <h1>Plant List</h1>
      <ul>
        {plants.map((plant) => (
          <li key={plant.id}>
            {plant.name} - {plant.species}
            <button onClick={() => handleDelete(plant.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlantList;
