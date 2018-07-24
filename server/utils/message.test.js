const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {

	it('Should generate the correct test object', ()=>{
		
		var from = 'Erin';
		var text = 'Testing message system';
		var message = generateMessage( from, text );

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({from, text});
		
	});

}); 

describe('generateLocationMessage', () => {

	it('Should generate the correct location object', ()=>{

		var from = 'Erin';
		var latitude = 33.4978335;
		var longitude = -112.0936485;
		var url = `https://www.google.com/maps?q=${latitude},${longitude}`;
		var message = generateLocationMessage( from, latitude, longitude );

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({from, url});
		
	});

}); 