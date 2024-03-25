import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import {Amplify} from 'aws-amplify';
import awsconfig from '../aws-exports';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

Amplify.configure(awsconfig);

const apiKeyAuth = awsconfig.aws_appsync_authenticationType;
const apiKey = awsconfig.aws_appsync_apiKey;

const endpointGet = apiKeyAuth + '/Get'; // Concaténation de l'URL de base avec le chemin spécifique '/Get'
const endpointPost = apiKeyAuth + '/update_tag';


function Tags() {
    const [apiResponse, setApiResponse] = useState([]);
    const [editCell, setEditCell] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [modifiedData, setModifiedData] = useState({}); // Nouvel état pour conserver les modifications
    const [displayData, setDisplayData] = useState(''); // État pour stocker les données modifiées à afficher
    const [filterValues, setFilterValues] = useState({}); // Pour stocker les filtres sélectionnés
    const [showFilters, setShowFilters] = useState(false); // Initialisé à false pour masquer les filtres par défaut
    const [numberOfLines, setNumberOfLines] = useState(0);

    

  
    

    useEffect(() => {
        const fetchApiData = async () => {
            try {
                const response = await axios.get(endpointGet, { headers: { 'x-api-key': awsconfig.aws_appsync_apiKey } });
                const data = JSON.parse(response.data.body);
                setApiResponse(data);
                setNumberOfLines(data.length); // Mise à jour du nombre de lignes
            } catch (error) {
                console.error('Erreur lors de la requête à l\'API', error);
            }
        };

        fetchApiData();
    }, []);

    const toggleFilters = () => setShowFilters(!showFilters); // Fonction pour basculer l'affichage des filtres


    // Créer les options pour les sélecteurs basés sur les données
    const getFilterOptions = (key) => {
        const allValues = apiResponse.map(item => item[key]);
        const uniqueValues = Array.from(new Set(allValues));
        return uniqueValues.map(value => ({ value, label: value || 'N/A' }));
    };

    // Mettre à jour le filtre
    const handleFilterChange = (key, selectedOptions) => {
        setFilterValues(prev => ({ ...prev, [key]: selectedOptions.map(option => option.value) }));
    };

    // Appliquer le filtrage
    const filteredData = apiResponse.filter(row =>
        Object.keys(filterValues).every(key =>
            filterValues[key].length === 0 || filterValues[key].includes(row[key])
        )
    );

    
    const animatedComponents = makeAnimated(); 

    const startEdit = (index, key, value) => {
        setEditCell({ index, key });
        setEditValue(value);
    };

    const saveEdit = () => {
        const updatedData = [...apiResponse];
        updatedData[editCell.index][editCell.key] = editValue;
        setApiResponse(updatedData);

        // Enregistrer les modifications dans un nouvel état
        const newData = { ...modifiedData };
        if (!newData[editCell.index]) {
            newData[editCell.index] = { ...apiResponse[editCell.index] };
        }
        newData[editCell.index][editCell.key] = editValue;
        setModifiedData(newData);

        setEditCell(null); // Quitter le mode édition
    };

    const cancelEdit = () => {
        setEditCell(null);
    };

    const handleChange = (e) => {
        setEditValue(e.target.value);
    };

    const displayModifiedData = () => {
        // Construction de l'objet JSON pour l'affichage
        const modifiedRows = Object.keys(modifiedData).map(key => modifiedData[key]);
        setDisplayData(JSON.stringify(modifiedRows, null, 2)); // Mettre à jour displayData avec les données modifiées
    };


 
    const Pushchange = async () => {
        // Vérifier si displayData contient des données (pas juste un tableau vide)
        if (displayData && JSON.parse(displayData).length > 0) {
            try {

                const response = await axios.post(
                    endpointPost,
                    JSON.parse(displayData), // Assurez-vous que displayData est bien formaté en tant qu'objet JSON
                    {
                        headers: {
                            'x-api-key': apiKey, // Remplacez 'VOTRE_CLE_API' par votre véritable clé API
                            'Content-Type': 'application/json'
                        }
                    }
                );
                // Gérer la réponse de succès ici, par exemple en affichant une alerte ou en mettant à jour l'état
                console.log('Success:', response.data);
                alert('Données modifiées envoyées avec succès.');
            } catch (error) {
                console.error('Erreur lors de l\'envoi des données modifiées:', error);
                alert('Erreur lors de l\'envoi des données modifiées.');
            }
        } else {
            alert("Erreur : Aucune donnée modifiée à envoyer.");
        }
    };
    
    

    const sortedKeys = apiResponse.reduce((keysAccumulator, currentItem) => {
        Object.keys(currentItem).forEach(key => {
            if (!keysAccumulator.includes(key)) {
                keysAccumulator.push(key);
            }
        });
        return keysAccumulator;
    }, []).sort((a, b) => {
        // Vous pouvez ajuster cette partie pour personnaliser le tri de vos clés
        const priority = ["AccountId", "AccountName", "Provider"]; // Exemple de clés prioritaires
        let ai = priority.indexOf(a), bi = priority.indexOf(b);
        ai = ai === -1 ? Infinity : ai;
        bi = bi === -1 ? Infinity : bi;
        return ai - bi || a.localeCompare(b); // Tri basé sur la priorité puis alphabétiquement
    });
    

    return (
        <Container>
            <h2 className="text-center">AWS Account Tag</h2>
            <Button onClick={toggleFilters} style={{ marginBottom: '10px' }}>
                {showFilters ? 'Hide Filters' : 'Show filters'}
            </Button>     
            <div>Number of accounts : {numberOfLines}</div> {/* Affichage du nombre de lignes */}
            {apiResponse.length > 0 && (
                <>
                    <div style={{ overflowX: 'auto' }}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {sortedKeys.map((key) => (
                                        <th key={key}>
                                            {key}
                                            {showFilters && <Select
                                                components={animatedComponents}
                                                isMulti
                                                closeMenuOnSelect={false}
                                                options={getFilterOptions(key)}
                                                onChange={(selectedOptions) => handleFilterChange(key, selectedOptions)}
                                            />}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index}>
                                        {sortedKeys.map((key) => (
                                            <td key={key}>
                                                {editCell && editCell.index === index && editCell.key === key ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={editValue}
                                                            onChange={handleChange}
                                                            autoFocus
                                                        />
                                                        <Button size="sm" variant="success" onClick={saveEdit}>Save</Button>
                                                        <Button size="sm" variant="danger" onClick={cancelEdit} style={{ marginLeft: '5px' }}>Cancel</Button>
                                                    </>
                                                ) : (
                                                    <div onClick={() => startEdit(index, key, item[key] || 'N/A')}>
                                                        {item[key] || 'N/A'}
                                                    </div>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <Button onClick={displayModifiedData}>Show Modified Rows</Button>
                    {displayData && (
                        <div style={{ marginTop: '20px', border: '1px solid black', padding: '10px', whiteSpace: 'pre-wrap' }}>
                            {displayData}
                        </div>
                    )}
                    <Button onClick={Pushchange} style={{ marginLeft: '10px' }}>Validate & Push</Button>
                </>
            )}
        </Container>
    );
}

export default Tags;
