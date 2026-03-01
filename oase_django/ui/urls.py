from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),

    # activity page
    # path('activity/', views.activity_history, name='activity_history'),
    path('activity/', views.activity_history, name='activity'),
    path('activity/history/', views.activity_history, name='activity_history'),
    path('activity/announcements/', views.activity_announcements, name='activity_announcements'),
    path('activity/my-report/', views.activity_my_report, name='activity_my_report'),

    path('purchase/', views.purchase_buy, name='purchase'),
    path('purchase/buy/', views.purchase_buy, name='purchase_buy'),
    path('purchase/history/', views.purchase_history, name='purchase_history'),
    path('purchase/active/', views.purchase_active, name='purchase_active'),

    path('account/', views.account, name='account'),

    path('journey/', views.journey, name='journey'),
    path('practice/', views.practice, name='practice'),
    path('practice/topic/<int:topic_id>/', views.practice_topic, name='practice_topic'),
    path('practice/start/<int:test_id>/', views.practice_start, name='practice_start'),
    path('materials/', views.materials, name='materials'),
    path('tryout/', views.tryout, name='tryout'),
]
