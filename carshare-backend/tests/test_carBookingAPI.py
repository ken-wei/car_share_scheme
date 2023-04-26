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

cars = [
    {'id': 'C001', 'available': False, 'carType': 'Small', 'fuelType': 'Petrol', 'model': 'Yaris', 'name': 'Alex', 'rate' : 10},
    {'id': 'C002', 'available': False, 'carType': 'Small', 'fuelType': 'Petrol', 'model': 'Yaris', 'name': 'Shazam', 'rate' : 10},
    {'id': 'C003', 'available': True, 'carType': 'Medium', 'fuelType': 'Petrol', 'model': 'RAV4', 'name': 'John', 'rate' : 12},
    {'id': 'C004', 'available': True, 'carType': 'Medium', 'fuelType': 'Petrol', 'model': 'Sportage', 'name': 'Vinay', 'rate' : 12},
    {'id': 'C005', 'available': True, 'carType': 'Large', 'fuelType': 'Diesel', 'model': 'Hi-Ace', 'name': 'Bob', 'rate' : 14}
]

bookings = [
    {'id': 1415123, 'carId': 'C001', 'dateTime': '2020-10-20T08:00', 'duration': 1, 'endBookingDateTime': '2020-10-20T09:00', 'price': 10, 'overtime': False, 'returned': False, 'userId': 'jack@email.com'},
    {'id': 1231291, 'carId': 'C002', 'dateTime': '2020-10-20T12:00', 'duration': 2, 'endBookingDateTime': '2020-10-20T14:00', 'price': 20, 'overtime': False, 'returned': False, 'userId': 'jack@email.com'},
    {'id': 4123123, 'carId': 'C003', 'dateTime': '2020-10-20T12:00', 'duration': 2, 'endBookingDateTime': '2020-10-20T14:00', 'price': 20, 'overtime': False, 'returned': False, 'userId': 'jack@email.com'}
]

parking_spots = [
    {'id': 'P001', 'address' : 'State Route 46, Carlton VIC 3053', 'occupier' : 'C001'},
    {'id': 'P002', 'address' : 'Grants Rd, Melbourne Airport VIC 3045', 'occupier' : 'C002'},
    {'id': 'P003', 'address' : '386 William St, West Melbourne VIC 3003 Flagstaff Garden', 'occupier' : 'C003'},
    {'id': 'P004', 'address' : '179 La Trobe St, Melbourne VIC 3000', 'occupier' : 'C004'},
    {'id': 'P005', 'address' : '446-438 Little Collins St, Melbourne VIC 3000', 'occupier' : 'C005'},
    {'id': 'P006', 'address' : '328 Flinders St, Melbourne VIC 3000', 'occupier' : ''},
    {'id': 'P007', 'address' : '622-582 Little Collins St, Melbourne VIC 3004', 'occupier' : ''},
]

issues = [
    {'id' : 1021319, 'bookingId' : 1415123, 'carId' : 'C001','category': 'Damaged', 'Title': 'Car dent', 'Description': 'My Car is Dent', 'Comment': '', 'userId': 'jack@email.com', 'solved': False},
    {'id' : 1251521, 'bookingId' : 4123123, 'carId' : 'C003','category': 'Missing', 'Title': 'Car missing', 'Description': 'My Car is Missing', 'Comment': '', 'userId': 'jack@email.com', 'solved': False}
]

testing_client = main.app.test_client()

def mocked_requests_get(*args, **kwargs):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code

        def json(self):
            return self.json_data

    if args[0] == '/booking':
        return MockResponse(json.dumps(cars), 200)

    elif args[0] == '/issues':
        return MockResponse({'issues': issues}, 200)

    return MockResponse(None, 404)    

