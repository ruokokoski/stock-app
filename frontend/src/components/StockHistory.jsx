import { useState } from 'react'
import { handleDateChange } from '../utils/helpers'
import DateInputs from './DateInputs'
import { Table, Button } from 'react-bootstrap'

const convertToCSV = (data) => {
  const headers = ['Date', 'Open', 'Close', 'High', 'Low', 'Volume'].join(';')

  const rows = data.map((entry) => 
    [
      new Date(entry.time).toLocaleDateString(),
      entry.open,
      entry.close,
      entry.high,
      entry.low,
      entry.volume
    ].join(';')
  ).join('\n')

  return `${headers}\n${rows}`
}

const StockHistory = ({
    ticker,
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate, 
    setChartInterval, 
    chartData, 
    selectedInterval,
    setMessage,
    setMessageVariant,
}) => {
  const [localStartDate, setLocalStartDate] = useState('')
  const [localEndDate, setLocalEndDate] = useState('')
  
  const handleSetCustomRange = () => {
    console.log('handlecustom triggered')
    setChartInterval('custom')
    setStartDate(localStartDate)
    setEndDate(localEndDate)
  }

  const copyTableToClipboard = async () => {
    const csvData = convertToCSV(chartData)
    
    try {
      await navigator.clipboard.writeText(csvData)
      setMessage('Table data copied to clipboard.')
      setMessageVariant('success')
    } catch (error) {
      console.error('Failed to copy table data:', error)
      setMessage('Failed to copy table data to clipboard.')
      setMessageVariant('danger')
    }
  }

  const saveToCSVFile = () => {
    try {
        const csvData = convertToCSV(chartData)
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        const fileName = `historical_data_${ticker}_${startDate}_to_${endDate}.csv`
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        setMessage('Table data saved as CSV file.')
        setMessageVariant('success')
    } catch (error) {
        console.error('Failed to save CSV file:', error)
        setMessage('Failed to save CSV file.')
        setMessageVariant('danger')
    }
  }

  return (
    <div>
      <DateInputs 
        startDate={localStartDate}
        endDate={localEndDate}
        handleDateChange={(type, value) => handleDateChange(
          type, 
          value, 
          setLocalStartDate, 
          setLocalEndDate
        )}
        onSet={handleSetCustomRange}
        disabled={!localStartDate || !localEndDate}
        label="Select range for historical prices:"
        maxWidth="200px"
      />

      {selectedInterval === 'custom' && startDate && endDate && chartData.length > 0 ? (
        <div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <Button 
              className="gradient-button"
              onClick={copyTableToClipboard}
            >
              Copy to Clipboard
            </Button>

            <Button 
              className="gradient-button"
              onClick={saveToCSVFile}
            >
              Save to CSV File
            </Button>
          </div>

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
        </div>
      ) : (
        <p className="no-data-message">No historical data available for the selected range</p>
      )}
    </div>
  )
}

export default StockHistory
