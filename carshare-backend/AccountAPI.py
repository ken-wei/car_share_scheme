import sys
from flask import Blueprint, jsonify, request

# Imports the Google Cloud client library
from google.cloud import datastore

# Instantiates a client for datastore
client = datastore.Client()

# Kind of the entity
kind = 'Users'

account_api = Blueprint('account_api', __name__)

@account_api.route("/signup", methods=['POST'])
def registerAccount():
    id = request.get_json()['id']
    password = request.get_json()['password']
    name = request.get_json()['name']

    # Setup the key for the entity
    key = client.key('Users', id)
    user = client.get(key)
    if user:
        return jsonify({}), 404
    user = datastore.Entity(key=key)
   

    # Insert all user account data into the Entity
    user['id'] = id
    user['password'] = password
    user['name'] = name
    user['walletAmount'] = 0
    user['admin'] = False
    user['credit'] = 100

    user.update(user)
    
    client.put(user)

    # Insert newly created entity into datastore
    return jsonify({}), 200


@account_api.route('/find-password', methods=['POST'])
def getAllUsers():
    emptyList = []
    userName = request.get_json()['username']
    query = client.query(kind='Users')
    query.add_filter('id', '=', userName)
    data = list(query.fetch())

    if data == emptyList:
        return jsonify({}), 404
    else:
        return jsonify({}), 200

    # return jsonify({}), 200

@account_api.route('/credit', methods=['POST'])
def getCredit():
    id = request.get_json()['username']
    key = client.key('Users', id)
    user = client.get(key)
    return jsonify(user), 200

@account_api.route('/reduce-credit', methods=['POST'])
def reduceCredit():
    id = request.get_json()['username']
    bookingId = request.get_json()['bookingId']
    bookID = int(bookingId)
    bookingKey = client.key('Bookings', bookID)
    book = client.get(bookingKey)
    book['overTime'] = True
    client.put(book)

    key = client.key('Users', id)
    user = client.get(key)
    user['credit'] -= 10
    client.put(user)
    return jsonify(user), 200



@account_api.route('/forgot-password', methods=['POST'])
def forgotPassword():
    userName = request.get_json()['username']
    passWord = request.get_json()['password']
    key = client.key('Users',userName)
    user = client.get(key)
    user['password'] = passWord
    client.put(user)
    return jsonify({}), 200


@account_api.route("/login", methods=['POST'])
def authentication():
    id = request.get_json()['username']
    password = request.get_json()['password']

    # Key
    key = client.key('Users', id)
    user = client.get(key)

    if user:
        if user['password'] == password:
            returnData = {'admin': user['admin']}
            return jsonify(returnData), 200 

    return jsonify({}), 404

# API call for retrieving all the users in the datastore
@account_api.route("/allusers", methods=['GET'])
def getAllExistingUsers():
    query = client.query(kind='Users')
    query.add_filter('admin', '=', False)
    users = list(query.fetch())

    if len(users) > 0:
        return jsonify(users), 200
    return jsonify({}), 404

           
@account_api.route("/seed_admin_accounts")
def seed_admin():
    adminAccounts = []
    # Setup Admin Accounts for the application
    adminAccounts.append({'id': 'admin-user-1@admin.com', 'password': 'c12610239715153402ff7d6d816b426ba10f21ce', 'name': "Admin-1", 'walletAmount': 99999, 'admin': True, 'credit':100})
    adminAccounts.append({'id': 'admin-user-2@admin.com', 'password': 'c12610239715153402ff7d6d816b426ba10f21ce', 'name': "Admin-2", 'walletAmount': 99999, 'admin': True, 'credit':100})

    for admin in adminAccounts:
        key = client.key('Users', admin['id'])
        user = datastore.Entity(key=key)
        
        # Insert all admin user account data into the Entity
        user['id'] = admin['id']
        user['password'] = admin['password']
        user['name'] = admin['name']
        user['walletAmount'] = admin['walletAmount']
        user['admin'] = admin['admin']
        user['credit'] = admin['credit']

        client.put(user)
    
    return jsonify({}), 200

