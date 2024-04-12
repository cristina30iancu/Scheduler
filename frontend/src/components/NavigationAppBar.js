
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from './AuthProvider';
import logo from './img/logo.png';

function NavigationAppBar() {
    const { isLoggedIn, logout } = useAuth();

    return (
        <Navbar className='my-nav' collapseOnSelect expand="lg" variant='dark' bg='dark' >
            <Navbar.Brand href="/">
                <img
                    alt=""
                    src={logo}
                    width="50"
                    height="50"
                    className="d-inline-block align-middle mx-3"
                />{' '}
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>SCHEDULER</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className='justify-content-center'>
                <Nav className="mr-auto" style={{ margin: 'auto' }}>
                    {isLoggedIn && <Nav.Link style={{ fontSize: '16px', color: 'white', margin: '8px' }} href="/activitati">Activități</Nav.Link>}
                    {isLoggedIn && <NavDropdown title="Cheltuieli" style={{ fontSize: '16px', color: 'white', margin: '8px' }}>
                        <NavDropdown.Item href="/adaugaCheltuiala/">Adaugă</NavDropdown.Item>
                        <NavDropdown.Item href="/cheltuieli">Vizualizează</NavDropdown.Item>
                    </NavDropdown>}
                    {isLoggedIn && <Nav.Link style={{ fontSize: '16px', color: 'white', margin: '8px' }} href="/calendar">Calendar</Nav.Link>}
                </Nav>
                <Nav className="ml-auto mr-3">
                    {!isLoggedIn && <Nav.Link href='/login' >
                        <button className='btn gradient-custom' style={{
                            fontSize: '14px', color: 'black', marginLeft: '8px',
                            backgroundColor: '#c2dbd8', borderRadius: '10%'
                        }}>CONT</button>
                    </Nav.Link>}
                    {isLoggedIn && <Nav.Link onClick={logout}>
                        <button className='btn gradient-custom' style={{ fontSize: '14px', color: 'white', marginRight: '8px' }}>Ieși din cont</button>
                    </Nav.Link>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavigationAppBar;