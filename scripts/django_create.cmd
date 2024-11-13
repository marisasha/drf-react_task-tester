cd ..
mkdir back
cd back

python -m venv venv
call venv/scripts/activate

pip install django pillow
pip install djangorestframework
pip install django-cors-headers
pip install --upgrade djangorestframework-simplejwt
pip install psycopg2




django-admin startproject django_settings .
django-admin startapp django_app



python manage.py makemigrations
python manage.py migrate


python manage.py createsuperuser





python manage.py runserver

cmd