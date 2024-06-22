from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser 
from django.contrib.auth.models import User

from core.serializers import UserSerializer, UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password

from rest_framework import status



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if user.password != '':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)



# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def updateUserProfile(request):
#     user = request.user
#     serializer = UserSerializerWithToken(user, many=False)

#     data = request.data

#     user.first_name = data.get('name', user.first_name)
#     user.username = data.get('email', user.username)
#     user.email = data.get('email', user.email)

   
#     password = data.get('password')
#     if password:
#         user.password = make_password(password)

#     user.save()

#     return Response(serializer.data)


# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def updateUserPassword(request):
#     user = request.user
    
#     data = request.data
#     current_password = data.get('current_password')
#     new_password = data.get('new_password')
#     confirm_new_password = data.get('confirm_new_password')

#     if not current_password or not new_password or not confirm_new_password:
#         return Response({'error': 'Please provide current password, new password, and confirm new password'}, status=400)

#     if not user.check_password(current_password):
#         return Response({'error': 'Current password is incorrect'}, status=400)

#     if new_password != confirm_new_password:
#         return Response({'error': 'New password and confirm new password do not match'}, status=400)

#     user.set_password(new_password)
#     user.save()

#     return Response({'message': 'Password changed successfully'}, status=200)




@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)




@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response('User was deleted')