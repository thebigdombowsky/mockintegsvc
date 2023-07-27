const { v4: uuidv4 } = require('uuid');
const xml2js = require('xml2js');
const json2csv = require('json2csv').parse;
const fs = require('fs');

const isoString = new Date().toISOString()
const msgTime = isoString.slice(0, -1)
const msgUUID = uuidv4()

const soapMessage = `<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:host="http://host.wm6.swisslog.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <host:pharmacyOrder>
         <pharmacyOrderMessageRequest>
            <messageHeader>
               <msgId>MOCK-${msgUUID}</msgId>
               <msgType>PharmacyOrder</msgType>
               <transCode>NEW</transCode>
              <msgTime>${msgTime}</msgTime>
               <sender>HIS</sender>
               <receiver>MedPortal</receiver>
               <version>1</version>
            </messageHeader>
            <warehouseId>PCSC-PCSC Pharmacy</warehouseId>
            <patient>
               <patientId>1</patientId>
               <firstName>1</firstName>
               <lastName>1</lastName>
               <pointOfCare>1</pointOfCare>
               <room>1</room>
               <bed>1</bed>
               <destination>1</destination>
            </patient>
            <order>
               <orderId>MOCK-${msgUUID}</orderId>
               <orderType>MANUAL</orderType>
               <orderGroupSequence>1</orderGroupSequence>
               <dispatchDate>${msgTime}</dispatchDate>
               <priority>10</priority>
               <customer>2</customer>
               <owner>HL7owner</owner>
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
xml2js.parseString(soapMessage, (err, result) => {
    if (err) {
        console.error(err);
        return;
    }

    const orderId = result['soapenv:Envelope']['soapenv:Body'][0]['host:pharmacyOrder'][0]['pharmacyOrderMessageRequest'][0]['order'][0]['orderId'][0];
    const msgTime = result['soapenv:Envelope']['soapenv:Body'][0]['host:pharmacyOrder'][0]['pharmacyOrderMessageRequest'][0]['messageHeader'][0]['msgTime'][0];
    const orderType = result['soapenv:Envelope']['soapenv:Body'][0]['host:pharmacyOrder'][0]['pharmacyOrderMessageRequest'][0]['order'][0]['orderType'][0];
    const productId = result['soapenv:Envelope']['soapenv:Body'][0]['host:pharmacyOrder'][0]['pharmacyOrderMessageRequest'][0]['order'][0]['medPortalOrderLine'][0]['productId'][0];
    const quantityOrdered = result['soapenv:Envelope']['soapenv:Body'][0]['host:pharmacyOrder'][0]['pharmacyOrderMessageRequest'][0]['order'][0]['medPortalOrderLine'][0]['quantityOrdered'][0];

    const fields = ['orderId', 'msgTime', 'orderType', 'productId', 'quantityOrdered']
    const csv = json2csv({ orderId, msgTime, orderType, productId, quantityOrdered }, { fields });

    fs.writeFile('output.csv', csv, (err) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log('CSV file written successfully!')
    })
})