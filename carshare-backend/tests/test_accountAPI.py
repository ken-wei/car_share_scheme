import main
import pytest
import requests
import unittest
from unittest import mock
from test_config import MyGreatClass
import json
from flask import Blueprint, jsonify, request

users = [
    {'admin': False, 'id': 'jack@email.com', 'name': 'Jack A', 'password': 'password', 'walletAmount': 0}, 
    {'admin': True, 'id': 'admin@test.com', 'name': 'Admin Test User', 'password': 'password', 'walletAmount': 0}
]

def mocked_requests_get(*args, **kwargs):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code

        def json(self):
            return self.json_data
    
    if args[0] == '/allusers':
        return MockResponse(json.dumps(users), 200)
    elif args[0] == '/anothertest.json':
        return MockResponse({"key2": "value2"}, 200)

    return MockResponse(None, 404)

def mocked_requests_post(*args, **kwargs):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code
        
        def json(self):
            return self.json_data

    if args[0] == '/register':
        users.append(kwargs)
        return MockResponse(json.dumps(kwargs),200)
    elif args[0] == '/login':
        for x in users:
            if x['id'] == kwargs['data']['id']:
                if x['admin']:
                    return MockResponse({'admin': x['admin']},200)
                return MockResponse({},200)

        else :
            return MockResponse({'error':'Invalid Login Information'},404)
    elif args[0] == '/forgot-password':
        for x in users:
            if x['id'] == kwargs['data']['id']:
                x['password'] = kwargs['data']['password']
                return MockResponse({},200)
        return MockResponse({'error':'Invalid Account Information'},404)

class AccountAPITestCase(unittest.TestCase):
    mgc = MyGreatClass()

    # Testing getting all users function to return users list
    @mock.patch('requests.get', side_effect = mocked_requests_get)
    def test_get_all_users(self, mock_get):
        r = self.mgc.fetch_json('/allusers')
        self.assertNotEqual(r, {})
        self.assertEqual(r, json.dumps(users))
        self.assertEqual(len(json.loads(r)), 2)

    # Testing registering a new user into the data
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_register_user(self, mock_post):
        initialUserLength = len(users)
        r = self.mgc.post_json('/register', {'username':'newuser@test.com', 'password': 'test', 'name': 'Hello'})
        response_data = json.loads(r)['data']
        self.assertEqual(response_data,{'username':'newuser@test.com', 'password': 'test', 'name': 'Hello'})
        self.assertEqual(initialUserLength+1 , len(users))

    # Testing logging in a user
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_login_user(self, mock_post):
        user = users[0]
        r = self.mgc.post_json('/login', (user))
        self.assertEqual(r, {})
    
    # Testing logging in an invalid user
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_login_invalid_user(self, mock_post):
        invalid_user = {'admin': False, 'id': 'random@random.com', 'name': 'Random A', 'password': 'password', 'walletAmount': 0}
        r = self.mgc.post_json('/login', (invalid_user))
        self.assertNotEqual(r, {})
        self.assertEqual(r, {'error': 'Invalid Login Information'})
    
    # Testing logging in an admin user
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_login_admin_user(self, mock_post):
        admin_user = users[1]
        r = self.mgc.post_json('/login', (admin_user))
        self.assertNotEqual(r, {})
        self.assertEqual(r, {'admin': True})

    # Testing changing password of an user
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_forgot_password(self, mock_post):
        username = users[0]['id']
        newPassword = 'newpassword'
        r = self.mgc.post_json('/forgot-password', {'id' : username, 'password' : newPassword})
        
        self.assertEqual(r, {})
        self.assertEqual(users[0]['password'], newPassword)
    
    # Testing changing password of an invalid user
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_forgot_password_invalid_user(self, mock_post):
        username = 'random@random.com'
        newPassword = 'newpassword'
        r = self.mgc.post_json('/forgot-password', {'id' : username, 'password' : newPassword})
        self.assertEqual(r, {'error': 'Invalid Account Information'})


    