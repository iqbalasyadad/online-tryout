from django.shortcuts import render
from django.http import HttpRequest


# ─────────────────────────────────────────────────────────────
#  Helper: deteksi apakah request dari HTMX
#  (kalau pakai django-htmx: request.htmx — tapi ini manual)
# ─────────────────────────────────────────────────────────────
def is_htmx(request: HttpRequest) -> bool:
    return request.headers.get("HX-Request") == "true"


def htmx_or_full(request, template_partial, template_full, context=None):
    """
    Kalau HTMX request → render partial (cuma konten tengah).
    Kalau full-page (direct URL / refresh) → render full layout.
    """
    context = context or {}
    if is_htmx(request):
        return render(request, template_partial, context)
    return render(request, template_full, context)


# ─────────────────────────────────────────────────────────────
#  HALAMAN UTAMA
# ─────────────────────────────────────────────────────────────

def home(request):
    context = {
        "active_page": "home",
        "tryouts": [
            {"title": "1 Tryout SKD CPNS 2026", "participant_count": 5659, "is_free": True,
             "is_unlocked": True, "is_completed": True, "score": 0},
            {"title": "1 Tryout TIU CPNS 2026", "participant_count": 2121, "is_free": True,
             "is_unlocked": True, "is_completed": False, "score": None},
            {"title": "1 Tryout TKP CPNS 2026", "participant_count": 221, "is_free": True,
             "is_unlocked": True, "is_completed": False, "score": None},
        ],
    }
    return htmx_or_full(request, "pages/home.html", "home.html", context)


def activity(request):
    from datetime import datetime
    context = {
        "active_page": "activity",
        "history_items": [
            {"title": "SKD CPNS 2026 – Sesi 1", "date": datetime(2025, 3, 10, 9, 0),
             "status": "Selesai", "score": 312},
        ],
    }
    return htmx_or_full(request, "pages/activity.html", "activity.html", context)


def activity_tab(request, tab_name: str):
    """
    Endpoint khusus untuk HTMX swap tab di halaman Aktivitas.
    Selalu mengembalikan partial — tidak perlu full layout.
    """
    templates = {
        "history":      "partials/activity_tab_history.html",
        "report":       "partials/activity_tab_report.html",
        "announcement": "partials/activity_tab_announcement.html",
    }
    template = templates.get(tab_name, "partials/activity_tab_history.html")

    context = {}
    if tab_name == "history":
        from datetime import datetime
        context["history_items"] = [
            {"title": "SKD CPNS 2026 – Sesi 1", "date": datetime(2025, 3, 10, 9, 0),
             "status": "Selesai", "score": 312},
        ]
    return render(request, template, context)


def purchase(request):
    context = {"active_page": "purchase"}
    return htmx_or_full(request, "pages/purchase.html", "purchase.html", context)


def account(request):
    context = {"active_page": "account"}
    return htmx_or_full(request, "pages/account.html", "account.html", context)


# ─────────────────────────────────────────────────────────────
#  SIDEBAR PAGES
# ─────────────────────────────────────────────────────────────

def journey(request):
    context = {"active_page": "journey"}
    return htmx_or_full(request, "pages/journey.html", "journey.html", context)


def practice(request):
    context = {"active_page": "practice"}
    return htmx_or_full(request, "pages/practice.html", "practice.html", context)


def materials(request):
    context = {"active_page": "materials"}
    return htmx_or_full(request, "pages/materials.html", "materials.html", context)


def tryout(request):
    context = {"active_page": "tryout"}
    return htmx_or_full(request, "pages/tryout.html", "tryout.html", context)
