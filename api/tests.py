import json

from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User


# Create your tests here.

class AccountTests(APITestCase):
    def test_create_account_success(self):
        """
        If the payload is correct, it should able to create new account
        """
        url = '/api/user/create'
        data = {
            'username': 'wangwang',
            'password': '12345',
            "email": '123@outlook.com',
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_create_account_fail(self):
        """
        If the payload is invalid, it should not create the user
        """
        url = '/api/user/create'
        data_invalid_email = {
            'username': 'wang',
            'password': '12345',
            'email': "123",
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data_invalid_email, format='json')
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

        data_invalid_payload = {
            'username': 'wang',
            'password': '12345',
            'email': "321@gmail.com",
        }
        response = self.client.post(url, data_invalid_payload, format='json')
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_account_not_duplicate_user(self):
        """
        If the username is already exist, it should not create again
        """
        self.test_create_account_success()
        url = '/api/user/create'
        data = {
            'username': 'wangwang',
            'password': '12345',
            "email": '123@outlook.com',
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_account_fail(self):
        """
        If username and password are not match,
        ensure we cannot login in an existing account
        """

        url = "/api/login"
        data = {
            'username': 'wangzainiunai',
            'password': 'test'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_login_account_success(self):
        """
        If username and password are match,
        ensure we can login in an existing account
        """
        self.test_create_account_success()

        url = '/api/login'
        data = {
            'username': 'wangwang',
            'password': '12345'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)


class UserProfileTest(APITestCase):

    def test_get_user_profile(self):
        """
        Ensure get all the details of existing user
        """
        url = '/api/user/create'
        data = {
            'username': 'wangwang',
            'password': '12345',
            "email": '123@outlook.com',
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        user_id = json.loads(response.content).get('id')

        url = '/api/user/get/?id=' + str(user_id)
        response = self.client.get(url)
        self.assertTrue('wangwang' in str(json.loads(response.content)))
        self.assertTrue('123@outlook.com' in str(json.loads(response.content)))
        self.assertTrue('' in str(json.loads(response.content)))

    def test_update_user_profile(self):
        """
        Ensure update profile information works
        """
        url = '/api/user/create'
        data = {
            'username': 'wangwang',
            'password': '12345',
            "email": '123@outlook.com',
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        user_id = json.loads(response.content).get('id')

        url = '/api/login'
        data = {
            'username': 'wangwang',
            'password': '12345'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        url = '/api/user/update'
        data_update = {
            'id': user_id,
            'first_name': 'firstname',
            'last_name': 'lastname',
            'email': 'test@outlook.com',
            'password': '',
            'avatar': '123.png',
            'description': 'test'
        }

        response = self.client.post(url, data_update, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        url = '/api/user/get/?id=' + str(user_id)
        response = self.client.get(url)
        json_result = json.loads(response.content)

        self.assertEquals('test@outlook.com', json_result.get('email'))
        self.assertEquals('test', json_result.get('description'))
        self.assertEquals('123.png', json_result.get('avatar'))

    def test_update_user_password(self):
        """
        Ensure existing user can login with new password
        """
        url = '/api/user/create'
        data = {
            'username': 'wangwang',
            'password': '12345',
            "email": '123@outlook.com',
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        user_id = json.loads(response.content).get('id')

        url = '/api/login'
        data = {
            'username': 'wangwang',
            'password': '12345'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        url = '/api/user/update'
        data_update = {
            'id': user_id,
            'first_name': 'firstname',
            'last_name': 'lastname',
            'email': 'test@outlook.com',
            'password': '54321',
            'avatar': '123.png',
            'description': 'test'
        }

        response = self.client.post(url, data_update, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        url = '/api/login'
        data = {
            'username': 'wangwang',
            'password': '12345'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_404_NOT_FOUND)

        url = '/api/login'
        data = {
            'username': 'wangwang',
            'password': '54321'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_update_user_invalid_payload(self):
        """
        Ensure the payload is not valid, then it will not update user profile
        """
        url = '/api/user/create'
        data = {
            'username': 'wangwang',
            'password': '12345',
            "email": '123@outlook.com',
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        user_id = json.loads(response.content).get('id')

        url = '/api/user/update'
        data_update = {
            'id': user_id,
            'first_name': 'firstname',
            'last_name': 'lastname',
            'email': 'outlook.com',
            'password': '54321',
            'avatar': '123.png',
            'description': 'test'
        }

        response = self.client.post(url, data_update, format='json')
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_not_found(self):
        """
        Ensure if the request user not exist, it will not update profile information
        """

        url = '/api/user/get/?id=1'
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

        url = '/api/user/update'
        data = {
            'id': 1,
            'first_name': 'firstname',
            'last_name': 'lastname',
            'email': 'test@outlook.com',
            'password': '54321',
            'avatar': '123.png',
            'description': 'test'
        }

        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)


class RecipeTest(APITestCase):

    def test_create_recipe(self):
        """
        Ensure User can be successful create Recipe
        """
        url = '/api/user/create'
        data = {
            'username': 'wangwang',
            'password': '12345',
            "email": '123@outlook.com',
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        user_id = json.loads(response.content).get('id')

        url = '/api/login'
        data = {
            'username': 'wangwang',
            'password': '12345'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        url = '/api/recipe/create/oneStep'
        data = {
            'recipe': {
                'name': 'blood mary',
                'author': user_id,
                'description': 'hhh',
                'cooking_time': '4',
                'difficulty': 'IN',
                'img_url': 'none',
                'video_link': 'none'
            },
            'steps': [
                {
                    'name': 'prepare',
                    'order': '1',
                    'desc': 'hh',
                    'img_url': 'none'
                }
            ],
            'ingredients': [
                {
                    'name': 'milk',
                    'amount': '10',
                    'unit': 'g'
                }
            ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)


class GetRecipeMomentTest(APITestCase):

    def test_get_recipe_byid(self):
        """
        Ensure User can getRecipe successful after creating Recipe
        """
        url = '/api/user/create'
        data = {
            'username': 'wangwang',
            'password': '12345',
            "email": '123@outlook.com',
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        user_id = json.loads(response.content).get('id')

        url = '/api/login'
        data = {
            'username': 'wangwang',
            'password': '12345'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        url = '/api/recipe/create/oneStep'
        data = {
            'recipe': {
                'name': 'blood mary',
                'author': user_id,
                'description': 'hhh',
                'cooking_time': '4',
                'difficulty': 'IN',
                'img_url': 'none',
                'video_link': 'none'
            },
            'steps': [
                {
                    'name': 'prepare',
                    'order': '1',
                    'desc': 'hh',
                    'img_url': 'none'
                }
            ],
            'ingredients': [
                {
                    'name': 'milk',
                    'amount': '10',
                    'unit': 'g'
                }
            ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        recipe_id = json.loads(response.content).get('id')

        url = '/api/recipe/getByUser/?id=' + str(user_id)
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        test_data = {'id': recipe_id, 'name': 'blood mary', 'description': 'hhh', 'author_id': user_id, 'ingredients': '', 'cooking_time': 4, 'difficulty': 'IN', 'likes': 0, 'reports': 0, 'saves': 0, 'status': 'A', 'video_link': 'none', 'img_url': 'none'}
        self.assertEquals(json.loads(response.content).get('recipes')[0], test_data)


    def test_get_all_recipe(self):

        """
        Ensure User can getRecipe successful after creating Recipe
        """
        url = '/api/user/create'
        data = {
            'username': 'wangwang',
            'password': '12345',
            "email": '123@outlook.com',
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        user_id = json.loads(response.content).get('id')

        url = '/api/login'
        data = {
            'username': 'wangwang',
            'password': '12345'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        url = '/api/recipe/create/oneStep'
        data = {
            'recipe': {
                'name': 'blood mary',
                'author': user_id,
                'description': 'hhh',
                'cooking_time': '4',
                'difficulty': 'IN',
                'img_url': 'none',
                'video_link': 'none'
            },
            'steps': [
                {
                    'name': 'prepare',
                    'order': '1',
                    'desc': 'hh',
                    'img_url': 'none'
                }
            ],
            'ingredients': [
                {
                    'name': 'milk',
                    'amount': '10',
                    'unit': 'g'
                }
            ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        url = '/api/recipe/getAll'
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(json.loads(response.content).get('recipes')), 1)

        url = '/api/recipe/create/oneStep'
        response = self.client.post(url, data, format='json')

        url = '/api/recipe/getAll'
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(json.loads(response.content).get('recipes')), 2)


    def test_triple_recipe(self):

        """
        Ensure User can getRecipe successful after creating Recipe
        """
        url = '/api/user/create'
        data = {
            'username': 'wangwang',
            'password': '12345',
            "email": '123@outlook.com',
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        user_id = json.loads(response.content).get('id')

        url = '/api/login'
        data = {
            'username': 'wangwang',
            'password': '12345'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        url = '/api/recipe/create/oneStep'
        data = {
            'recipe': {
                'name': 'blood mary',
                'author': user_id,
                'description': 'hhh',
                'cooking_time': '4',
                'difficulty': 'IN',
                'img_url': 'none',
                'video_link': 'none'
            },
            'steps': [
                {
                    'name': 'prepare',
                    'order': '1',
                    'desc': 'hh',
                    'img_url': 'none'
                }
            ],
            'ingredients': [
                {
                    'name': 'milk',
                    'amount': '10',
                    'unit': 'g'
                }
            ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        recipe_id = json.loads(response.content).get('id')

        url = '/api/recipe/getAll'
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(json.loads(response.content).get('recipes')), 1)

        url = '/api/recipe/create/oneStep'
        response = self.client.post(url, data, format='json')

        url = '/api/recipe/getAll'
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(json.loads(response.content).get('recipes')), 2)

        url = '/api/recipe/create/oneStep'
        response = self.client.post(url, data, format='json')

        url = '/api/recipe/getAll'
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(len(json.loads(response.content).get('recipes')), 3)


class MomentTest(APITestCase):
    def add_moment_with_no_user(self):
        url = '/api/moment/create'
        data= {
            "text": "this is a test",
            "user" : 1,
            "img_url" : "img url"
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_add_moment(self):
        url = '/api/user/create'
        data = {
            'username': 'wangwang',
            'password': '12345',
            "email": '123@outlook.com',
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        user_id = json.loads(response.content).get('id')

        url = '/api/login'
        data = {
            'username': 'wangwang',
            'password': '12345'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        url = '/api/moment/getAll'
        response = self.client.get(url)
        moments = json.loads(response.content).get("moments")
        self.assertEquals(len(moments), 0)

        url = '/api/moment/create'
        data= {
            "text": "this is a test",
            "user" : user_id,
            "img_url" : "img url"
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        url = '/api/moment/getAll'
        response = self.client.get(url)
        moments = json.loads(response.content).get("moments")
        self.assertEquals(len(moments), 1)

        # self.assertTrue('wangwang' in str(json.loads(response.content)))
        # self.assertTrue('123@outlook.com' in str(json.loads(response.content)))
        # self.assertTrue('' in str(json.loads(response.content)))
    def test_like_and_dislike_moment(self):
        url = '/api/user/create'
        data = {
            'username': 'wangwang',
            'password': '12345',
            "email": '123@outlook.com',
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        user_id = json.loads(response.content).get('id')
        url = '/api/login'
        data = {
            'username': 'wangwang',
            'password': '12345'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        url = '/api/moment/create'
        data= {
            "text": "this is a test",
            "user" : user_id,
            "img_url" : "img url"
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        moment_id = json.loads(response.content).get('moment_id')

        url = "/api/moment/ifLiked/?user_id="+str(user_id)+"&moment_id="+str(moment_id)
        response = self.client.get(url)
        statu = json.loads(response.content).get('Status')
        self.assertEquals(statu, "no")


        url = '/api/moment/like'
        data = {
            "moment_id" : moment_id,
            "user_id" : user_id
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)


        url = "/api/moment/ifLiked/?user_id="+str(user_id)+"&moment_id="+str(moment_id)
        response = self.client.get(url)
        statu = json.loads(response.content).get('Status')
        self.assertEquals(statu, "yes")


        url = '/api/moment/dislike'
        data = {
            "moment_id" : moment_id,
            "user_id" : user_id
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

        url = "/api/moment/ifLiked/?user_id="+str(user_id)+"&moment_id="+str(moment_id)
        response = self.client.get(url)
        statu = json.loads(response.content).get('Status')
        self.assertEquals(statu, "no")
        
    def test_get_moment(self):
        url = '/api/user/create'
        data = {
            'username': 'wangwang',
            'password': '12345',
            "email": '123@outlook.com',
            'first_name': 'firstname',
            'last_name': 'lastname'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        user_id = json.loads(response.content).get('id')

        url = '/api/login'
        data = {
            'username': 'wangwang',
            'password': '12345'
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        url = '/api/moment/create'
        data= {
            "text": "this is a test",
            "user" : user_id,
            "img_url" : "img url"
        }
        response = self.client.post(url, data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        moment_id = json.loads(response.content).get('moment_id')

        url = '/api/moment/get?user_id='+str(user_id)
        response = self.client.get(url)
        if response.status_code == 301:
            response = self.client.get(response.url)
        moments = json.loads(response.content).get('moments')
        self.assertEquals(len(moments), 1)
        self.assertEquals(moments[0].get("id"),moment_id)