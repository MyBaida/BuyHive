from django.urls import path
from core.views.order_views import *

urlpatterns = [

    path('', getOrders, name='orders'),
    path('add/', addOrderItems, name='orders-add'),
    path('myorders/', getMyOrders, name='myorders'),

    path('<str:pk>/deliver/', updateOrderToDelivered, name='order-delivered'),

    path('<str:pk>/', getOrderById, name='user-order'),
    path('<str:pk>/pay/', updateOrderToPaid, name='pay'),
]
