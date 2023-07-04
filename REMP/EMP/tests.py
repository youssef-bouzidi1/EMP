from django.test import TestCase
from django.contrib.auth.hashers import check_password
# Create your tests here.
stored_password = 'pbkdf2_sha256$390000$w9Bksg9pyYZPkFmZLGZY3f$lph3ZI40zivtsv0389hBpf7EYrBHDA8k3kSGGyhjxXo='
user_provided_password = 'password123'

if check_password(user_provided_password, stored_password):
    # Password is correct
    print('Password is correct')
else:
    # Password is incorrect
    print('Password is incorrect')