import sys
import time
from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request

from google.cloud import datastore

datastore_client = datastore.Client()
car_booking_api = Blueprint('car_booking_api', __name__)

@car_booking_api.route('/booking',methods=['GET'])
def availableForBook():
    #get data from datastore with query where the column 'available' is True
    query = datastore_client.query(kind='Cars')
    query.add_filter('available', '=', True)
    data = list(query.fetch())
    returnData = []
    for x in data:
        query = datastore_client.query(kind='Parking-Spots')
        query.add_filter('occupier', '=', x['id'])
        parking_details = list(query.fetch())
        if len(parking_details) > 0:
            x['parking-detail'] = parking_details
            returnData.append(x)
    
    return jsonify(returnData),200

@car_booking_api.route('/available-change', methods=['POST'])
def getAvailableChange():
    # get all the available changes
    data = request.get_json()['query']
    rate = data['price']/data['duration']
    query = datastore_client.query(kind='Cars')
    query.add_filter('available', '=', True)
    query.add_filter('rate', '=', rate)

    available_change_cars = list(query.fetch())
    return jsonify(available_change_cars),200


@car_booking_api.route('/booking-receipt',methods = ['POST'])
def getBookingReceipt():
    # get the booking receipt by matching the username
    userId = request.get_json()['userid']
    query = datastore_client.query(kind='Bookings')
    query.add_filter('userId', '=', userId)
    data = list(query.fetch())
    for book in data:
        book['id'] = book.key.id
    return jsonify(data),200


@car_booking_api.route('/bookingId',methods = ['POST'])
def getBookingByBookingId():
    # get the certain booking by the booking id    
    bookingId = request.get_json()['id']
    bookID = int(bookingId)
    bookingKey = datastore_client.key('Bookings', bookID)
    book = datastore_client.get(bookingKey)
    return jsonify(book),200


@car_booking_api.route('/get-receipt',methods = ['POST'])
def getBooking():
    # get the certain booking by matching the username, carid and the booking time wihch acts like a timestamp
    carName = request.get_json()['carId']
    user = request.get_json()['user']
    bookingTime = request.get_json()['bookingTime']
    query = datastore_client.query(kind='Bookings')
    query.add_filter('carId', '=', carName)
    query.add_filter('userId', '=', user)
    query.add_filter('dateTime', '=', bookingTime)
    data = list(query.fetch())
    bookingKey = datastore_client.key('Bookings', data[0].id)
    booking = datastore_client.get(bookingKey)
    booking['id'] = data[0].id
    for booking in data:
        booking["booking-id"] = booking.key.id
    return jsonify(booking),200




@car_booking_api.route('/booking', methods = ['POST'])
def findCarById():
    # get the certain car by matching the car id
    carId = request.get_json()['id']
    query = datastore_client.query(kind='Cars')
    query.add_filter('id', '=', carId)
    data = list(query.fetch())
    return jsonify(data),200

@car_booking_api.route('/cancel-booking', methods=['POST'])
def cancelBooking():
    # get the data from the frontend
    tempbookingDateTime = request.get_json()['bookingDateTime']
    price = request.get_json()['price']
    carId = request.get_json()['carId']
    tempCurrDateTime = request.get_json()['currDateTime']
    username = request.get_json()['username']
    # format the datetime to get the time difference
    FMT = '%Y-%m-%dT%H:%M'
    bookingDateTime = datetime.strptime(request.get_json()['bookingDateTime'], '%Y-%m-%dT%H:%M')
    currDateTime = datetime.strptime(request.get_json()['currDateTime'], '%Y-%m-%dT%H:%M')
    tempTimeDiff = datetime.strptime(request.get_json()['bookingDateTime'], FMT) - datetime.strptime(request.get_json()['currDateTime'], FMT)
    # cast the time to string
    str_delta = str(tempTimeDiff)
    tempTimeDiff = str_delta[0:1]
    # cast the string to int
    timeDiff = int(tempTimeDiff)
    query = datastore_client.query(kind='Bookings')
    query.add_filter('dateTime', '=', tempbookingDateTime)
    query.add_filter('userId', '=', username)
    data = list(query.fetch())

    userKey = datastore_client.key('Users', username)
    user = datastore_client.get(userKey)

    carKey = datastore_client.key('Cars', carId)
    car = datastore_client.get(carKey)
    bookingKey = datastore_client.key('Bookings', data[0].id)
    booking = datastore_client.get(bookingKey)
    # if the time difference more than 1 then won't be charged 
    if timeDiff >1:
        car['available'] = True
        datastore_client.put(car)
        user['walletAmount'] += price
        datastore_client.put(user)
        datastore_client.delete(bookingKey)
    # else charged the user 10% of the fee
    else:
        car['available'] = True
        datastore_client.put(car)
        user['walletAmount'] += 0.9*price
        datastore_client.put(user)
        datastore_client.delete(bookingKey)

    return jsonify({}),200


