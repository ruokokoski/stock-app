import { handleDateChange } from '../utils/helpers'
import DateInputs from './DateInputs'
import { Table } from 'react-bootstrap'

const StockHistory = ({ startDate, setStartDate, endDate, setEndDate, setChartInterval, chartData, selectedInterval }) => {
  return (
    <div>
      <DateInputs 
        startDate={startDate} 
        endDate={endDate} 
        handleDateChange={(type, value) => handleDateChange(type, value, setStartDate, setEndDate, setChartInterval)}
        label="Select range for historical prices:"
        maxWidth="200px"
      />

      {selectedInterval === 'custom' && startDate && endDate && chartData.length > 0 ? (
        <div className="table-responsive">
          <Table striped bordered hover className="tight-table" style={{ width: '100%' }}>
            <thead>
                <tr>
                <th>Date</th>
                <th>Open</th>
                <th>Close</th>
                <th>High</th>
                <th>Low</th>
                <th>Volume</th>
                </tr>
            </thead>
            <tbody>
                {chartData.map((entry, index) => (
                <tr key={index}>
                    <td>{new Date(entry.time).toLocaleDateString()}</td>
                    <td>{entry.open}</td>
                    <td>{entry.close}</td>
                    <td>{entry.high}</td>
                    <td>{entry.low}</td>
                    <td>{entry.volume.toLocaleString()}</td>
                </tr>
                ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <p className="no-data-message">No historical data available for the selected range</p>
      )}
    </div>
  )
}

export default StockHistory
