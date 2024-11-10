import React, { useRef } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

const Spreadsheet = () => {
  const hotTableComponent = useRef(null);

  // Create an array with 50 empty rows
  const data = Array(100).fill(['', '']);

  const colHeaders = ['Types', 'Cost'];
  const colWidths = [300, 150]; // Set a bigger width for column A

  const handleSubmit = () => {
    const hotInstance = hotTableComponent.current.hotInstance;
    const tableData = hotInstance.getData();
    console.log('Table Data:', tableData);

    // Send data to backend using fetch
    fetch('http://localhost:5000/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: tableData }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      <div>
        <h2>Total Budget </h2>
        <HotTable
          ref={hotTableComponent}
          data={data}
          colHeaders={colHeaders}
          colWidths={colWidths}
          rowHeaders={true}
          width="550"
          height="300"
          licenseKey="non-commercial-and-evaluation"
        />
      </div>
      <div >
        <button style={{ margin:'20px 260px'}} onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
};

export default Spreadsheet;
