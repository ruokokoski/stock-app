import { Form, Button } from 'react-bootstrap'

const SearchForm = ({ searchTerm, setSearchTerm, handleSearch }) => {
  return (
    <Form className="mb-3 d-flex">
      <Form.Control
        type="text"
        placeholder="Search for a stock..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch()
          }
        }}
        style={{ width: '50%', marginRight: '10px' }}
      />
      <Button onClick={handleSearch} className="gradient-button">Search</Button>
    </Form>
  )
}

export default SearchForm
