
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import User
from django.db.models.fields import related
from django.utils.translation import gettext as _
from django.dispatch import receiver
from django.db.models.signals import post_save
'''
for views
'''
class Recipe(models.Model):
    DIFFICULTY_LEVELS = (
        ('EA', 'Easy'),
        ('NO', 'Novice'),
        ('IN', 'Intermediate'),
        ('CH', 'Challenging'),
    )

    PROCESS_STATUS = (
        ('P', 'Processing'),
        ('D', 'Declined'),
        ('A', 'Approved'),
        ('R', 'Under Review')
    )
    name = models.CharField(max_length=30, default="")
    description = models.CharField(max_length=255, default="")
    author = models.ForeignKey(User, on_delete=models.CASCADE, to_field='id', related_name='auth_user')
    ingredients = models.CharField(max_length=255)
    cooking_time = models.IntegerField(default=0)
    difficulty = models.CharField(max_length=2, default='', choices=DIFFICULTY_LEVELS)
    likes = models.IntegerField(default=0)
    reports = models.IntegerField(default=0)
    saves = models.IntegerField(default=0)
    status = models.CharField(max_length=2, choices=PROCESS_STATUS)
    video_link = models.CharField(max_length=255, default="", blank=True)
    img_url = models.CharField(max_length=255, default="", blank=True)

'''
CRUD
'''
class Tip(models.Model):
    content = models.CharField(max_length=300)

class UserFollow(models.Model):
    class Meta:
        unique_together= (('user', 'follow'),)

    def clean(self):
        if(self.user == self.follow):
           raise ValidationError(_('A user shall not follow themselves'))
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, to_field='id', related_name='follow_user')
    follow = models.ForeignKey(User, null=True, on_delete=models.CASCADE, to_field='id', related_name='follow_follow')

class Moment(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, to_field='id', related_name='moment_user')
    img_url = models.CharField(blank=True, max_length=150)
    likes = models.IntegerField(default=0)
    text = models.CharField(blank=True, max_length=300)


class MomentLike(models.Model):
    class Meta:
        unique_together= (('user', 'moment'),)
    moment = models.ForeignKey(Moment, null=True, on_delete=models.CASCADE, to_field='id')
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, to_field='id')
    
class RecipeLike(models.Model):
    class Meta:
        unique_together= (('user', 'recipe'),)
    recipe = models.ForeignKey(Recipe, null=True, on_delete=models.CASCADE, to_field='id')
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, to_field='id')
    

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, to_field='id', related_name='prof_user')
    avatar_url = models.CharField(max_length=300, default='http://3.25.207.134/adali1636720856000_avatar.png')
    description = models.CharField(max_length=255, default='')
    gender = models.CharField(max_length=1, default='?')

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            UserProfile.objects.create(user=instance)
    

class Comment(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, to_field='id', related_name='comment_user')
    recipe = models.ForeignKey(Recipe, null=True, on_delete=models.CASCADE, to_field='id', related_name='comment_recipe')
    text = models.CharField(max_length=150, default='')
    created_at = models.DateTimeField(auto_now_add=True)

class Reply(models.Model):
    text = models.CharField(max_length=150, default='')
    user = models.ForeignKey(User, null=True ,on_delete=models.CASCADE, to_field='id', related_name='reply_user')
    comment = models.ForeignKey(Comment, null=True, on_delete=models.CASCADE, to_field='id', related_name='comment_reply')
    created_at = models.DateTimeField(auto_now_add=True)

class Step(models.Model):
    
    def clean(self):
        if(self.order <= 0):
            raise ValidationError(_('Order must be a positive integer'))

    img_url = models.CharField(max_length=150, blank=True)
    order = models.IntegerField()
    name = models.CharField(max_length=50, blank=True)
    desc = models.CharField(max_length=150, blank=True)
    recipe_id = models.ForeignKey(Recipe, on_delete=models.CASCADE, to_field='id', related_name='step')

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, default=0, null=True, on_delete=models.CASCADE, to_field='id', related_name='ing_recipe')
    name = models.CharField(max_length=20)
    amount = models.IntegerField(default=0)
    unit = models.CharField(max_length=15, blank=True)


class Collection(models.Model):
    class Meta:
        unique_together= (('user', 'recipe'),)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, to_field='id')
    recipe = models.ForeignKey(Recipe, null=True, on_delete=models.CASCADE, to_field='id')


    
