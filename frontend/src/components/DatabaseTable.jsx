import { Table } from 'react-bootstrap'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

const DatabaseTable = ({ data, renderRow, sortConfig, onSort }) => {
  const getSortIndicator = (field) => {
    if (sortConfig.field !== field) return <FaSort size={14} className="text-muted" />
    return sortConfig.order === 'ASC' ? <FaSortUp size={18} /> : <FaSortDown size={18} />
  }
  
  return (
    <Table striped bordered hover className="tight-table" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th 
            style={{ width: '10%', cursor: 'pointer' }}
            onClick={() => onSort('ticker')}
          >
            Ticker {getSortIndicator('ticker')}
          </th>
          <th 
            style={{ width: '35%', cursor: 'pointer' }}
            onClick={() => onSort('name')}
          >
            Name {getSortIndicator('name')}
          </th>
          <th style={{ width: '15%' }}>Price</th>
          <th style={{ width: '15%' }}>Change 24h</th>
          <th style={{ width: '25%' }}>Date/Time</th>
          <th style={{ width: '5%' }}></th>
        </tr>
      </thead>
      <tbody>
        {data.map(renderRow)}
      </tbody>
    </Table>
  )
}

export default DatabaseTable