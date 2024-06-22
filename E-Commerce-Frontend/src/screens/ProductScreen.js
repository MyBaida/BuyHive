import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button , Card, Form} from 'react-bootstrap';
import Rating from '../Components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails, createProductReview } from '../actions/productActions';
import { listMyOrders } from '../actions/orderActions'
import Message from '../Components/Message';
import Loader from '../Components/Loader';
import { addToCart } from '../actions/cartActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import { InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';


const ProductScreen = () => {

  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const orderListMy = useSelector(state => state.orderListMy);
  const { loading: loadingOrders, error:errorOrders, orders} = orderListMy;

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const { id } = useParams();

  const [errorMessage, setErrorMessage] = useState('');
  
  const productReviewCreate = useSelector(state => state.productReviewCreate)
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    success: successProductReview,
} = productReviewCreate


  useEffect(() => {
    if (successProductReview) {
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
      
    }

    // dispatch(listMyOrders())
    dispatch(listProductDetails(id));

    if (errorProductReview) {
      setErrorMessage(errorProductReview);
    }
  }, [dispatch, id, successProductReview, errorProductReview]);

  // console.log(orders)

  // const addToCartHandler = async () => {
  //   await dispatch(addToCart(id, qty));
  //   navigate(`/cart/${id}?qty=${qty}`);
  // };

  const addToCartHandler =  () => {
    // dispatch(addToCart(id, qty));
    navigate(`/cart/${id}?qty=${qty}`);
  };

  

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(
        id, {
        rating,
        comment
    }
    ))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000); // reset error message after 3 seconds
  
    return () => {
      clearTimeout(timer); // clear timeout on component unmount
    };
  }, [errorMessage]);

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>

        {loading ? 
          <Loader>Loading...</Loader>
         : error 
         ? <Message variant='danger'>{error}</Message>
         :(

          <div>
            <Row>
              <Col md={6}>
                <Image src={product.image} alt={product.name} fluid />
              </Col>
              <Col md={3}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>{product.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                  </ListGroup.Item>
                  <ListGroup.Item><strong>Price:</strong> GHS {product.price}</ListGroup.Item>

                  <ListGroup.Item>
                  Description:
                      <p dangerouslySetInnerHTML={{ __html: product.description }}></p>
                    

                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col><strong>GHS {product.price}</strong></Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 &&(

<ListGroup.Item>
<Row>
    {/* <Col>Qty</Col> */}
    <Col xs="auto" className="my-1">
    <InputGroup className="my-1">
    <InputGroup.Text>Qty</InputGroup.Text>
    
        <Form.Control
            as="select"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
        >
            {

                [...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                        {x + 1}
                    </option>
                ))
            }

        </Form.Control>
        <InputGroup.Text style={{ display: 'flex', flexDirection: 'column' }}>
  <FontAwesomeIcon icon={faChevronUp} onClick={() => setQty(qty + 1)} style={{ padding: '0.25rem',}} size='sm' />
  <FontAwesomeIcon icon={faChevronDown} onClick={() => setQty(qty - 1)} style={{ padding: '0.25rem', }} size='sm' />
</InputGroup.Text>
  </InputGroup>
        
    </Col>
</Row>
</ListGroup.Item>
   
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      style={{ width: '100%', padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '0.25rem' }}
                      type="button"
                      disabled={product.countInStock === 0}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
                </Card>
              </Col>
            </Row>

    <Row>
    <Col md={6}>
        <h4 className='my-4' >Reviews</h4>
        {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}

        <ListGroup variant='flush'>
            {product.reviews.map((review) => (
                <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} color='#f8e825' />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>


                </ListGroup.Item>
            ))}

            <ListGroup.Item>
                <h4>Write a review</h4>

                {loadingProductReview && <Loader />}
                {successProductReview && <Message variant='success'>Review Submitted</Message>}
                {/* {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>} */}
                {/* {errorMessage && <Message variant='danger'>{errorMessage}</Message>} */}



{userInfo ? (
  <>
    {orders.some(order => order.orderItems.some(item => item.product === parseInt(id))) ? (
      
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='rating'>
          <Form.Label>Rating</Form.Label>
          <Form.Control
            as='select'
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value=''>Select...</option>
            <option value='1'>1 - Poor</option>
            <option value='2'>2 - Fair</option>
            <option value='3'>3 - Good</option>
            <option value='4'>4 - Very Good</option>
            <option value='5'>5 - Excellent</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='comment'>
          <Form.Label>Review</Form.Label>
          <Form.Control
            as='textarea'
            row='5'
            placeholder='Comment here'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button
          disabled={loadingProductReview}
          type='submit'
          variant='primary'
        >
          Submit
        </Button>
      </Form>
    ) : (
      <Message variant='info'>
        Review product after purchase
      </Message>
    )}
  </>
) : (
  <Message variant='info'>
    Please <Link to='/login'>login</Link> to write a review
  </Message>
)}
            </ListGroup.Item>
        </ListGroup>
    </Col>
  </Row>
</div>
         )
     }

     
    </div>
  );
};

export default ProductScreen;