@car_booking_api.route('/extend-booking', methods = ['POST'])
def extendBooking():  
    # get the data from the frontend to match with the certain booking and the car
    carRate = request.get_json()['carRate']
    extraTime = request.get_json()['extendTime']
    carId = request.get_json()['carId']
    username = request.get_json()['username']
    userKey = datastore_client.key('Users', username)
    user = datastore_client.get(userKey)
    # if the walletAmount is not enough then return the 203 to cancel the extend booking opertaion
    if user['walletAmount'] < carRate:
        return jsonify({'error' : 'Balance is insufficient'}), 203
    
    bookingTime = request.get_json()['bookingDateTime']
    endBookingTime = request.get_json()['endbookingTime']
    # add the extra time for the endbooking date time
    tempExtendTime = datetime.strptime(endBookingTime, '%Y-%m-%dT%H:%M') + timedelta(hours=extraTime)
    extendTime = tempExtendTime.strftime('%Y-%m-%dT%H:%M')
    query = datastore_client.query(kind='Bookings')
    query.add_filter('dateTime', '=', bookingTime)
    query.add_filter('userId', '=', username)
    query.add_filter('carId', '=', carId)
    data = list(query.fetch())
    bookingKey = datastore_client.key('Bookings', data[0].id)
    booking = datastore_client.get(bookingKey)
    booking['endBookingDateTime'] = extendTime
    booking['price'] += carRate
    booking['duration'] += extraTime
    datastore_client.put(booking)
    user['walletAmount'] -= carRate
    datastore_client.put(user)
    return jsonify({}),200


@car_booking_api.route('/create-booking', methods = ['POST'])
def createBooking():
    data = request.get_json()
    userKey = datastore_client.key('Users', data['userId'])
    user = datastore_client.get(userKey)
#   if the user balance is not enough
    if user['walletAmount'] < data['price']:
        return jsonify({'error' : 'Balance is insufficient'}), 203
    
#   if the user balance is enough
    else:
        # this part is for updating the car status to unavailable 
        key = datastore_client.key('Cars', request.get_json()['carId'])
        task = datastore_client.get(key)
        task['available'] = False
        datastore_client.put(task)
        entity = datastore.Entity(key=datastore_client.key('Bookings'))
        # updating user balance
        user['walletAmount'] -= data['price']
        datastore_client.put(user)
        # updating the booking data
        entity.update(data)
        datastore_client.put(entity)
        return jsonify(data),200
    


    return jsonify(data),200

@car_booking_api.route('/get-parking', methods = ['POST'])
def getAvailableParkingSpots():
    #Get All Available Parking Spots Including the Previous Parking Spot
    query = datastore_client.query(kind='Parking-Spots')
    query.add_filter('occupier', '=', '')
    data = list(query.fetch())
    #Get Last Parking Spot Position and set the occupier to empty
    query2 = datastore_client.query(kind='Parking-Spots')
    query2.add_filter('occupier', '=', request.get_json()['carId'])
    lastParkingSpot = list(query2.fetch())
    for x in lastParkingSpot:
        data.append(x)
    print (data)
    return jsonify(data),200

