const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const sendPharmacyOrder = require('./createNewOrders.js')
const sendPPDispenseRequest = require('./createPPDispense.js')
const sendPPDispenseUpdate = require('./pickNewOrders.js')


const requestHandler = (req, res) => {

    const xhr = new XMLHttpRequest()
    const url = req.url


    if (url === '/pharmacyOrder') {

      xhr.onload = function() {
        
        var newOrderId = sendPharmacyOrder()
        console.log(newOrderId)
        sendPPDispenseRequest(newOrderId)
        sendPPDispenseUpdate(newOrderId)
       
      }
          
  }

}

module.exports.handler = requestHandler
