cd ..
cd back

call venv/scripts/activate

python manage.py makemigrations
python manage.py migrate


cmd
