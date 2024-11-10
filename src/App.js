
import './App.css';
import BudgetAllocationChart from './BudgetAllocationChart';
import ExcelGrid from './ExcelGrid';
import FileUpload from './FileUpload';
import Fundraising from './Fundraising';

function App() {
  return (
    <div className="App">
      <h1>Hi</h1>
      <FileUpload/>
      <ExcelGrid/>
      <Fundraising/>
      <BudgetAllocationChart/>

    </div>
  );
}

export default App;
