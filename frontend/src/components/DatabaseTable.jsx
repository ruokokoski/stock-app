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
            style={{ width: '3%', cursor: 'pointer' }}
            onClick={() => onSort('ticker')}
          >
            Tick {getSortIndicator('ticker')}
          </th>
          <th 
            style={{ width: '31%', cursor: 'pointer' }}
            onClick={() => onSort('name')}
          >
            Name {getSortIndicator('name')}
          </th>
          <th style={{ width: '7%' }}>Price</th>
          <th style={{ width: '7%' }}>24h</th>
          <th style={{ width: '8%' }}>YTD</th>
          <th style={{ width: '8%' }}>MCap</th>
          <th style={{ width: '7%' }}>P/E</th>
          <th style={{ width: '7%' }}>P/B</th>
          <th style={{ width: '8%' }}>ROE</th>
          <th style={{ width: '8%' }}>Div</th>
          <th style={{ width: '8%' }}>Updated</th>
          <th style={{ width: '3%' }}></th>
        </tr>
      </thead>
      <tbody>
        {data.map(renderRow)}
      </tbody>
    </Table>
  )
}

export default DatabaseTable