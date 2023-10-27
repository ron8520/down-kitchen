from django.urls import path
from .views import \
    RecipeView, \
    CreateRecipeView, \
    GetSubscriptionsView,\
    DeleteSubscriptionsView,\
    AddSubscription,CreateRecipeCommentView,\
    RecipeGetAllCommentsView, RecipeGetDetails, DeleteCommentView, DeleteRecipeView,\
    CreateReplyView, UpdateReplyView, DeleteReplyView,\
    LikeRecipeView, DislikeRecipeView, GetAllRecipes,SearchRecipes,\
    CreateMomentView, LikeMomentView, DislikeMomentView, CreateIngredientView, GetMomentView, DeleteMomentView,\
    CreateIngredientView, Upload, SendEmail, CreateUserView, GetRecipeByUserId,\
    GetFollowedUsersView, GetFullUserDetailView, GetSubscribedUsersView,\
    CreateCollectionInstanceView, GetUserCollectionsByIdView, GetUserCollectionsByUserView, DeleteCollectionView,\
    CreateStepView,GetFollowedUsersView, GetFullUserDetailView, GetSubscribedUsersView, Login,\
    CheckLikeRecipe, CheckMomentIfLikedView, GetAllMoments, UpdateUserProfile, UpdateUserInfo, CreateRecipeOneStepView,\
    GetFeatureMomentView, Logout, CurrentUserInfomation

urlpatterns = [
    path('recipe', RecipeView.as_view()),
    path('recipe/create', CreateRecipeView.as_view()),
    path('recipe/comments/', RecipeGetAllCommentsView.as_view()),
    path('recipe/details/', RecipeGetDetails.as_view()),
    path('recipe/comments/create', CreateRecipeCommentView.as_view()),
    path('recipe/reply/create', CreateReplyView.as_view()),
    path('recipe/reply/update', UpdateReplyView.as_view()),
    path('recipe/reply/delete', DeleteReplyView.as_view()),
    path('recipe/comment/delete', DeleteCommentView.as_view()),
    path('recipe/like', LikeRecipeView.as_view()),
    path('recipe/dislike', DislikeRecipeView.as_view()),
    path('recipe/ingredient/create', CreateIngredientView.as_view()),
    path('recipe/getByUser/', GetRecipeByUserId.as_view()),
    path('recipe/getAll', GetAllRecipes.as_view()),
    path('recipe/search', SearchRecipes.as_view()),
    path('recipe/delete', DeleteRecipeView.as_view()),
    path('recipe/step/create', CreateStepView.as_view()),
    path('recipe/ifLiked/', CheckLikeRecipe.as_view()),
    path('recipe/create/oneStep', CreateRecipeOneStepView.as_view()),
    
    path('upload', Upload.as_view()),
    path('sendemail', SendEmail.as_view()),
    
    path('moment/create', CreateMomentView.as_view()),
    path('moment/like', LikeMomentView.as_view()),
    path('moment/dislike', DislikeMomentView.as_view()),
    path('moment/ifLiked/', CheckMomentIfLikedView.as_view()),
    path('moment/get/', GetMomentView.as_view()),
    path('moment/getAll', GetAllMoments.as_view()),
    path('moment/delete', DeleteMomentView.as_view()),
    path('moment/feature', GetFeatureMomentView.as_view()),
    
    path('sub/get', GetSubscriptionsView.as_view()),
    path('sub/delete', DeleteSubscriptionsView.as_view()),
    path('sub/create', AddSubscription.as_view()),
    path('sub/follow/', GetFollowedUsersView.as_view()),
    path('sub/subscribe/', GetSubscribedUsersView.as_view()),

    path('user/create', CreateUserView.as_view()),
    path('user/get/', GetFullUserDetailView.as_view()),
    path('user/profile/update', UpdateUserProfile.as_view()),
    path('user/collection/get/', GetUserCollectionsByUserView.as_view()),
    path('collection/get/', GetUserCollectionsByIdView.as_view()),
    path('user/update', UpdateUserInfo.as_view()),
    path('collection/delete', DeleteCollectionView.as_view()),
    path('collection/create', CreateCollectionInstanceView.as_view()),
    path('login', Login.as_view()),
    path('logout', Logout.as_view()),
    path('userinfo', CurrentUserInfomation.as_view()),
]