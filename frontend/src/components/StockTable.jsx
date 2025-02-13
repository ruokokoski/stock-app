import { Table } from 'react-bootstrap'

const StockTable = ({ data, renderRow }) => {
  return (
    <Table striped bordered hover className="tight-table" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th style={{ width: '10%' }}>Ticker</th>
          <th style={{ width: '35%' }}>Name</th>
          <th style={{ width: '15%' }}>Price</th>
          <th style={{ width: '15%' }}>% Change</th>
          <th style={{ width: '25%' }}>Date/Time</th>
        </tr>
      </thead>
      <tbody>
        {data.map(renderRow)}
      </tbody>
    </Table>
  )
}

export default StockTable