def mocked_requests_post(*args, **kwargs):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code
        
        def json(self):
            return self.json_data
        
    if args[0] == '/available-change':
        results = []
        for car in cars:
            if car['rate'] == kwargs['data']['price']/kwargs['data']['duration'] and car['available']:
                results.append(car)
        return MockResponse({'cars': results},200)

    elif args[0] == '/booking-receipt':
        results = []
        for booking in bookings:
            if booking['userId'] == kwargs['data']['userId']:
                results.append(booking)
        return MockResponse({'bookings': results}, 200)

    elif args[0] == '/get-receipt':
        results = []
        for booking in bookings:
            if booking['carId'] == kwargs['data']['carId']:
                results.append(booking)
        return MockResponse({'bookings' : results}, 200)

    elif args[0] == '/booking':
        for car in cars:
            if car['id'] == kwargs['data']['carId']:
                return MockResponse({'car': car}, 200)
        return MockResponse({'error': 'Car with the carId is not found'}, 404)

    elif args[0] == '/create-booking':
        for user in users:
            if user['id'] == kwargs['data']['userId']:
                if user['walletAmount'] >= kwargs['data']['price']:
                    for car in cars:
                        if car['id'] == kwargs['data']['carId']:
                            user['walletAmount'] -= kwargs['data']['price']
                            bookings.append({'id': 2913819, 'carId': car['id'], 'dateTime': '2020-10-20T12:00', 'duration': 1, 'endBookingDateTime': '2020-10-20T13:00', 'price': kwargs['data']['price'], 'overtime': False, 'returned': False, 'userId': kwargs['data']['userId']})
                            car['available'] = False
                            return MockResponse({'data':kwargs}, 200)
                else:
                    return MockResponse({'error': 'Balance is insufficient'}, 404)
        return MockResponse({'error': 'Bad Request'}, 404)

    elif args[0] == '/get-parking':
        results = []
        found = False
        for parking in parking_spots:
            if parking['occupier'] == kwargs['data']['carId']:
                parking['occupier'] = ''
                found = True
                results.append(parking)
            elif(parking['occupier'] == ''):
                results.append(parking)
        
        if not found:
            return MockResponse({'error': 'Invalid Car Id'}, 404)
        return MockResponse({'parking_spots': results}, 200)
    
    elif args[0] == '/return-car':
        for parking in parking_spots:
            if parking['id'] == kwargs['data']['parkingId']:
                parking['occupier'] = kwargs['data']['carId']
                return MockResponse({'parking': parking},200)
        return MockResponse({'error': 'Invalid request data'},404)
    
    elif args[0] == '/extend-booking':
        
        for car in cars:
            if car['id'] == kwargs['data']['carId']:
                for user in users:
                    if user['id'] == kwargs['data']['userId']:
                        user['walletAmount']-= car['rate']*kwargs['data']['duration']

        
        for booking in bookings:
            if booking['id'] == kwargs['data']['bookingId']:
                booking['endBookingDateTime'] = '2020-10-20T10:00'
        
        return MockResponse({},200)
    
    elif args[0] == '/cancel-booking':
        charge = 0
        for booking in bookings:
            if booking['id'] == kwargs['data']['bookingId']:
                for user in users:
                    if user['id'] == booking['userId']:
                        charge = booking['price']/10
                        user['walletAmount']-= charge
                
                for car in cars:
                    if car['id'] == booking['carId']:
                        car['available'] = True
        if charge == 0:
            return MockResponse({'error': 'Invalid Booking Id'}, 404)
        return MockResponse({'charge': charge}, 200)

    elif args[0] == '/issue_report':
        issue = kwargs['data']['issue']
        issue['comment'] = ''
        issue['solved'] = False
        issues.append(issue)
        return MockResponse({},200)

    elif args[0] == '/user_issues':
        results = []
        for issue in issues:
            if issue['userId'] == kwargs['data']['userId']:
                results.append(issue)
        
        if(len(results) == 0):
            return MockResponse({'message': 'No Issue Found for This User'}, 200)
        else:
            return MockResponse({'issues': results}, 200)

    elif args[0]=='/find-issue':
        for issue in issues:
            if issue['id'] == kwargs['data']['issueId']:
                return MockResponse({'issue': issue}, 200)
        
        return MockResponse({'error': 'Issue Not Found'}, 404)

    elif args[0] == '/refund':
        for issue in issues:
            if issue['id'] == kwargs['data']['issueId']:
                for booking in bookings:
                    if booking['id'] == issue['bookingId']:
                        for user in users:
                            if user['id'] == issue['userId']:
                                user['walletAmount'] += booking['price']
                                issue['solved'] = True
                                issue['comment'] = 'Refunded'
                                return MockResponse({'refundAmount': booking['price']},200)
        return MockResponse({'error': 'Issue Not Found'}, 404)
    
    elif args[0] == '/change-car':
        for issue in issues:
            if issue['id'] == kwargs['data']['issueId']:
                for booking in bookings:
                    if booking['id'] == issue['bookingId']:
                        booking['carId'] = kwargs['data']['newCarId']
                        for car in cars:
                            if car['id'] == kwargs['data']['oldCarId']:
                                car['available'] = True
                            elif car['id'] == kwargs['data']['newCarId']:
                                car['available'] = False
                        issue['solved'] = True
                        issue['comment'] = 'Car Changed'
                        return MockResponse({}, 200)
        return MockResponse({'error': 'Issue Not Found'}, 404)




class CarBookingAPITestCase(unittest.TestCase):
    mgc = MyGreatClass()
