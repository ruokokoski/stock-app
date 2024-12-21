import { Form, InputGroup } from 'react-bootstrap'

const AuthInput = ({ controlId, label, type, value, placeholder, onChange, icon: Icon }) => (
  <Form.Group controlId={controlId} style={{ marginBottom: '15px' }}>
    <Form.Label>{label}</Form.Label>
    <InputGroup>
      <InputGroup.Text>{<Icon />}</InputGroup.Text>
      <Form.Control
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        style={{ backgroundColor: '#f0f8ff' }}
      />
    </InputGroup>
  </Form.Group>
)

export default AuthInput