@car_booking_api.route('/return-car', methods = ['POST'])
def returnCar():
    #Get Last Parking Spot Position and set the occupier to empty
    query = datastore_client.query(kind='Parking-Spots')
    query.add_filter('occupier', '=', request.get_json()['carId'])
    lastParkingSpot = list(query.fetch())
    for e in lastParkingSpot:
        e['occupier'] = ''
        datastore_client.put(e)
    # get all the data from the frontend
    nowTime = request.get_json()['nowTime']
    carId = request.get_json()['carId']
    carKey = datastore_client.key('Cars', carId)
    car = datastore_client.get(carKey)
    car['available'] = True
    datastore_client.put(car)
    bookingId = request.get_json()['bookingId']
    bookID = int(bookingId)
    bookingKey = datastore_client.key('Bookings', bookID)
    book = datastore_client.get(bookingKey)
    book['returned'] = True
    book['endBookingDateTime'] = nowTime
    datastore_client.put(book)
    # retutn the car to the certain parking spot
    key = datastore_client.key('Parking-Spots', request.get_json()['id'])
    task = datastore_client.get(key)
    task['occupier'] = request.get_json()['carId']
    datastore_client.put(task)
    
    return jsonify(task),200



@car_booking_api.route('/populate')
def populate():
    #Get the data array from injectSeeds() function
    cars = getCars()
    parking_spots = getParkings()

    data = []

    data.append(cars)
    data.append(parking_spots)

    #Insert each element in the cars array to the Google Datastore for Car Database
    for x in cars:
        entity = datastore.Entity(key=datastore_client.key('Cars',x['id']))
        entity.update(x)
        datastore_client.put(entity)

    #Insert each element in the parking_spots array to the Google Datastore for Car Database
    for x in parking_spots:
        entity = datastore.Entity(key=datastore_client.key('Parking-Spots',x['id']))
        entity.update(x)
        datastore_client.put(entity)

    # Return the dummy data inserted to the datastore
    return jsonify(data),200

def getCars():
    # Dummy Data for the car database
    cars = []
    cars.append({'id': 'C001', 'name': 'Alex', 'model': 'Yaris', 'carType': 'Small','fuelType': 'Petrol', 'available': True, 'rate': 10.00 })
    cars.append({'id': 'C002', 'name': 'John', 'model': 'RAV4', 'carType': 'Medium', 'fuelType': 'Petrol', 'available': True , 'rate': 12.00})
    cars.append({'id': 'C003', 'name': 'Shazam', 'model': 'Yaris','carType': 'Small', 'fuelType': 'Petrol', 'available': True, 'rate': 10.00})
    cars.append({'id': 'C004', 'name': 'Yuri', 'model': 'Sportage', 'carType': 'Medium', 'fuelType': 'Petrol', 'available': False , 'rate': 12.00})
    cars.append({'id': 'C005', 'name': 'Monika', 'model': 'Yaris','carType': 'Small', 'fuelType': 'Petrol', 'available': True, 'rate': 10.00 })
    cars.append({'id': 'C006', 'name': 'Ryan', 'model': 'Hiace', 'carType': 'Large', 'fuelType': 'Diesel', 'available': True , 'rate': 14.00})
    cars.append({'id': 'C007', 'name': 'Ken', 'model': 'Hiace', 'carType': 'Large', 'fuelType': 'Diesel', 'available': True , 'rate': 14.00})
    cars.append({'id': 'C008', 'name': 'Jack', 'model': 'Sportage', 'carType': 'Medium', 'fuelType': 'Petrol', 'available': True , 'rate': 12.00})
    cars.append({'id': 'C009', 'name': 'Vivian', 'model': 'Yaris', 'carType': 'Small','fuelType': 'Petrol', 'available': True , 'rate': 10.00})
    cars.append({'id': 'C010', 'name': 'Gaby', 'model': 'Yaris', 'carType': 'Small','fuelType': 'Petrol', 'available': True , 'rate': 10.00})
    cars.append({'id': 'C011', 'name': 'Roy', 'model': 'Hiace', 'carType': 'Large', 'fuelType': 'Diesel', 'available': False , 'rate': 14.00})

    return cars