# ##############################################
# ########### USER SIDE OF TESTING #############
# ##############################################
    
    # Testing retriving available cars for book
    @mock.patch('requests.get', side_effect = mocked_requests_get)
    def test_get_available_cars(self, mock_get):
        r = self.mgc.fetch_json('/booking')
        self.assertNotEqual(r,{})

    # Testing retrieving available cars for change 
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_available_change_cars(self, mock_post):
        rate = 10
        duration = 2
        price = duration * rate
        r = self.mgc.post_json('/available-change', {'price': price , 'duration': duration})
        for data in r['cars']:
            self.assertEqual(data['available'], True)
            self.assertEqual(data['rate'], rate)
    
    # Testing retrieving user's booking
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_booking_receipt(self, mock_post):
        username = users[0]['id']
        r = self.mgc.post_json('/booking-receipt', {'userId':username})
        for data in r['bookings']:
            self.assertEqual(data['userId'], username)

    # Testing get receipt to get a certain car booking
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_get_receipt(self, mock_post):
        carId = bookings[0]['carId']
        r = self.mgc.post_json('/get-receipt', {'carId': carId})
        for data in r['bookings']:
            self.assertEqual(data['carId'], carId)
    
    # Testing get car by id
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_find_car_by_id(self, mock_post):
        carId = bookings[0]['carId']
        r = self.mgc.post_json('/booking', {'carId': carId})
        self.assertEqual(r['car']['id'], carId)

    # Testing get car by invalid id
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_find_car_by_invalid_id(self, mock_post):
        carId = 'Random001'
        r = self.mgc.post_json('/booking', {'carId' : carId})
        self.assertEqual(r['error'], 'Car with the carId is not found')

    # Testing create booking
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_create_booking(self, mock_post):
        userId = users[0]['id']
        initialWalletAmount = users[0]['walletAmount']
        carId = ''
        price = 0
        duration = 1
        carIndex = 0
        for car in cars:
            if car['available']:
                carId = car['id']
                break

        r = self.mgc.post_json('/create-booking', {'userId': userId, 'carId': carId, 'price': price})

        self.assertNotEqual(r, None)
        self.assertEqual(users[0]['walletAmount'], initialWalletAmount - price)
        self.assertEqual(bookings[len(bookings)-1]['carId'], carId)
        for car in cars:
            if car['id'] == carId:
                self.assertEqual(car['available'], False)

    # Testing create booking with insufficient user balance
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_create_booking_insufficient_balance(self, mock_post):
        userId = users[0]['id']
        initialWalletAmount = users[0]['walletAmount']
        carId = ''
        price = users[0]['walletAmount']+1
        for car in cars:
            if car['available']:
                carId = car['id']
        
        r = self.mgc.post_json('/create-booking', {'userId': userId, 'carId': carId, 'price': price})

        self.assertEqual(r['error'], 'Balance is insufficient')
        self.assertEqual(users[0]['walletAmount'], initialWalletAmount)
        for car in cars:
            if car['id'] == carId:
                self.assertEqual(car['available'], True)

    # Testing create booking with invalid requests
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_create_booking_bad_request(self, mock_post):
        userId = ['random123']
        
        r = self.mgc.post_json('/create-booking', {'userId': userId, 'carId': 'random123', 'price': 0})

        self.assertEqual(r['error'], 'Bad Request')

    # Testing get parking
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_return_car(self, mock_post):
        carId = bookings[0]['carId']

        r = self.mgc.post_json('/get-parking', {'carId' : carId})

        self.assertNotEqual(r['parking_spots'], None)

    # Testing get parking with invalid carId
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_return_car_invalid_car_id(self, mock_post):
        carId = 'Random'

        r = self.mgc.post_json('/get-parking', {'carId' : carId})

        print(r)
        self.assertEqual(r['error'], 'Invalid Car Id')

    # Testing return car
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_return_car(self, mock_post):
        carFound = False
        currentParkingId = ''
        carId = ''
        changeToParkingId = ''
        for parking in parking_spots:
            if parking['occupier'] != '' and not carFound:
                carId = parking['occupier']
                currentParkingId = parking['id']
                carFound = True
            if parking['occupier'] == '':
                changeToParkingId = parking['id']
                break
        
        r = self.mgc.post_json('/get-parking', {'carId' : carId})
        r = self.mgc.post_json('/return-car', {'carId': carId, 'parkingId': changeToParkingId})

        for parking in parking_spots:
            if parking['id'] == currentParkingId:
                self.assertEqual(parking['occupier'], '')
            elif parking['id'] == changeToParkingId:
                self.assertEqual(parking['occupier'], carId)

        self.assertEqual(r['parking']['id'], changeToParkingId)
        self.assertEqual(r['parking']['occupier'], carId)

    # Testing invalid return car   
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_invalid_return_car(self, mock_post):
        r = self.mgc.post_json('/return-car', {'carId': 'Random', 'parkingId': 'Random'})

        self.assertEqual(r['error'], 'Invalid request data')
    
    # Testing extend booking
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_extend_booking(self, mock_post):
        userId = users[0]['id']
        initialWalletAmount = users[0]['walletAmount']
        initialEndBookingDateTime = bookings[0]['endBookingDateTime']
        bookingId = bookings[0]['id']
        carId = bookings[0]['carId']
        duration = 1

        r = self.mgc.post_json('/extend-booking', {'userId':userId, 'bookingId': bookingId, 'carId': carId, 'duration':duration})

        self.assertEqual(users[0]['walletAmount'], initialWalletAmount - 10)
        self.assertNotEqual(initialEndBookingDateTime, bookings[0]['endBookingDateTime'])

    # Testing cancel booking
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_cancel_booking(self, mock_post):
        bookingId = bookings[0]['id']
        initialWalletAmount = users[0]['walletAmount']

        r = self.mgc.post_json('/cancel-booking', {'bookingId': bookingId})

        self.assertEqual(users[0]['walletAmount'], initialWalletAmount - r['charge'])
        self.assertEqual(cars[0]['available'], True)
    
    # Testing invalid cancel booking
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_invalid_cancel_booking(self, mock_post):
        bookingId = 12412414

        r = self.mgc.post_json('/cancel-booking', {'bookingId': bookingId})

        self.assertNotEqual(r['error'], None)

    # Testing report an issue
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_report_issue(self, mock_post):
        initialNumberOfIssue = len(issues)
        r = self.mgc.post_json('/issue_report', {'issue':{'id' : 1231123, 'bookingId' : 1231291, 'carId' : 'C002','category': 'Missing', 'Title': 'Car Missing', 'Description': 'My Car is Missing', 'userId': 'jack@email.com'}})
        self.assertEqual(len(issues), initialNumberOfIssue+1)
        self.assertEqual(r, {})

    # Testing retrieving user issue
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_retrieve_user_issue(self, mock_post):
        r = self.mgc.post_json('/user_issues', {'userId': users[0]['id']})

        self.assertNotEqual(len(r['issues']), 0)
    
    # Testing retrieving user with no issue
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_retrieve_user_with_no_issue(self, mock_post):
        r = self.mgc.post_json('/user_issues', {'userId': 'noIssue'})

        self.assertNotEqual(r['message'],'')

