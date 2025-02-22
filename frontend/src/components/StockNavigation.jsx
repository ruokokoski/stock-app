import { Nav } from 'react-bootstrap'

const StockNavigation = ({ activeTab, setActiveTab }) => (
    <Nav variant="tabs" defaultActiveKey="overview" onSelect={(selectedKey) => setActiveTab(selectedKey)}>
      <Nav.Item>
        <Nav.Link eventKey="overview" active={activeTab === 'overview'}>
          Overview
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="news" active={activeTab === 'news'}>
          News
        </Nav.Link>
      </Nav.Item>
    </Nav>
)

export default StockNavigation