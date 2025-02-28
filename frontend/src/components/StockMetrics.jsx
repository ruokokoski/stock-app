import { Table, Button } from 'react-bootstrap'

const convertToCSV = (data) => {
  if (!data || data.length === 0) return ''

  const metricKeys = Object.keys(data[0]).filter((key) => key !== 'time')
  const headers = ['Date', ...metricKeys].join(';')

  const rows = data.map((entry) =>
    [
    new Date(entry.time).toLocaleDateString(),
    ...metricKeys.map((key) => entry[key] ?? '-')
    ].join(';')
  ).join('\n')

  return `${headers}\n${rows}`
}

const StockMetrics = ({ ticker, quarterlyMetrics, setMessage, setMessageVariant }) => {
  if (!quarterlyMetrics || quarterlyMetrics.length === 0) {
    return <p className="no-data-message">No quarterly metrics available.</p>
  }

  const metricKeys = Object.keys(quarterlyMetrics[0]).filter((key) => key !== 'time')

  const copyTableToClipboard = async () => {
    const csvData = convertToCSV(quarterlyMetrics)
    
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
      const csvData = convertToCSV(quarterlyMetrics)
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const fileName = `quarterly_metrics_${ticker}.csv`
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
            {metricKeys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {quarterlyMetrics.map((entry, index) => (
          <tr key={index}>
            <td>{new Date(entry.time).toLocaleDateString()}</td>
            {metricKeys.map((key) => (
              <td key={key}>{entry[key] ?? '-'}</td>
            ))}
          </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </div>
  )
}

export default StockMetrics