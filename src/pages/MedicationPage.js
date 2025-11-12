import React, { useState } from 'react';
import axios from 'axios';

const MedicationPage = () => {
  const [drugName, setDrugName] = useState('');
  const [drugInfo, setDrugInfo] = useState({});
  const [interactions, setInteractions] = useState([]);
  const [message, setMessage] = useState('');

  const fetchDrugData = async () => {
    setMessage('');
    setDrugInfo({});
    setInteractions([]);

    try {
      // Step 1: Get RxCUI code
      const rxcuiRes = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${drugName}`);
      const rxcui = rxcuiRes.data.idGroup?.rxnormId?.[0];

      if (!rxcui) {
        setMessage('Drug not found. Please enter a generic name like Ibuprofen or Metformin.');
        return;
      }

      // Step 2: Get drug properties from RxNav
      let name = 'Not available';
      let type = 'Not available';
      try {
        const propsRes = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/properties.json`);
        const props = propsRes.data.properties;
        name = props.name || name;
        type = props.tty || type;
      } catch {}

      // Step 3: Get synonyms using /drugs.json
      let synonym = 'Not available';
      try {
        const synonymRes = await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${drugName}`);
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

      // Step 4: Get common uses from openFDA
      let uses = 'Use information not available';
      try {
        const fdaRes = await axios.get(`https://api.fda.gov/drug/label.json?search=generic_name:${drugName.toLowerCase()}`);
        const label = fdaRes.data.results?.[0];
        uses = label?.indications_and_usage?.[0] || uses;
      } catch {}

      // Step 5: Get interaction data from RxNav
      let interactionData = [];
      try {
        const interactionRes = await axios.get(`https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${rxcui}`);
        interactionData = interactionRes.data.interactionTypeGroup || [];
      } catch {}

      setDrugInfo({ name, type, uses, synonym });
      setInteractions(interactionData);
    } catch {
      setMessage('Error fetching drug data. Please check your internet connection or try a different name.');
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
