from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser 

from core.models import Category
from core.serializers import CategorySerializer, ProductSerializer


from rest_framework import status


@api_view(['GET'])
def getCategories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getCategory(request, pk):
    product = Category.objects.get(_id=pk)
    serializer = CategorySerializer(product, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createCategory(request):
    category = Category.objects.create(
        name='Sample Name',
    )
    serializer = CategorySerializer(category, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateCategory(request, pk):
    data = request.data
    category = Category.objects.get(_id=pk)

    category.name = data['name']

    category.save()

    serializer = CategorySerializer(category, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getCategoryProducts(request, pk):
    try:
        category = Category.objects.get(_id=pk)
        products = category.product_set.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response({'detail': 'Category does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteCategory(request, pk):
    category = Category.objects.get(_id=pk)
    category.delete()
    return Response('Category Deleted')