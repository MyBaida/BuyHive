import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer} from 'react-router-bootstrap';
import { logout } from '../actions/userActions'
import { removeFromCart, saveShippingAddress } from '../actions/cartActions'
import SearchBox from './SearchBox'


const Header = () => {

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const dispatch = useDispatch()

    const cart = useSelector((state) => state.cart)
    const { cartItems } = cart

    const logoutHandler = () => {
        dispatch(logout())
        cart.cartItems.forEach(item => {
          dispatch(removeFromCart(item.product));
        });
        dispatch(saveShippingAddress({}))
    }

    return (
      <header>
      <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
              <Navbar.Brand>DevShop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

          <SearchBox />
            
            <Nav className="ml-auto">
              <LinkContainer to='/cart'>
                    <Nav.Link ><i className='fas fa-shopping-cart'></i>Cart</Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'> 
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                      <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>

                </NavDropdown>
              ): (
                      <LinkContainer to='/login'>
                          <Nav.Link ><i className='fas fa-user'></i>Login</Nav.Link>
                      </LinkContainer>
                  )}


                  {userInfo && userInfo.isAdmin && (
                      <NavDropdown title="Admin" id='adminmenu'>

                      <LinkContainer to='/admin/userlist'> 
                          <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to='/admin/productlist'> 
                          <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to='/admin/orderlist'> 
                          <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to='/admin/categorylist'> 
                          <NavDropdown.Item>Categories</NavDropdown.Item>
                      </LinkContainer>
                          
      
                    </NavDropdown>
                  )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      </header>
    )
}

export default Header