import main
import pytest
import requests
import unittest
from unittest import mock
from test_config import MyGreatClass
import json
from flask import Blueprint, jsonify, request

users = [
    {'admin': False, 'id': 'jack@email.com', 'name': 'Jack A', 'password': 'password', 'walletAmount': 100}, 
    {'admin': True, 'id': 'admin@test.com', 'name': 'Admin Test User', 'password': 'password', 'walletAmount': 0}
]

def mocked_requests_get(*args, **kwargs):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code

        def json(self):
            return self.json_data
    
    if args[0] == '/balance':
        for x in users:
            if x['id'] == kwargs['params']['id']:
                return MockResponse({'balance': x['walletAmount']},200)
        return MockResponse({'error': 'Invalid Account Information'}, 404)

    return MockResponse(None, 404)

def mocked_requests_post(*args, **kwargs):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code
        
        def json(self):
            return self.json_data

    if args[0] == '/updatebalance':
        for x in users:
            if x['id'] == kwargs['data']['id']:
                x['walletAmount'] += kwargs['data']['topUpAmount']
                return MockResponse({'balance': x['walletAmount']},200)
        return MockResponse({'error': 'Invalid Account Information'}, 404)

class AccountAPITestCase(unittest.TestCase):
    mgc = MyGreatClass()

    # Testing retrieving user balance
    @mock.patch('requests.get', side_effect = mocked_requests_get)
    def test_get_balance_valid_user(self, mock_get):
        r = self.mgc.get_json('/balance', {'id': users[0]['id']})
        self.assertEqual(r['balance'], users[0]['walletAmount'])

    # Testing retrieving invalid user balance
    @mock.patch('requests.get', side_effect = mocked_requests_get)
    def test_get_balance_invalid_user(self, mock_get):
        r = self.mgc.get_json('/balance', {'id': 'invalid'})
        self.assertNotEqual(r,{})
        self.assertEqual(r, {'error': 'Invalid Account Information'})

    # Testing updating user balance
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_update_balance_valid_user(self, mock_get):
        initialBalance = users[0]['walletAmount']
        r = self.mgc.post_json('/updatebalance', {'id': users[0]['id'], 'topUpAmount': 100})
        self.assertEqual(r['balance'], initialBalance+100)

    # Testing updating invalid user balance
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_update_balance_invalid_user(self, mock_get):
        initialBalance = users[0]['walletAmount']
        r = self.mgc.post_json('/updatebalance', {'id': 'random', 'topUpAmount': 100})
        self.assertEqual(r, {'error': 'Invalid Account Information'})