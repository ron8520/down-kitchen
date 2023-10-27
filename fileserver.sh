# https://pypi.org/project/uploadserver/
# python3 -m pip install uploadserver
cd upload
python3 -m uploadserver 8890

# usage:
# save:POST  http://localhost:8000/upload files=files
# get:GET http://localhost:8000/:filename