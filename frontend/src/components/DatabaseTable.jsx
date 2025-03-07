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
            style={{ width: '29%', cursor: 'pointer' }}
            onClick={() => onSort('name')}
          >
            Name {getSortIndicator('name')}
          </th>
          <th 
            style={{ width: '8%', cursor: 'pointer' }}
            onClick={() => onSort('latest')}
          >
            Price {getSortIndicator('latest')}
          </th>
          <th style={{ width: '7%' }}>24h</th>
          <th 
            style={{ width: '8%', cursor: 'pointer' }}
            onClick={() => onSort('ytdpricereturn')}
          >
            YTD {getSortIndicator('ytdpricereturn')}
          </th>
          <th 
            style={{ width: '9%', cursor: 'pointer' }}
            onClick={() => onSort('marketcap')}
          >
            MCap {getSortIndicator('marketcap')}
          </th>
          <th 
            style={{ width: '7%', cursor: 'pointer' }}
            onClick={() => onSort('pe')}
          >
            P/E {getSortIndicator('pe')}
          </th>
          <th 
            style={{ width: '7%', cursor: 'pointer' }}
            onClick={() => onSort('pb')}
          >
            P/B {getSortIndicator('pb')}
          </th>
          <th 
            style={{ width: '8%', cursor: 'pointer' }}
            onClick={() => onSort('roe')}
          >
            ROE {getSortIndicator('roe')}
          </th>
          <th 
            style={{ width: '8%', cursor: 'pointer' }}
            onClick={() => onSort('divyield')}
          >
            Div {getSortIndicator('divyield')}
          </th>
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