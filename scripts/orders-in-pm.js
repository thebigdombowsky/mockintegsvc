const soap = require('soap');

const client = new soap.Client();
client.wsdl = 'http://localhost:9602/IncomingWebServiceImpl?wsdl';

const response = client.call('MyOperation', {
  message: {
    text: 'This is a message',
  },
});

console.log(response);
