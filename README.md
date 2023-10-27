# Down Kitchen
Due to the influence of  Covid-19, many restaurants are closed temporarily, and some districts have published the lockdown policy. People who do not have cooking experience may have trouble with their daily diets in such situations. To alleviate this dilemma, this web application called DownKitchen is implemented intending to provide easy recipes to users, share cooking moments, and communicate with other users in the comment area.


### Start
To Build Project, follow this tutorial to install python, django and set up a virtual environment
https://medium.com/analytics-vidhya/virtual-environment-6ad5d9b6af59

then use `virtual/Scripts/activate` to activate your virtual environment, and `virtual/Scripts/deactivate` to deactivate it.

* Before run the server, make sure your environment has installed `Node.js`, `Python` and successful install `Django` in your local environment
* The requirement version:
  * `Node.js`: 14.17.5 or higher
  * `Python`: 3.6 or higher
  * `Django`: 3.2

* After install Django, use pip to install all the modules for Django
  * `rest_framework`
  * `corsheaders`
  * `mysqlclient`
  * `pymysql`

## Usage
### Frontend
Then at `/frontend` use `npm install` to install packages and `npm start` to run frontend

### Backend
At root directory, run `python manage.py runserver` to start the backend server. 
**You can see the RestAPI at the root url** of backend server. (http://127.0.0.1:8000/ for localhost)


### Change Schema
1. Add a new model in `models.py`
2. Add a new serialiser in `serializers.py`
3. Add new urls for methods of that model `api/urls.py
4. Add a new view for the model `views.py`
Use `python manage.py makemigrations` whenever changes are made to the schema. Otherwise changes won't be recorded
If it returns 'no changes detected' then run `python manage.py migrate` to migrate changes.

### Testing
1. Install django-test-without-migrations
2. Install django-nose
3. Run the command `python manage.py test --keepdb` to avoid Django migrate database every time 
