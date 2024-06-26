import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate
import { Form, Button, Table, Row, Col, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import Paginate from '../Components/Paginate';
import { listProducts, deleteProduct,createProduct } from '../actions/productActions';
import {PRODUCT_CREATE_RESET} from '../constants/productConstants';

function ProductListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation(); 

  const productList = useSelector(state => state.productList);
  const { loading, error, products, pages, page} = productList;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const productDelete = useSelector(state => state.productDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete  } = productDelete

  const productCreate = useSelector(state => state.productCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct  } = productCreate

  let keyword = location.search
  useEffect(() => {
    dispatch({type:PRODUCT_CREATE_RESET} )

    if (!userInfo.isAdmin) {
     navigate('/login');
    } 

    if (successCreate){
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else{
      dispatch(listProducts(keyword))
    }
   
  }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct, keyword]);

  const deleteHandler = (id) => {
if(window.confirm('Confirm deletion of product?'))
    {
        dispatch(deleteProduct(id))
    }   
  };


  const createProductHandler = (product) =>{
        dispatch(createProduct())
  }

  return (
    <div>
      <Row className='aligh-items-center'>
        <Col>
            <Button className='my-3' onClick={createProductHandler}>
                <i className='fas fa-plus' style={{'text-Decoration': 'underline'}}> </i>
                Create Products
            </Button>
        </Col>

        <Col className='text-right'>
            <h1> Products</h1>
        </Col>
      </Row>

      {loadingDelete && <Loader/>}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

      {loadingCreate && <Loader/>}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}



      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div>
        <Table striped border hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
 
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>GHC{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td><Image className='admin' src={product.image} alt={product.name} fluid /></td>
                
                
           

                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>

                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Paginate page={page} pages={pages} isAdmin={true} />
        </div>
      )}
    </div>
  );
}

export default ProductListScreen;

