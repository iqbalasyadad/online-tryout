# Oase Learning (Django + SPA-like navigation via HTMX)

Ini adalah konversi dari `index.html` lama menjadi project Django yang:
- Layout (navbar / sidebar / rightbar) tetap
- Konten tengah (`#main-content`) berubah via HTMX
- URL ikut berubah (`hx-push-url="true"`) → back/forward & refresh aman

## Jalankan

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Buka: http://127.0.0.1:8000/

## Struktur

- `config/` : settings & urls utama
- `ui/`     : app UI (routing + views)
- `templates/`
  - `base.html`               : layout utama
  - `partials/`               : navbar/sidebar/footer
  - `pages/*_partial.html`    : konten tengah (HTMX swap)
  - `pages/*.html`            : full page wrapper untuk refresh langsung
- `static/css/app.css`        : CSS dari file lama (dipindah dari <style>)
- `static/js/app.js`          : JS lama dirapikan + HTMX hooks
