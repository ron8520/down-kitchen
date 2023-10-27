
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView


@api_view(['GET'])
def ApiOverview(request):
    api_urls = {
        'Recipe':'/api/recipe'
    }

    return Response(api_urls)





