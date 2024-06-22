
import React, { useEffect} from 'react'
import { useDispatch, useSelector,  } from 'react-redux'
import { Link, useParams, useNavigate} from 'react-router-dom'
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap'

import Message from '../Components/Message'
import Loader from '../Components/Loader'

import { createOrder } from '../actions/orderActions'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'


const OrderScreen = () => {
    
    // const orderCreate = useSelector(state => state.orderCreate)
    // const {order, error, success} = orderCreate 

    const { id: orderId } = useParams();

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch  ()  

    const ship = useSelector(state => state.ship)
    const cart = useSelector(state => state.cart)
    const navigate = useNavigate()


    useEffect(() => {
        
        if (!userInfo) {
            navigate('/login');
        } else {
            dispatch(getOrderDetails(orderId));
            
        }
        if (!order || successPay || order._id !== Number(orderId) || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })

            dispatch(getOrderDetails(orderId))
        }

    }, [dispatch, navigate, orderId, userInfo, successPay, successDeliver]);





    const deliverHandler = () => {
            dispatch(deliverOrder(order))
    }

    const paymentHandler = () => {
        dispatch(payOrder(order._id))
    }

    
    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (


        <div>
            <h1>Order: DS-{order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            {order.user && (
                                <>
                                    <p><strong>Name: </strong>{order.user.name}</p>
                                    <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                                    
                                </>
                            )}
                            <p>
                                <strong>Shipping: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}
                                {'  '}
                                {order.shippingAddress.postalCode}
                                {'  '}
                                {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                                    <Message variant='success'> Delivered on {order.deliveredAt}</Message>
                                                ) : (
                                                    <Message variant='warning'> Not Delivered </Message>
                                                )
                                                
                            }

                        </ListGroup.Item>


                        <ListGroup.Item>
                            <h2>Payment Method</h2>

                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                                
                            </p>

                            {order.isPaid ? (
                                <Message variant='success'> Paid on {order.paidAt}</Message>
                            ) : (
                                <Message variant='warning'> Not Paid </Message>
                            )
                            
                            }
                    
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>

                            {order.orderItems.length === 0 ? 
                            <h3>Order is empty</h3>
                            :(
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded/>
                                                    </Col>

                                                    <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </Col>

                                                    <Col md={6}>
                                                    {item.qty} X GHS {item.price} = GHS {(item.qty*item.price).toFixed(2)}
                                                    </Col>
                                                </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                            

                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary </h2>                        
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>GHS {(order.totalPrice - order.shippingPrice).toFixed(2)}</Col>
                                </Row>    
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>GHS {order.shippingPrice}</Col>
                                </Row>    
                            </ListGroup.Item>


                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>GHS {(order.totalPrice)}</Col>
                                </Row>    
                            </ListGroup.Item>

                            <ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>}
                            </ListGroup.Item>

                        </ListGroup>
                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && !order.isDelivered && order.isPaid &&(
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn btn-block'
                                    onClick={deliverHandler}
                                >
                                    Mark As Delivered
                                </Button>
                            </ListGroup.Item>
                        )}

                    </Card>
                    {loadingPay && <Loader />}
                    {userInfo  && !order.isPaid && (
                        <div>
                            <Button
                                type='button'
                                className='btn btn-block my-5'
                                onClick={paymentHandler}
                            >
                                Make Payment
                            </Button>
                        </div>
                    )}          
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen