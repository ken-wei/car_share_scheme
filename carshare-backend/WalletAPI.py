import sys
from flask import Blueprint, jsonify, request

# Imports the Google Cloud client library
from google.cloud import datastore

# Instantiates a client for datastore
client = datastore.Client()

# Kind of the entity
kind = 'Users'

wallet_api = Blueprint('wallet_api', __name__)

balance = 0

@wallet_api.route('/balance', methods = ['GET'])
def retrieveBalance():
    # Get user id from the url param
    username = request.args.get('id')
    # Key
    key = client.key('Users', username)
    user = client.get(key)
    if user:
        return jsonify({'balance': user['walletAmount']}), 200 

    return jsonify({'balance': 0}), 404

@wallet_api.route('/updatebalance', methods = ['POST'])
def updateBalance():
    requestData = request.json
    topup = requestData['params']['amount']

    # Get user id from the url param
    username = requestData['params']['id']

    # Key
    key = client.key('Users', username)
    user = client.get(key)

    if user:
        user['walletAmount'] += int(topup)
        client.put(user)
        return jsonify({'balance': user['walletAmount']}), 200 
    return jsonify({'balance': 0}), 404