# ##############################################
# ########### ADMIN SIDE OF TESTING ############
# ##############################################

    # Testing retrieving all issues from users
    @mock.patch('requests.get', side_effect = mocked_requests_get)
    def test_get_user_issues(self, mock_get):
        r = self.mgc.fetch_json('/issues')

        self.assertNotEqual(r['issues'], {})

    # Testing getting specific issue from issue id
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_retrieve_issue_by_id(self, mock_post):
        r = self.mgc.post_json('/find-issue', {'issueId': 1021319})

        self.assertEqual(r['issue']['id'], 1021319)

    
    # Testing getting specific issue from invalid issue id
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_retrieve_issue_by_invalid_id(self, mock_post):
        r = self.mgc.post_json('/find-issue', {'issueId': 123})

        self.assertEqual(r['error'],'Issue Not Found')

    # Testing refund to user to solve issue
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_refund(self, mock_post):
        initialWalletAmount = users[0]['walletAmount']
        r = self.mgc.post_json('/refund', {'issueId': 1021319})
        print(r)
        self.assertEqual(issues[0]['solved'], True)
        self.assertEqual(issues[0]['comment'], 'Refunded')
        self.assertEqual(users[0]['walletAmount']-r['refundAmount'], initialWalletAmount)


    # Testing change car to solve issue
    @mock.patch('requests.post', side_effect = mocked_requests_post)
    def test_change_car(self, mock_post):

        r = self.mgc.post_json('/change-car', {'issueId': 1251521, 'oldCarId': 'C003', 'newCarId': 'C004'})

        self.assertEqual(r,{})
        self.assertEqual(cars[2]['available'], True)
        self.assertEqual(cars[3]['available'], False)

        for booking in bookings:
            if booking['id'] == 4123123:
                self.assertEqual(booking['carId'], 'C004')

        for issue in issues:
            if issue['id'] == 1251521:
                self.assertEqual(issue['solved'], True)