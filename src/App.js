import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data when component mounts
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    const uploadFile = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || "Error uploading file");
            }

            alert(result.message);
            
            // Clear the file input
            setFile(null);
            // Reset the file input element
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
            
            // Fetch updated data
            await fetchData();
        } catch (error) {
            console.error("Error uploading file:", error);
            setError(error.message);
            alert("Error uploading file: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch("http://localhost:5000/get_data");
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || "Error fetching data");
            }
            
            console.log("Fetched data:", result);
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Upload an Excel File</h1>

                {/* File upload section */}
                <div className="upload-section">
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        accept=".xlsx,.xls"
                    />
                    <button 
                        onClick={uploadFile}
                        disabled={loading || !file}
                    >
                        {loading ? 'Processing...' : 'Upload File'}
                    </button>
                </div>

                {/* Error display */}
                {error && (
                    <div className="error-message">
                        Error: {error}
                    </div>
                )}

                {/* Data display section */}
                <h2>Uploaded Data:</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : data.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    {Object.keys(data[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((value, i) => (
                                            <td key={i}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No data available</p>
                )}
            </header>
        </div>
    );
}

export default App;