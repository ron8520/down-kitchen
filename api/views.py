from django.shortcuts import render
from rest_framework import generics
from rest_framework.fields import JSONField
from rest_framework.serializers import Serializer
from .models import Recipe, Tip, UserFollow, Comment, Reply, UserProfile, Step, Moment,\
    MomentLike, RecipeLike, RecipeIngredient, Collection
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from django.core import serializers
import json
from django.db.models import F
import time

from .serializers import RecipeSerializer, CreateRecipeSerializer, RecipeGetAllCommentsSerializer, UserProfileSerializer
from .serializers import GetSubscriptionsSerializer, SubscriptionsSerializer
from .serializers import CommentSerializer, ReplySerializer
from .serializers import CreateCommentSerializer, CreateReplySerializer
from .serializers import ModifyCommentSerializer, ModifyReplySerializer
from .serializers import CreateMomentSerializer
from .serializers import IngrendientSerializer
from .serializers import UserSerializer, CollectionSerializer
from .serializers import CreateStepSerializer, UpdateUserSerializer, CreateStepNoId, IngrendientNoIDSerializer

import base64
import requests
import json
import smtplib, ssl
import random


class RecipeView(generics.CreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer


class CreateRecipeView(APIView):
    serializer_class = CreateRecipeSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data.get('recipe'))
        if serializer.is_valid():
            name = serializer.data.get('name')
            description = serializer.data.get('description')
            cooking_time = serializer.data.get('cooking_time')
            difficulty = serializer.data.get('difficulty')
            author_id = serializer.data.get('author')
            user = request.data.get("user")
            video_link = serializer.data.get('video_link')
            img_url = serializer.data.get('img_url')
            recipe = Recipe(
                name=name,
                description=description,
                cooking_time=cooking_time,
                difficulty=difficulty,
                likes=0,
                status="A",
                video_link =video_link,
                author_id = author_id,
                img_url = img_url
            )
            recipe.save()
            return Response({'id':recipe.id}, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

class CreateRecipeOneStepView(APIView):
    def post(self, request, format=None): 
        recipe = None
        try:
            serializer = CreateRecipeSerializer(data=request.data.get('recipe'))
            if serializer.is_valid():
                if request.session['id'] is None:
                    return Response({'Failed': "Login first"}, status=status.HTTP_401_UNAUTHORIZED)
                name = serializer.data.get('name')
                description = serializer.data.get('description')
                cooking_time = serializer.data.get('cooking_time')
                difficulty = serializer.data.get('difficulty')
                author_id = serializer.data.get('author')
                video_link = serializer.data.get('video_link')
                img_url = serializer.data.get('img_url')
                recipe = Recipe(
                    name=name,
                    description=description,
                    cooking_time=cooking_time,
                    difficulty=difficulty,
                    author_id = author_id,
                    likes=0,
                    status="A",
                    video_link =video_link,
                    img_url = img_url
                )
                recipe.save()
            else:
                cleaseRecipeData(recipe.id)
                return Response({'Bad Request': 'Error Occurred when creating the recipe'}, status=status.HTTP_400_BAD_REQUEST)
            steps = request.data.get('steps')
            for step in steps:
                serializer = CreateStepNoId(data=step)
                if serializer.is_valid():
                    img_url = serializer.data.get('img_url')
                    order = serializer.data.get('order')
                    name = serializer.data.get('name')
                    desc = serializer.data.get('desc')
                    recipe_id = recipe.id
                    step = Step(
                        img_url=img_url,
                        order=order,
                        name=name,
                        desc=desc,
                        recipe_id_id=recipe.id
                    )
                    step.save()
                else:
                    cleaseRecipeData(recipe.id)
                    return Response({'Bad Request': 'Error Occurred when adding steps'}, status=status.HTTP_400_BAD_REQUEST)
            
                    serializer = self.serializer_class(data=request.data)
            ings = request.data.get('ingredients')
            for ing in ings:
                serializer = IngrendientNoIDSerializer(data=ing)
                if serializer.is_valid():
                    name = serializer.data.get('name')
                    amount = serializer.data.get('amount')
                    unit = serializer.data.get('unit')
                    ing_obj = RecipeIngredient(
                        name = name,
                        amount = amount,
                        unit = unit,
                        recipe_id = recipe.id,
                    )
                    ing_obj.save()
                else:
                    cleaseRecipeData(recipe.id)
                    return Response({'Bad Request': 'Error Occurred when adding ingredients'}, status=status.HTTP_400_BAD_REQUEST)      
            return Response({'Success': 'Recipe created', 'id': recipe.id}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            if recipe:
                cleaseRecipeData(recipe.id)
            return Response({'Bad request':'Error occurred'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

def cleaseRecipeData(id):
    try:
        steps = Recipe.objects.filter(recipe_id = id)
        steps.delete()

        ingredients = Recipe.objects.filter(recipe_id=id)
        ingredients.delete()

        recipe = Recipe.objects.filter(id=id)
        recipe.delte()
    except Exception as e:
        print(e)

class SearchRecipes(APIView):
    def get(self, request, format=None):
        q = request.GET.get('q')
        try:
            recipes = Recipe.objects.filter(name__icontains=q)
            response = {}
            response['recipes'] = []
            index = 0
            for recipe in recipes.values():
                response['recipes'].append({})
                response['recipes'][index] = recipe
                index += 1

            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'Bad Request':'Error Occurred'}, status=status.HTTP_400_BAD_REQUEST)

class GetAllRecipes(APIView):
    def get(self, request, format=None):
        try:
            recipes = Recipe.objects.filter()
            response = {}
            response['recipes'] = []
            index = 0
            for recipe in recipes.values():
                response['recipes'].append({})
                response['recipes'][index] = recipe
                index += 1

            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'Bad Request':'Error Occurred'}, status=status.HTTP_400_BAD_REQUEST)

