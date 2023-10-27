from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.fields import ReadOnlyField
from .models import Recipe, Tip, UserFollow, Comment, Reply,UserProfile, Moment, RecipeIngredient, Collection, Step

'''
Recipe
'''
class RecipeGetAllCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ('id')
class RecipeSerializer(serializers.ModelSerializer):

    class Meta:
        #   field should match with the model
        model = Recipe
        fields = ('id', 'name', 'description', 'ingredients', 'cooking_time', 'difficulty', 'likes', 'status', 'video_link')
        ReadOnlyField = ('id', 'name', 'description', 'ingredients', 'cooking_time', 'difficulty', 'likes', 'status')
class CreateRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ('name', 'description','cooking_time', 'difficulty','author', 'video_link', "img_url")

'''
Subscriptions
'''
class GetSubscriptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollow
        fields = ('user',)

class SubscriptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollow
        fields = ('user', 'follow')

'''
Comments 
'''
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = serializers.ALL_FIELDS

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        serializers.ALL_FIELDS

class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('user', 'recipe', 'text')

class ModifyCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'text')

class CreateReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ('text', 'user', 'comment')

class ModifyReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ('id', 'text')


'''
Moment
'''
class CreateMomentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Moment
        fields = ('user', 'img_url', 'text')


'''
User
'''
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('avatar_url', 'description')

'''
Ingredient
'''
class IngrendientSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeIngredient
        fields = ('recipe', 'name', 'amount', 'unit')

class IngrendientNoIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeIngredient
        fields = ('name', 'amount', 'unit')

'''
User 
'''
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')

'''
Subscription
'''
class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ('user', 'recipe')


'''
Step
'''
class CreateStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ('img_url', 'order', 'name', 'desc', 'recipe_id')

class CreateStepNoId(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ('img_url', 'order', 'name', 'desc')
