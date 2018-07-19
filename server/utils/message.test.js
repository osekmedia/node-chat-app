const expect = require('expect');
const {generateMessage} = require('./message');

describe('generateMessage', () => {

	it('Should generate the correct test object', ()=>{
		var from = 'Erin';
		var text = 'Testing message system';
		var message = generateMessage( from, text );

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({from, text});
		
	});

}); 