def getParkings():
    parking_spots = []
    parking_spots.append({'id': 'P001','lat': -37.804980, 'lng': 144.969353, 'address': 'State Route 46, Carlton VIC 3053','occupier': 'C002'})
    parking_spots.append({'id': 'P002', 'lat': -37.675247, 'lng': 144.850628, 'address': 'Grants Rd, Melbourne Airport VIC 3045', 'occupier': 'C007'})
    parking_spots.append({'id': 'P003', 'lat': -37.809329, 'lng': 144.965179,  'address': '386 William St, West Melbourne VIC 3003 Flagstaff Garden','occupier': 'C001'})
    parking_spots.append({'id': 'P004', 'lat': -37.809369, 'lng': 144.964724, 'address': '179 La Trobe St, Melbourne VIC 3000', 'occupier': 'C003'})
    parking_spots.append({'id': 'P005', 'lat': -37.809468, 'lng': 144.960170, 'address': '107-141 A Beckett St, Melbourne VIC 3000,', 'occupier':'C004' })
    parking_spots.append({'id': 'P006', 'lat': -37.816322, 'lng': 144.959842, 'address': '446-438 Little Collins St, Melbourne VIC 3000', 'occupier': 'C009'})
    parking_spots.append({'id': 'P007', 'lat': -37.818421, 'lng': 144.963660, 'address': '328 Flinders St, Melbourne VIC 3000','occupier': 'C010'})
    parking_spots.append({'id': 'P008', 'lat': -37.817681, 'lng': 144.955046, 'address': '622-582 Little Collins St, Melbourne VIC 3004','occupier': 'C008'})
    parking_spots.append({'id': 'P009', 'lat': -37.819317, 'lng': 144.945766, 'address': 'Bourke St, Docklands VIC 3008','occupier': 'C011'})
    parking_spots.append({'id': 'P010', 'lat': -37.814169, 'lng': 144.963048, 'address': '169-181 Elizabeth St, Melbourne VIC 3004','occupier': 'C005'})
    parking_spots.append({'id': 'P011', 'lat': -37.812618, 'lng': 144.977919, 'address': 'Lansdowne St, East Melbourne VIC 3002','occupier': 'C006'})
    parking_spots.append({'id': 'P012', 'lat': -37.815657, 'lng': 144.969372, 'address': 'Russell St, Melbourne VIC 3000','occupier': ''})
    parking_spots.append({'id': 'P013', 'lat': -37.805037, 'lng': 144.968063, 'address': 'Queensberry St, Carlton VIC 3053','occupier': ''})
    parking_spots.append({'id': 'P014', 'lat': -37.805976, 'lng': 144.948064, 'address': 'Hawke St, West Melbourne VIC 3003','occupier': ''})
    parking_spots.append({'id': 'P015', 'lat': -37.816223, 'lng': 144.945404, 'address': 'Appt 181, Dock 5 55 Harbour Esplanade, Docklands VIC 3008','occupier': ''})

    return parking_spots

###############################################
          # User Report Feature API #
###############################################

# Report Issues By User for Car Booking
@car_booking_api.route('/issue_report', methods = ['POST'])
def createNewIssue():
    # Issue data received from the frontend
    data = request.get_json()
    # Create the entity for the issue
    entity = datastore.Entity(key=datastore_client.key('Issues'))
    entity['solved'] = False
    entity.update(data)
    
    # Store it into datastore
    datastore_client.put(entity)

    return jsonify(data), 200

