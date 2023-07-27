function sendPharmacyOrder() {

    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const xhr = new XMLHttpRequest();
    const {v4: uuidv4} = require('uuid');
    const fs = require('fs');
    const xml2js = require('xml2js')
    const json2csv = require('json2csv').parse;

    const url = 'http://10.10.100.56:16384/IncomingWebServiceImpl/IncomingWebService'

    const isoString = new Date().toISOString()
    const msgTime = isoString.slice(0, -1)
    const msgUUID = uuidv4()

    const pharmacyOrderMsg = `<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:host="http://host.wm6.swisslog.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <host:pharmacyOrder>
         <pharmacyOrderMessageRequest>
            <messageHeader>
               <msgId>${msgUUID}</msgId>
               <msgType>PharmacyOrder</msgType>
               <transCode>NEW</transCode>
              <msgTime>${msgTime}</msgTime>
               <sender>HIS</sender>
               <receiver>MedPortal</receiver>
               <version>1</version>
            </messageHeader>
            <warehouseId>PCSC-PCSC Pharmacy</warehouseId>
            <patient>
               <patientId>${msgTime}</patientId>
               <firstName>system</firstName>
               <lastName>N/A</lastName>
               <pointOfCare>Destination Location</pointOfCare>
               <room>N/A</room>
               <bed>N/A</bed>
               <destination>Mock Location</destination>
            </patient>
            <order>
               <orderId>${msgUUID}</orderId>
               <orderType>MANUAL</orderType>
               <orderGroupSequence>1</orderGroupSequence>
               <dispatchDate>${msgTime}</dispatchDate>
               <priority>99</priority>
               <customer>Mock Customer</customer>
               <owner>Mock Owner</owner>
               <medPortalOrderLine>
                  <orderLineNumber>1</orderLineNumber>
                  <productId>SHS1002</productId>
                  <quantityOrdered>1</quantityOrdered>
                  <administrationDate>${msgTime}</administrationDate>
               </medPortalOrderLine>
            </order>
         </pharmacyOrderMessageRequest>
      </host:pharmacyOrder>
   </soapenv:Body>
</soapenv:Envelope>
`
    xml2js.parseString(pharmacyOrderMsg, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }

        const orderId = result['soapenv:Envelope']['soapenv:Body'][0]['host:pharmacyOrder'][0]['pharmacyOrderMessageRequest'][0]['order'][0]['orderId'][0];
        const msgTime = result['soapenv:Envelope']['soapenv:Body'][0]['host:pharmacyOrder'][0]['pharmacyOrderMessageRequest'][0]['messageHeader'][0]['msgTime'][0];
        const productId = result['soapenv:Envelope']['soapenv:Body'][0]['host:pharmacyOrder'][0]['pharmacyOrderMessageRequest'][0]['order'][0]['medPortalOrderLine'][0]['productId'][0];
        const quantityOrdered = result['soapenv:Envelope']['soapenv:Body'][0]['host:pharmacyOrder'][0]['pharmacyOrderMessageRequest'][0]['order'][0]['medPortalOrderLine'][0]['quantityOrdered'][0];

        const fields = ['orderId', 'msgTime', 'productId', 'quantityOrdered']
        const csv = json2csv({orderId, msgTime, productId, quantityOrdered}, {fields, header: false, newLine: '\r\n'});

        fs.appendFileSync('output.csv', csv, (err) => {
            if (err) {
                console.error(err);

            }
        })

        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', ' text/xml;application/soap+xml;charset=UTF-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.responseText);
            }
        };
        xhr.send(pharmacyOrderMsg);

    })
    return orderId
}

module.exports = sendPharmacyOrder




