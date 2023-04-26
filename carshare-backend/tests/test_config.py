# Copyright 2015 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import main
import pytest
import unittest
from unittest import mock
import requests
import json


main.app.testing = True
testing_client = main.app.test_client()
pytest.register_assert_rewrite('path.to.helper')

@pytest.fixture
def app():
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

def test_index():
    r = testing_client.get('/')
    assert r.status_code == 200
    assert 'Hello World' in r.data.decode('utf-8')


class MyGreatClass:
    def fetch_json(self,url):
        response = requests.get(url)
        return response.json()
    
    def get_json(self,url,data):
        response = requests.get(url, params=data)
        return response.json()

    def post_json(self,url,data):
        response = requests.post(url, data=data)
        return response.json()

def mocked_requests_get(*args, **kwargs):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code

        def json(self):
            return self.json_data

    if args[0] == '/test.json':
        return MockResponse({"key1": "value1"}, 200)
    elif args[0] == '/anothertest.json':
        return MockResponse({"key2": "value2"}, 200)

    return MockResponse(None, 404)



    
if __name__ == '__main__':
    unittest.main()