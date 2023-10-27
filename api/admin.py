from django.contrib import admin
from django.contrib.auth.models import User
from .models import Recipe, Tip, UserFollow, Reply, Comment, UserProfile, Step, Moment, MomentLike,Collection,\
    RecipeLike, RecipeIngredient

class ReadIdAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)

# Register your models here.
admin.site.register(Recipe, ReadIdAdmin)
admin.site.register(Tip, ReadIdAdmin)
admin.site.register(UserFollow, ReadIdAdmin)
admin.site.register(Reply, ReadIdAdmin)
admin.site.register(UserProfile)
admin.site.register(Comment, ReadIdAdmin)
admin.site.register(Moment, ReadIdAdmin)
admin.site.register(MomentLike, ReadIdAdmin)
admin.site.register(RecipeIngredient)
admin.site.register(RecipeLike, ReadIdAdmin)
admin.site.unregister(User)
admin.site.register(Collection, ReadIdAdmin)
admin.site.register(Step, ReadIdAdmin)
admin.site.register(User, ReadIdAdmin)