from django.shortcuts import render

# Create your views here.
def data(request):
	return render(request, 'data.html')

def search(request):
	return render(request, 'search.html')

def analyze(request):
	return render(request, 'analyze.html')
def searchdetail(request):
	return render(request, 'searchdetail.html')
def result(request):
	return render(request, 'result.html')