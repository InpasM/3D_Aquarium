import os
from django.conf import settings
from django.http import HttpResponse
from django.templatetags.static import static
from django.shortcuts import render

def index(request):
    return render(request, 'index.html')