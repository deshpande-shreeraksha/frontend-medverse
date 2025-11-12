import React, { useState } from 'react';
import axios from 'axios';

const MedicationPage = () => {
  const [drugName, setDrugName] = useState('');
  const [drugInfo, setDrugInfo] = useState({});
  const [interactions, setInteractions] = useState([]);
  const [message, setMessage] = useState('');

  const fallbackUses = {
    ibuprofen: 'Used to reduce fever and relieve pain or inflammation.',
    amoxicillin: 'Treats bacterial infections like bronchitis, pneumonia, and tonsillitis.',
    metformin: 'Manages type 2 diabetes by lowering blood sugar.',
    atorvastatin: 'Lowers cholesterol and prevents heart disease.',
    omeprazole: 'Treats acid reflux, ulcers, and GERD.',
    paracetamol: 'Relieves mild to moderate pain and reduces fever.',
    azithromycin: 'Used for respiratory infections, skin infections, and sexually transmitted diseases.',
    albuterol: 'Relieves bronchospasm in conditions like asthma and COPD.',
    simvastatin: 'Lowers cholesterol and reduces risk of cardiovascular disease.',
    losartan: 'Treats high blood pressure and protects kidneys from damage due to diabetes.'
  };

  const fetchDrugData = async () => {
    setMessage('');
    setDrugInfo({});
    setInteractions([]);

    const formattedName = drugName.trim().toLowerCase();
    if (!formattedName) {
      setMessage('Please enter a valid drug name.');
      return;
    }

    try {
      // Step 1: Get RxCUI code
      const rxcuiRes = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${formattedName}`);
      const rxcui = rxcuiRes.data.idGroup?.rxnormId?.[0];

      if (!rxcui) {
        setMessage('Drug not found. Try a generic name like Ibuprofen or Metformin.');
        return;
      }

      // Step 2: Get drug properties
      let name = 'Not available';
      let type = 'Not available';
      try {
        const propsRes = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/properties.json`);
        const props = propsRes.data.properties;
        name = props.name || name;
        type = props.tty || type;
      } catch {}

      // Step 3: Get synonyms
      let synonym = 'Not available';
      try {
        const synonymRes = await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${formattedName}`);
        const groups = synonymRes.data.drugGroup?.conceptGroup || [];
        const names = [];

        groups.forEach(group => {
          group.conceptProperties?.forEach(prop => {
            if (prop.name) names.push(prop.name);
          });
        });

        if (names.length > 0) {
          synonym = [...new Set(names)].join(', ');
        }
      } catch {}

      let uses = 'Use information not available';
try {
  const fdaRes = await axios.get(`https://api.fda.gov/drug/label.json?search=generic_name:${formattedName}+OR+brand_name:${formattedName}+OR+active_ingredient:${formattedName}`);
  const label = fdaRes.data.results?.[0];
  uses = label?.indications_and_usage?.[0] || label?.purpose?.[0] || uses;
} catch {}


      // Step 5: Fallback if openFDA fails
      if (uses === 'Use information not available') {
        uses = fallbackUses[formattedName] || uses;
      }

      // Step 6: Get interaction data
      let interactionData = [];
      try {
        const interactionRes = await axios.get(`https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${rxcui}`);
        interactionData = interactionRes.data.interactionTypeGroup || [];
      } catch {}

      setDrugInfo({ name, type, uses, synonym });
      setInteractions(interactionData);
    } catch {
      setMessage('Error fetching drug data. Please try again or check your internet connection.');
    }
  };

  return (
    <div className="container py-4">
      <h2>🔍 Medication Lookup & Interaction Scan</h2>
      <input
        type="text"
        value={drugName}
        onChange={(e) => setDrugName(e.target.value)}
        placeholder="Enter medication name (e.g. Ibuprofen)"
        className="form-control mb-2"
      />
      <button onClick={fetchDrugData} className="btn btn-primary">Search Medication</button>

      {message && <p className="mt-3 text-danger">{message}</p>}

      {drugInfo.name && (
        <div className="mt-4">
          <h5>💊 Drug Information</h5>
          <p><strong>Name:</strong> {drugInfo.name}</p>
          <p><strong>Type:</strong> {drugInfo.type}</p>
          <p><strong>Common Uses:</strong> {drugInfo.uses}</p>
          <p><strong>Synonyms:</strong> {drugInfo.synonym}</p>
        </div>
      )}

      {interactions.length > 0 && (
        <div className="mt-4">
          <h5>🔗 Interaction Warnings</h5>
          <ul>
            {interactions.map((group, i) => (
              <li key={i}>
                {group.sourceName}: {group.interactionType[0].interactionPair[0].description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MedicationPage;
