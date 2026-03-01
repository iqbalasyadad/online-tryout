from django.urls import path
from core import views

urlpatterns = [
    # ── Navbar pages ──
    path("",              views.home,     name="home"),
    path("activity/",     views.activity, name="activity"),
    path("purchase/",     views.purchase, name="purchase"),
    path("account/",      views.account,  name="account"),

    # ── Sidebar pages ──
    path("journey/",      views.journey,  name="journey"),
    path("practice/",     views.practice, name="practice"),
    path("materials/",    views.materials,name="materials"),
    path("tryout/",       views.tryout,   name="tryout"),

    # ── HTMX tab partials (tidak ubah URL utama) ──
    path("activity/tab/<str:tab_name>/", views.activity_tab, name="activity_tab"),
]