class DeleteRecipeView(APIView):
    def delete(self, request, format=None):
        try:
            if request.session['id'] != None:
                id = request.data.get('recipe_id')
                recipe = Recipe.objects.get(id=id)
                # if not auth(request, recipe.id):
                #     return Response({'Bad Request': 'auth failed'}, status=status.HTTP_400_BAD_REQUEST)
                recipe.delete()
                return Response({'Success': 'Recipe deleted'}, status=status.HTTP_200_OK)
            else:
                return Response({'Failed': 'Login first'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(e)
            return Response({'Bad request': 'Error occurred'}, status=status.HTTP_400_BAD_REQUEST)



# find recipe by id
class RecipeGetDetails(APIView):
    loopup_url = 'recipe_id'
    def get(self, request, format=None):
        id = request.GET.get(self.loopup_url)

        if id != None:
            response = {}
            rp = Recipe.objects.get(id=id)

            if not rp:
                return HttpResponse({'Bad Request':'Recipe not found'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                index = 0
                response['id'] = rp.id
                response['name'] = rp.name

                id = rp.author_id
                author = User.objects.get(id=id)
                prof = UserProfile.objects.get(user_id=author.id)
                if(author):
                    response['avatar'] = prof.avatar_url
                    response['author_id'] = author.id
                    response['author'] = author.username
                    response['description'] = rp.description
                    response['cooking_time'] = rp.cooking_time
                    response['difficulty'] = rp.difficulty
                    response['likes'] = rp.likes
                    response['saves'] = rp.saves
                    response['reports'] = rp.reports
                    response['status'] = rp.status
                    response['video'] = rp.video_link
                    response['ingredients'] = []
                    ingredients = RecipeIngredient.objects.filter(recipe_id=rp.id)
                for ing in ingredients.values():
                    response['ingredients'].append({})
                    ing_obj = response['ingredients'][index]
                    ing_obj['name'] = ing.get('name')
                    ing_obj['amount'] = ing.get('amount')
                    ing_obj['unit'] = ing.get('unit')
                    index += 1

                response['steps'] = []
                index = 0
                steps = Step.objects.filter(recipe_id=rp.id)
                for step in steps.values():
                    response['steps'].append({})
                    step_obj = response['steps'][index]
                    step_obj['name'] = step.get('name')
                    step_obj['order'] = step.get('order')
                    step_obj['description'] = step.get('desc')
                    step_obj['img_url'] = step.get('img_url')
                    index += 1
            return JsonResponse(response, status=status.HTTP_200_OK)
        return Response()

class GetRecipeByUserId(APIView):
    lookup_url = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url)

        if id != None:
            try:
                recipes = Recipe.objects.filter(author_id=id)
                response = {}
                response['recipes'] = []
                index = 0

                for recipe in recipes.values():
                    response['recipes'].append({})
                    response['recipes'][index] = recipe
                    index = index+1
                return Response(response, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({'Failed': 'Error Occurred'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'No id passed in url'}, status=status.HTTP_400_BAD_REQUEST)

class RecipeGetAllCommentsView(APIView):
    lookup_url = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url)
        try:
            if id != None:
                response = {}
                response['comments'] = []
                index = 0
                comments = Comment.objects.filter(recipe_id = id)

                ### fields
                for comment in comments.values():
                    rep_index = 0
                    response['comments'].append({})
                    com_obj = response['comments'][index]
                    com_obj['userId'] = comment.get('user_id')
                    com_obj['comId'] = comment.get('id')
                    com_obj['text'] = comment.get('text')
                    user_id = comment.get('user_id')
                    user = User.objects.get(id=comment.get('user_id'))
                    
                    if user:
                        com_obj['fullName'] = user.username
                        prof = UserProfile.objects.get(user=user.id)
                        if prof:
                            com_obj['avatarUrl'] = prof.avatar_url
                    com_obj['replies'] = []
                    replies = Reply.objects.filter(comment = comment.get('id'))

                    for reply in replies.values():
                        com_obj['replies'].append({})
                        rep_obj = com_obj['replies'][rep_index]
                        rep_obj['userId'] = reply.get('user_id')
                        rep_obj['comId'] = reply.get('id')
                        rep_obj['text'] = reply.get('text')

                        r_user = User.objects.get(id=reply.get('user_id'))

                        if r_user:
                            r_prof = UserProfile.objects.get(user=r_user.id)
                            rep_obj['fullName'] = r_user.username
                            if r_prof:
                                rep_obj['avatarUrl'] = r_prof.avatar_url
                        rep_index += 1
                    index += 1
                return JsonResponse(response, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            print(e)
            return Response({'Bad Request': 'Error occurred'})
        return Response({'Bad Request': 'Id is not found in request'})

class CreateRecipeCommentView(APIView) :
    serializer_class = CreateCommentSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if request.session['id'] != None:
                user = serializer.data.get('user')
                recipe = serializer.data.get('recipe')
                text = serializer.data.get('text')
                comment = Comment(
                    user_id = user,
                    recipe_id = recipe,
                    text = text
                )
                comment.save()
                return Response({"id": comment.id}, status=status.HTTP_200_OK)

            else:
                return Response({"Failed": 'Login first'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

class CreateReplyView(APIView) :
    serializer_class = CreateReplySerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            text = serializer.data.get('text')
            user = serializer.data.get('user')
            comment = serializer.data.get('comment') 

            reply = Reply(
                text = text,
                user_id = user,
                comment_id = comment
            )
            reply.save()

            return Response({"id": reply.id}, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

class UpdateReplyView(APIView):
    serializer_class = ModifyReplySerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            id = serializer.data.get('id')
            text = serializer.data.get('text')
            
            reply = Reply.objects.get(id=id)
            if not reply:
                return Response({'Bad Request': 'Reply object not found'}, status=status.HTTP_400_BAD_REQUEST)
            reply.update(text=text)
            return Response({'Success': 'Object updated '}, status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

class DeleteReplyView(APIView):
    
    def post(self, request, format=None):
        id = request.data.get('id')
        if id:
            try:
                rep = Reply.objects.get(id=id)
                rep.delete()
                return Response({'Success': 'Deleted'}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({'Bad Request': 'Not found'}, status=status.HTTP_200_OK)

        return Response({'Bad Request': 'No id specified'}, status=status.HTTP_400_BAD_REQUEST)

class CheckMomentIfLikedView(APIView):

    def get(self, request, format=None):
        try:
            user_id = request.GET.get('user_id')
            moment_id = request.GET.get('moment_id')
            
            result = MomentLike.objects.filter(user_id=user_id, moment_id=moment_id)
            if result:
                return Response({'Status':'yes'}, status=status.HTTP_200_OK)
            else:
                return Response({'Status':'no'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'Bad Request': 'Error occurred'}, status=status.HTTP_400_BAD_REQUEST)    

class GetFeatureMomentView(APIView):

    def get(self, request, format=None):
        try:
            moments = Moment.objects.filter()
            response = {}
            response['moments'] = []
            index = 0

            temp = []

            for moment in moments.values():
                if 'mp4' not in moment.get('img_url') and moment.get('img_url') != "":
                    temp.append(moment)

            random_moments = random.sample(temp, 8)

            for _ in random_moments:
                response['moments'].append({})
                mom_obj = response['moments'][index]
                mom_obj['img_url'] = random_moments[index].get('img_url')
                mom_obj['user'] = random_moments[index].get('user_id')

                user = UserProfile.objects.get(user_id=mom_obj['user'])
                mom_obj['avatar_url'] = user.avatar_url
                mom_obj['likes'] = random_moments[index].get('likes')
                mom_obj['moment_id'] = random_moments[index].get('id')
                mom_obj['text'] = random_moments[index].get('text')
                index += 1

            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'Internal Server Error': 'Error Occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeleteCommentView(APIView):
    
    def post(self, request, format=None):
        id = request.data.get('id')
        if id:
            try:
                rep = Comment.objects.get(id=id)
                rep.delete()
                return Response({'Success': 'Deleted'}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({'Bad Request': 'Not found'}, status=status.HTTP_200_OK)

        return Response({'Bad Request': 'No id specified'}, status=status.HTTP_400_BAD_REQUEST)

class LikeRecipeView(APIView):
    def post(self, request, format=None):
        recipe_id = request.data.get('recipe_id')
        user_id = request.data.get('user_id')
        if recipe_id and user_id:
            try:
                like_obj = RecipeLike.objects.filter(recipe_id=recipe_id, user_id=user_id)
                if not like_obj:
                    rep = Recipe.objects.filter(id=recipe_id).update(likes = F('likes') + 1)
                    like_obj = RecipeLike(
                        recipe_id = recipe_id,
                        user_id = user_id
                    )
                    like_obj.save()
                    return Response({'Success': 'Action completed'}, status=status.HTTP_200_OK)
                else:
                    return Response({'Bad Request': 'User has liked the recipe before'})
            except Exception as e:
                print(e)
                return Response({'Bad Request': 'Not found'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'No id specified'}, status=status.HTTP_400_BAD_REQUEST)

class CheckLikeRecipe(APIView):
    def post(self, request, format=None):
        try:
            user_id = request.data.get('user_id')
            recipe_id = request.data.get('recipe_id')
            result = RecipeLike.objects.filter(user_id=user_id, recipe_id=recipe_id)
            if not result:
                return Response({'status':'no'}, status=status.HTTP_200_OK)
            else:
                return Response({'status':'yes'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'Bad Request': 'Error occurred'}, status=status.HTTP_400_BAD_REQUEST)


class DislikeRecipeView(APIView):

    def post(self, request, format=None):
        recipe_id = request.data.get('recipe_id')
        user_id = request.data.get('user_id')
        if recipe_id and user_id:
            try:
                rep = Recipe.objects.filter(id=recipe_id).update(likes = F('likes') - 1)
                like_obj = RecipeLike.objects.filter(user=user_id).filter(recipe=recipe_id)
                if not like_obj:
                    return Response({'Bad Request': 'User has not liked the recipe before'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    like_obj.delete()
                    return Response({'Success': 'Action completed'}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({'Bad Request': 'Not found'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'No id specified'}, status=status.HTTP_400_BAD_REQUEST)


'''
Subscription-related views
'''
class GetSubscriptionsView(APIView):
    serializer_class = GetSubscriptionsSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        try:
            if serializer.is_valid():
                user_id = serializer.data.get('user')
                qs = UserFollow.objects.filter(user_id=user_id)
                qs_json = serializers.serialize('json', qs)
                return HttpResponse(qs_json, content_type="application/json",status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'Bad Request': 'Error occurred'}, status=status.HTTP_400_BAD_REQUEST)

class DeleteSubscriptionsView(APIView):

    def delete(self, request, format=None):

        try:
            user_id = request.data.get('user')
            follow_id = request.data.get('follow')

            obj = UserFollow.objects.filter(user_id=user_id, follow_id=follow_id)
            #print(obj)
            if obj:
                obj.delete()
                return Response({'Success': 'Action performed'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(e)
        return Response({'Bad Request': 'Error ocurred'}, status=status.HTTP_400_BAD_REQUEST)

class AddSubscription(APIView):
    serializer_class = SubscriptionsSerializer
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user_id = serializer.data.get('user')
            follow_id = serializer.data.get('follow')
            qs = UserFollow.objects.filter(user_id=user_id, follow_id=follow_id)
            if not qs:
                if not user_id or not follow_id:
                    return Response({'Bad request': 'Invalid user or followed user.'}, status=status.HTTP_400_BAD_REQUEST)
                sub = UserFollow(
                    user_id=user_id,
                    follow_id=follow_id
                )
                sub.save()
                return Response({'Success': 'Subscription successfully created'}, status=status.HTTP_200_OK)
            else:
                return Response({'Bad Request': 'Subscription already exists'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Invalid parameters'}, status=status.HTTP_400_BAD_REQUEST)

'''
Retrieve the list of users to which the user with $user_id$ has subscribed
'''
class GetFollowedUsersView(APIView):
    lookup_url = 'user_id'

    def get(self, request, format=None):
        try:
            user_id = request.GET.get(self.lookup_url)
            followed_users = UserFollow.objects.filter(user_id=user_id)
            response = {}
            response['users'] = []
            index = 0
            for user in followed_users.values():
                response['users'].append({})
                follow_obj = User.objects.filter(id=user.get('follow_id')).values()
                follow = follow_obj[0]

                prof_obj = UserProfile.objects.filter(user_id=user.get('follow_id')).values()
                prof = prof_obj[0]
                response['users'][index] = {}
                obj = response['users'][index]

                obj['id'] = follow.get('id')
                obj['username'] = follow.get('username')
                obj['first_name'] = follow.get('first_name')
                obj['last_name'] = follow.get('last_name')
                obj['email'] = follow.get('email')
                obj['avatar_url'] = prof.get('avatar_url')
                obj['description'] = prof.get('description')

                index += 1
            return JsonResponse(response, status=status.HTTP_200_OK )
            
        except Exception as e:
            print(e)
            return Response({'Bad Request': 'Error Occurred'}, status=status.HTTP_400_BAD_REQUEST)

class GetSubscribedUsersView(APIView):
    lookup_url = 'user_id'

    def get(self, request, format=None):
        try:
            user_id = request.GET.get(self.lookup_url)
            followed_users = UserFollow.objects.filter(follow_id=user_id)
            response = {}
            response['users'] = []
            index = 0
            for user in followed_users.values():
                response['users'].append({})
                follow_obj = User.objects.filter(id=user.get('user_id')).values()
                follow = follow_obj[0]

                prof_obj = UserProfile.objects.filter(user_id=user.get('user_id')).values()
                prof = prof_obj[0]
                response['users'][index] = {}
                obj = response['users'][index]
                obj['id'] = follow.get('id')
                obj['username'] = follow.get('username')
                obj['first_name'] = follow.get('first_name')
                obj['last_name'] = follow.get('last_name')
                obj['email'] = follow.get('email')
                obj['avatar_url'] = prof.get('avatar_url')
                obj['description'] = prof.get('description')

                index += 1
            return JsonResponse(response, status=status.HTTP_200_OK )
            
        except Exception as e:
            print(e)
            return Response({'Bad Request': 'Error Occurred'}, status=status.HTTP_400_BAD_REQUEST)


'''
Moment Views
'''
class DeleteMomentView(APIView):
    def delete(self, request, format=None):
        try:
            if request.session['id'] != None:
                id = request.data.get('moment_id')
                moment = Moment.objects.filter(id=id)
                moment.delete()
                return Response({'Success': 'Moment deleted'}, status=status.HTTP_200_OK)
            else:
                return Response({'Failed': 'Login first'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(e)
            return Response({'Bad Request': 'Error Occurred'}, status=status.HTTP_400_BAD_REQUEST)

class CreateMomentView(APIView):
    serializer_class = CreateMomentSerializer
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if(serializer.is_valid):
            try:
                user = request.data.get('user')
                if user is None or request.session['id'] is None:
                    return Response({'Bad Request': 'User not exist'}, status=status.HTTP_404_NOT_FOUND)
            
                text = request.data.get('text')
                img_url = request.data.get('img_url')

                moment = Moment(
                    user_id = user,
                    text = text,
                    img_url = img_url
                )
                moment.save()
                return Response({'moment_id': moment.id}, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({'Bad Request': 'Erorr occurred when creating moments'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Faild to Create moment'}, status=status.HTTP_400_BAD_REQUEST)

class LikeMomentView(APIView):
    
    def post(self, request, format=None):
        moment_id = request.data.get('moment_id')
        user_id = request.data.get('user_id')
        if id:
            try:
                moment_obj = MomentLike.objects.filter(moment_id=moment_id, user_id=user_id)
                if not moment_obj:
                    rep = Moment.objects.filter(id=moment_id).update(likes = F('likes') + 1)
                    moment_like = MomentLike(
                        moment_id = moment_id,
                        user_id = user_id
                    )
                    moment_like.save()
                    return Response({'Success': 'Action completed'}, status=status.HTTP_200_OK)
                else:
                    return Response({'Bad Request': 'Moment already created'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(e)
                return Response({'Bad Request': 'Not found'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'No id specified'}, status=status.HTTP_400_BAD_REQUEST)

class DislikeMomentView(APIView):
    
    def post(self, request, format=None):
        moment_id = request.data.get('moment_id')
        user_id = request.data.get('user_id')
        if id:
            try:
                like_obj = MomentLike.objects.filter(moment_id = moment_id, user_id = user_id)
                if like_obj:
                    like_obj.delete()
                    rep = Moment.objects.filter(id=moment_id).update(likes = F('likes') - 1)
                    return Response({'Success': 'Action completed'}, status=status.HTTP_200_OK)
                else:
                    return Response({'Bad Request': 'The user has not liked the comment'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(e)
                return Response({'Bad Request': 'Not found'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'No id specified'}, status=status.HTTP_400_BAD_REQUEST)

class GetMomentView(APIView):
    loopup_url = 'user_id'
    
    def get(self, request, format=None):
        user_id = request.GET.get(self.loopup_url)

        if user_id:
            try:
                moments = Moment.objects.filter(user_id=user_id)
                if not moments:
                    return Response({'Bad Request': 'Not found'}, status=status.HTTP_400_BAD_REQUEST)

                response = {}
                index = 0
                response['moments'] = []

                for moment in moments.values():
                    response['moments'].append({})
                    mom_obj = response['moments'][index]
                    mom_obj['id'] = moment.get('id')
                    mom_obj['text'] = moment.get('text')
                    mom_obj['likes'] = moment.get('likes')
                    mom_obj['img_url'] = moment.get('img_url')
                    mom_obj['user'] = moment.get('user_id')
                    index = index + 1

                return JsonResponse(response, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({'Bad Request': 'An error occurred'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Moment_id is not provided'}, status=status.HTTP_400_BAD_REQUEST)

class GetAllMoments(APIView):
    def get(self, request, format=None):
        try:
            moments = Moment.objects.filter()
            response = {}
            response['moments'] = []
            index = 0
            for moment in moments.values():
                response['moments'].append({})
                mom_obj = response['moments'][index]
                mom_obj['id'] = moment.get('id')
                mom_obj['text'] = moment.get('text')
                mom_obj['likes'] = moment.get('likes')
                mom_obj['img_url'] = moment.get('img_url')
                mom_obj['user'] = moment.get('user_id')
                index = index + 1
            return JsonResponse(response, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'Bad request': 'An error occurred'}, status=status.HTTP_400_BAD_REQUEST)

'''
Ingredient
'''
class CreateIngredientView(APIView):
    serializer_class = IngrendientSerializer
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            recipe_id = request.data.get('recipe_id')
            name = request.data.get('name')
            amount = request.data.get('amount')
            unit = request.data.get('unit')
            ing = RecipeIngredient(
                recipe_id = recipe_id,
                name = name,
                amount = amount,
                unit = unit,
            )
            ing.save()
            return Response({'ingredient_id': ing.id}, status=status.HTTP_200_OK)
        return Response({'Bad request': 'Failed to create ingredients'}, status=status.HTTP_400_BAD_REQUEST)

class Upload(APIView):  
    def post(self, request, format=None):
        try:
            fileserver = "http://3.24.216.74:8890"
            def post(*args, **kwargs):
                return requests.post(fileserver+'/upload', verify=False, *args, **kwargs)
            dict = json.dumps(request.data)
            js_dict = json.loads(dict)
            if request.session['id'] == None:
                return Response({'Bad request': 'You need to log in'}, status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.get(id=int(request.session['id']))
            #token = js_dict["token"]
            timestamp=int(time.time())*1000

            filename = user.username + str(timestamp)+"_"+js_dict["filename"]
            # print(js_dict["content"])
            post(files={
                'files': (filename,base64.b64decode(js_dict["content"].split(",")[1])),
            })
            return Response({'fileUrl': fileserver+"/"+filename})
        except Exception as e:
            print(e)


'''
Email
'''
# Send email model, used to sent verify email to the user email address
class SendEmail(APIView):
    def post(self, request, format=None):
        #generate 6-digital verify code
        s = ''
        for i in range(6):
            num = random.randint(0,9)
            if True:
                upper_alpha = chr(random.randint(65,90))
                lower_alpha = chr(random.randint(97,122))
                num = random.choice([num,upper_alpha,lower_alpha])
            s = s + str(num)
        dict = json.dumps(request.data)
        js_dict = json.loads(dict)
        user_email = js_dict["email"]
        #send verify email to user email box
        port = 465  # For SSL
        smtp_server = "smtp.gmail.com"
        sender_email = "kitchendown@gmail.com"  # Enter your address
        receiver_email = user_email # Enter receiver address
        password = 'yinmierweida123'
        message = "Thank you for registering in DownKitchen, and your Verification Code for DownKitchen is " + s
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message)

        return Response({'Success': 'Verify Email Sent.', 'code': s}, status=status.HTTP_200_OK)

class Login(APIView):
    def post(self, request, format=None):
        username = request.data.get("username")
        password = request.data.get("password")

        if username and password:
            try:
                user = authenticate(username=username.strip(), password=password)
                if user is not None:
                    prof = UserProfile.objects.get(user_id=user.id)
                    request.session['id'] = user.id
                    request.session['isLogin'] = True
                    request.session.set_expiry(0)
                    response = {}
                    response['Success'] = 'Login Successful'
                    response['id'] = user.id
                    response['username'] = user.username
                    response['email'] = user.email
                    response['avatar'] = prof.avatar_url
                    response['description'] = prof.description
                    return Response(response, status=status.HTTP_200_OK)
                else:
                    return Response({'Failed': 'User name or password not matched'}, status=status.HTTP_404_NOT_FOUND)

            except Exception as e:
                print(e)
                return Response({'Failed': 'Bad request'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'Failed': 'Bad request'}, status=status.HTTP_400_BAD_REQUEST)

class Logout(APIView):
    def get(self, request, format=None):
        del request.session['id']
        request.session['islogin'] = False
        return Response( {"Successful": "Logout Successful"}, status=status.HTTP_200_OK)
''' 
user
'''

class CreateUserView(APIView):
    serializer_class = UserSerializer
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        try:
            if serializer.is_valid():
                username = serializer.data.get('username')
                password = serializer.data.get('password')
                email = serializer.data.get('email')
                first_name = serializer.data.get('first_name')
                last_name = serializer.data.get('last_name')

                user = User.objects.create_user(username, email, password)
                user.first_name = first_name
                user.last_name = last_name
                user.save()
                return Response({'id': user.id})

        except Exception as e:
            print(e)
        return Response({'Failed': 'Error occurred.'}, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserProfile(APIView):
    serializer_class = UserProfileSerializer
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        try:
            if serializer.is_valid():
                user_id = request.data.get('user')
                avatar = serializer.data.get("avatar_url")
                description = serializer.data.get('description')

                prof = UserProfile.objects.filter(user_id=user_id).update(
                    avatar_url = avatar,
                    description = description
                )
                return Response({'Success', 'Updated'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
        return Response({'Failed': 'Error occurred.'}, status=status.HTTP_400_BAD_REQUEST)

class UpdateUserInfo(APIView):
    serializer_class = UpdateUserSerializer
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        try:
            if serializer.is_valid():
                if request.session['id'] != None:
                    user_id = request.data.get('id')
                    first_name = serializer.data.get('first_name')
                    last_name = serializer.data.get('last_name')
                    email = serializer.data.get('email')
                    password = request.data.get('password')
                    avatar = request.data.get('avatar')
                    description = request.data.get('description')

                    user = User.objects.get(id=user_id)
                    if password != '':
                        user.first_name = first_name
                        user.last_name = last_name
                        user.set_password(password)
                    else:
                        user.first_name = first_name
                        user.last_name = last_name
                        user.email = email
                    user.save()

                    prof = UserProfile.objects.filter(user_id=user_id)
                    prof.update(
                        avatar_url=avatar,
                        description=description
                    )
                    request.session['email'] = email
                    request.session['avatar'] = avatar
                    request.session['description'] = description
                    return Response({'Success', 'User info updated'}, status=status.HTTP_200_OK)
                else:
                    return Response({'Failed', 'Login in first'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
             print(e)
        return Response({'Failed': 'Error occurred.'}, status=status.HTTP_400_BAD_REQUEST)


class GetFullUserDetailView(APIView):
    loopup_url = 'id'
    def get(self, request, format=None):
        try:
            id = request.GET.get('id')
            if id:
                response = {}
                user = User.objects.get(id=id)
                prof = UserProfile.objects.get(user_id=id)
                if user:
                    response['username'] = user.username
                    response['email'] = user.email
                    response['description'] = prof.description
                    response['avatar'] = prof.avatar_url

                    total = 0
                    recipes = Recipe.objects.filter(author_id = id)
                    for recipe in recipes.values():
                        total += recipe.get('likes')
                    response['total_likes'] = total
                    return JsonResponse(response, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'Bad Request': 'Error occurred.'},status=status.HTTP_400_BAD_REQUEST)

'''
Subscription
'''
class GetUserCollectionsByUserView(APIView):
    lookup_url = 'user_id'
    def get(self, request, format=None):
        try:
            user_id = request.GET.get(self.lookup_url)
            collections = Collection.objects.filter(user_id=user_id)
            response = {}
            response['collections'] = []
            index = 0

            for collection in collections.values():
                response['collections'].append({})
                response['collections'][index] = collection
                obj = response['collections'][index]
                recipe_obj = Recipe.objects.filter(id=collection.get('recipe_id')).values()
                recipe = recipe_obj[0]

                obj['img_url'] = recipe.get('img_url')
                obj['likes'] = recipe.get('likes')
                index += 1
            
            return JsonResponse(response, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'Bad Request': 'Error occurred.'},status=status.HTTP_400_BAD_REQUEST)

class GetUserCollectionsByIdView(APIView):
    lookup_url = 'collection_id'
    def get(self, request, format=None):
        try:
            collection_id = request.GET.get(self.lookup_url)
            collection = Collection.objects.filter(id=collection_id)
            response = {}
            response['collection'] = collection.values()[0]
            
            return JsonResponse(response, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({'Bad Request': 'Error occurred.'},status=status.HTTP_400_BAD_REQUEST)            

class CreateCollectionInstanceView(APIView):
    serializer_class = CollectionSerializer
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        try:
            if serializer.is_valid():
                user_id = serializer.data.get('user')
                recipe_id = serializer.data.get('recipe')

                collection = Collection(
                    user_id = user_id,
                    recipe_id = recipe_id
                )
                collection.save()
                return Response({'id': collection.id}, status=status.HTTP_200_OK)

        except Exception as e:
             print(e)
        
        return Response({'Bad Request': 'Error occurred.'},status=status.HTTP_400_BAD_REQUEST)   

class DeleteCollectionView(APIView):

    def delete(self, request, format=None):
        try:
            if request.session['id'] != None:
                collection_id = request.data.get('collection_id')
                collection = Collection.objects.get(id=collection_id)
                collection.delete()
                return Response({'Success':'Subscription deleted'}, status=status.HTTP_200_OK)
            else:
                return Response({'Failed': 'Login in first'}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            print(e)
            return Response({'Bad Request': 'Error occurred.'},status=status.HTTP_400_BAD_REQUEST)                      

'''
Step
'''
class CreateStepView(APIView):
    serializer_class = CreateStepSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if request.session['id'] != None:
                img_url = serializer.data.get('img_url')
                order = serializer.data.get('order')
                name = serializer.data.get('name')
                desc = serializer.data.get('desc')
                recipe_id = serializer.data.get('recipe_id')

                step = Step(
                    img_url=img_url,
                    order=order,
                    name=name,
                    desc=desc,
                    recipe_id_id=recipe_id,
                )
                step.save()

                return Response({'id':step.id}, status=status.HTTP_200_OK)
            else:
                return Response({'Failed': 'Login in first'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserInfomation(APIView):
    def get(self, request, format=None):
        try:
            user_id = int(request.session['id'])
            response = {}
            if request.session['id'] != None:
                user = User.objects.get(id=user_id)
                prof = UserProfile.objects.get(user_id=user_id)

                response['id'] = request.session['id']
                response['username'] = user.username
                response['email'] = user.email
                response['avatar'] = prof.avatar_url
                response['description'] = prof.description

                return Response(response, status=status.HTTP_200_OK)
            else:
                response['message'] = 'Login in first'
                return Response(response, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(e)
