function sendPPDispenseUpdate(updOrderId) {

    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const xhr = new XMLHttpRequest();
    const {v4: uuidv4} = require('uuid');
    const xml2js = require('xml2js')

    const url = 'http://10.10.100.56:16384/IncomingWebServiceImpl/IncomingWebService'
    const isoString = new Date().toISOString()
    const msgTime = isoString.slice(0, -1)
    const msgUUID = uuidv4()

    const ppDispenseUpdateMsg = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
	xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
	xmlns:host="http://host.wm6.swisslog.com/">
	<soapenv:Header/>
	<soapenv:Body>
		<host:dispenseUpdate>
			<dispenseUpdateMessageRequest>
				<messageHeader>
					<msgId>${msgUUID}</msgId>
					<msgType>DispenseUpdate</msgType>
					<transCode>PICKED</transCode>
					<msgTime>${msgTime}</msgTime>
					<sender>SEBA</sender>
					<receiver>MedPortal</receiver>
					<version>1.1</version>
				</messageHeader>
				<orderId>${updOrderId}</orderId>
				<pickInfo>
					<pickReservationKey>39486</pickReservationKey>
					<pickLocationId>PCSC-PCSC Pharmacy</pickLocationId>
					<sourceLocationId>DN01</sourceLocationId>
					<printLabel>FALSE</printLabel>
					<genericProductId>SHS1002</genericProductId>
					<hostOrderLu>
						<orderLineNumber>1</orderLineNumber>
						<orderTuId>1</orderTuId>
						<productId>SHS1002</productId>
						<quantity>1.0</quantity>
						<attributeValue>
							<name>expiryDate</name>
							<value>2024-01-05T00:00:00.000</value>
						</attributeValue>
						<attributeValue>
							<name>lotCode</name>
							<value>LOT2</value>
						</attributeValue>
					</hostOrderLu>
				</pickInfo>
			</dispenseUpdateMessageRequest>
		</host:dispenseUpdate>
	</soapenv:Body>
</soapenv:Envelope>
`
    xml2js.parseString(ppDispenseUpdateMsg, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }

        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', ' text/xml;application/soap+xml;charset=UTF-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.responseText);
            }
        };

        xhr.send(ppDispenseUpdateMsg);
        console.log(xhr.responseText);
    })

}
