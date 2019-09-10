from django.conf.urls import url
from data import views

urlpatterns = [
	url(r'^$', views.data, name='data'),
    url(r'^search/$', views.search, name='search'),
    url(r'^analyze/$', views.analyze, name='analyze'),
    url(r'^searchdetail/$',views.searchdetail, name='searchdetail'),
    url(r'^result/$',views.result, name='result'),
]