# Get All Issues Reported
@car_booking_api.route('/issues', methods = ['GET'])
def retrieveAllIssues():
    query = datastore_client.query(kind='Issues')
    issues = list(query.fetch())
    sorted = []
    for issue in issues:
        if issue['solved']:
            sorted.append(issue)
        else:
            sorted.insert(0,issue)
        issue['id'] = issue.key.id
    return jsonify(sorted),200

# Get all issues by the user
@car_booking_api.route('/user-issues', methods = ['GET'])
def getUserIssues():
    # Post param of the username
    username = request.args.get('username')

    # query for the user's issues and fetch it
    query = datastore_client.query(kind='Issues')
    query.add_filter('username', '=', username)
    issues = list(query.fetch())

    # Update the issue id inside the returned json
    for issue in issues:
        issue['id'] = issue.key.id
    return jsonify(issues),200

# Get all issues by the user
@car_booking_api.route('/find-issue', methods = ['POST'])
def getUserSpecificIssue():
    id = request.get_json()
    # query for the user's issues and fetch it
    issues = datastore_client.key('Issues', id['id'])
    data = datastore_client.get(issues)

    return jsonify(data),200

# Give refund to user
@car_booking_api.route('/refund', methods = ['POST'])
def refund():
    # test = request.get_json()
    carId = request.get_json()['carId']
    issueId = request.get_json()['issueId']
    query = datastore_client.query(kind='Bookings')
    query.add_filter('carId', '=', carId)
    data = list(query.fetch())
    username = ''
    price = 0
    bookingId = 0
    
    for booking in data:
        username = booking['userId']
        price = booking['price']
        bookingId = booking.key.id

    key = datastore_client.key('Users', username)
    user = datastore_client.get(key)
    if user:
        user['walletAmount'] += int(price)
        datastore_client.put(user)

    key = datastore_client.key('Issues', issueId)
    issue = datastore_client.get(key)
    if issue:
        issue['solved'] = True
        issue['comment'] = "Refunded AU {} to {}".format(price,username)
        datastore_client.put(issue)
    
    #Delete the booking
    key = datastore_client.key('Bookings', bookingId)
    booking = datastore_client.get(key)
    datastore_client.delete(key)

    #Update Availibility
    key = datastore_client.key('Cars', carId)
    car = datastore_client.get(key)
    car['available'] = True
    datastore_client.put(car)

    return jsonify(data),200

@car_booking_api.route('/currentBooking', methods = ['POST'])
def getCurrentBooking():
    userId = request.get_json()['userid']
    query = datastore_client.query(kind='Bookings')
    query.add_filter('userId', '=', userId)
    query.add_filter('returned', '=', False)
    data = list(query.fetch())
    for book in data:
        book['id'] = book.key.id
    return jsonify(data),200


#Change Car to User
@car_booking_api.route('/change-car', methods = ['POST'])
def changeCar():
    prevCarId = request.get_json()['prevCarId']
    changeToCarId = request.get_json()['changeToCarId']
    issueId = request.get_json()['issueId']
    key = datastore_client.key('Issues', issueId)
    issue = datastore_client.get(key)
    query = datastore_client.query(kind='Bookings')
    bookingKey = datastore_client.key('Bookings', int(issue['bookingId']))
    booking = datastore_client.get(bookingKey)

    booking['carId'] = changeToCarId
    datastore_client.put(booking)
    #Update the availability for the previous one to True and the change into one to false
    key = datastore_client.key('Cars', prevCarId)
    prevCar = datastore_client.get(key)
    prevCar['available'] = True
    datastore_client.put(prevCar)

    key = datastore_client.key('Cars', changeToCarId)
    changeToCar = datastore_client.get(key)
    changeToCar['available'] = False
    datastore_client.put(changeToCar)

    #Update the issue 'solved' into true and give comment
    
    issue['solved'] = True
    issue['comment'] = "Changed Booking car from {} to {}".format(prevCarId, changeToCarId)
    datastore_client.put(issue)

    return jsonify(prevCarId),200