function sendPPDispenseRequest(reqOrderId) {
    
    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const xhr = new XMLHttpRequest();
    const {v4: uuidv4} = require('uuid');
    const xml2js = require('xml2js')

    const url = 'http://10.10.100.56:16384/IncomingWebServiceImpl/IncomingWebService'

    const isoString = new Date().toISOString()
    const msgTime = isoString.slice(0, -1)
    const msgUUID = uuidv4()
    //const pickReservationKey = Math.floor(Math.random() * (99999 - 99 + 1) + 99)

    const ppDispenseRequest = `<?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:pps="http://swisslog.com/ppsys"
        xmlns:typ="http://swisslog.com/ppsys/types">
        <soapenv:Header/>
        <soapenv:Body>
            <dispenseRequest>
                <request>
                    <MessageHeader>
                        <MsgId>${msgUUID}</MsgId>
                        <MsgTime>${msgTime}</MsgTime>
                        <MsgType>DispenseRequest</MsgType>
                        <Receiver>PPSystem</Receiver>
                        <Sender>MedPortal</Sender>
                        <TransCode>NEW</TransCode>
                        <Version>1.0</Version>
                    </MessageHeader>
                    <PatientInfo>
                        <ExtraInfos/>
                        <pointOfCare>ICU</pointOfCare>
                        <Bed>N/A</Bed>
                        <ContactId>N/A</ContactId>
                        <ManualDestination/>
                        <PatientId>${msgUUID}</PatientId>
                        <PatientName>N/A</PatientName>
                        <PatientBirthDay/>
                        <PatientFirstName>N/A</PatientFirstName>
                        <PatientMiddleName></PatientMiddleName>
                        <PatientLastName>N/A</PatientLastName>
                        <Room>N/A</Room>
                        <PatientSex>U</PatientSex>
                    </PatientInfo>
                    <DispenseInfos>
                        <DispenseInfo>
                            <AdministrationDate>${msgTime}</AdministrationDate>
                                <AutomationMachineId>DN01</AutomationMachineId>
                                <GenericProductId>SHS1002</GenericProductId>
                                <OrderLineNumber>1</OrderLineNumber>
                                <Quantity>1.0</Quantity>
                                <QuantityOrdered>1.0</QuantityOrdered>
                                <ReservationKey>39486</ReservationKey>
                            </DispenseInfo>
                        </DispenseInfos>
                        <ExtraInfos/>
                        <OrderId>${reqOrderId}</OrderId>
                        <OrderType>CARTFILL</OrderType>
                        <Priority>50</Priority>
            </request>
        </dispenseRequest>
    </soapenv:Body>
</soapenv:Envelope>
`

xml2js.parseString(ppDispenseRequest, (err, result) => {
    if (err) {
        console.error(err);
        return;
    }

    const reqOrderId = result['soapenv:Envelope']['soapenv:Body'][0]['dispenseRequest'][0]['request'][0]['OrderId'][0];

        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', ' text/xml;application/soap+xml;charset=UTF-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.responseText);
                console.log(reqOrderId)
        };
        xhr.send(ppDispenseRequest);
        console.log(xhr.responseText);
    }

})
return reqOrderId
}
module.exports = sendPPDispenseRequest