
import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Form, Button, Table, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import { listUsers,deleteUser, createUser } from '../actions/userActions';

function UserListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const userList = useSelector(state => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector(state => state.userDelete);
  const { success: successDelete } = userDelete;


  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo, successDelete]);


  const deleteHandler = (id) => {
    if(window.confirm('Are you sure you want to delete user?'))
        {
            dispatch(deleteUser(id))
        }   
      };


  const createUserHandler = () =>{
    navigate('/admin/user/create')
  }



  return (
    <div>
      {/* <h1>Users</h1> */}
      <Row className='aligh-items-center'>
        <Col>
            <Button className='my-3' onClick={createUserHandler}>
                <i className='fas fa-plus' style={{'text-Decoration': 'underline'}}> </i>
                Create User
            </Button>
        </Col>

        <Col className='text-right'>
            <h1> Users</h1>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped border hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>User</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
 
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{
                   
                      <i className='fas fa-check' style={{ color: 'green' }}></i>
                   
                }</td>
                <td>
                  {user.isAdmin ? (
                    <i className='fas fa-check' style={{ color: 'green' }}></i>
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>

                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>

                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default UserListScreen;

