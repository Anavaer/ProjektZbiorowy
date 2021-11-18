import React, { useEffect, useState } from 'react';
import './App.css';
import { ApiService } from "./services/api-service";

function App() {
  const [sampleData, setSampleData] = useState(null)

  useEffect(() => {
    const apiService = new ApiService();
    apiService.getSampleData().then(response => setSampleData(response.data));
  }, [])

console.log(sampleData)
  return (
    <div className="App">
      <header className="App-header">
        <p>Adres: {sampleData.address}</p>
        <p>Miasto: {sampleData.city}</p>
        <p>Nazwa firmy: {sampleData.companyName}</p>
        <p>Imię: {sampleData.firstName}</p>
        <p>Nazwisko: {sampleData.LastName}</p>
        <p>NIP: {sampleData.nip}</p>
      </header>
    </div>
  );
}

export default App;
