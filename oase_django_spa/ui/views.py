from django.shortcuts import render
from django.http import HttpRequest

def _render(request: HttpRequest, page: str, context=None):
    context = context or {}
    # full page vs partial (HTMX)
    if request.headers.get("HX-Request"):
        return render(request, f"pages/{page}_partial.html", context)
    return render(request, f"pages/{page}.html", context)

def home(request):
    return _render(request, "home", {"active_top": "home"})

def activity(request):
    return _render(request, "activity", {"active_top": "activity"})

def activity_history(request):
    return _render(request, "activity_history", {"active_top": "activity", "active_activity_tab": "history"})

def activity_announcements(request):
    return _render(request, "activity_announcements", {"active_top": "activity", "active_activity_tab": "announcements"})

def activity_my_report(request):
    return _render(request, "activity_my_report", {"active_top": "activity", "active_activity_tab": "my-report"})

def purchase(request):
    return _render(request, "purchase", {"active_top": "purchase"})

def purchase_buy(request):
    return _render(request, "purchase_buy", {"active_top": "purchase", "active_purchase_tab": "buy"})

def purchase_history(request):
    return _render(request, "purchase_history", {"active_top": "purchase", "active_purchase_tab": "history"})

def purchase_active(request):
    return _render(request, "purchase_active", {"active_top": "purchase", "active_purchase_tab": "active"})

def account(request):
    return _render(request, "account", {"active_top": "account"})

def journey(request):
    return _render(request, "journey", {"active_side": "journey"})

def practice(request):
    return _render(request, "practice", {"active_side": "practice"})

def practice_topic(request, topic_id: int):
    return _render(request, "practice_topic", {"active_side": "practice", "topic_id": topic_id})

def practice_start(request, test_id: int):
    return _render(request, "practice_start", {"active_side": "practice", "test_id": test_id})

def materials(request):
    return _render(request, "materials", {"active_side": "materials"})

def tryout(request):
    return _render(request, "tryout", {"active_side": "tryout"})
