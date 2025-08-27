import PlantList from "./pages/PlantList";
import PlantForm from "./pages/PlantForm";

function App() {
  return (
    <div>
      <h1>Plant CRUD</h1>
      <PlantForm />
      <PlantList />
    </div>
  );
}

export default App;
