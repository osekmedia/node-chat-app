const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {

	it('Should reject non-string values', ()=>{
		
		var isValid = isRealString( 100 );

		expect(isValid).toBe(false);

	});

	it('Should reject strings with only  spaces', ()=>{

		var isValid = isRealString( '   ' );

		expect(isValid).toBe(false);
		
	});

	it('Should allow strings that are not spaces', ()=>{

		var isValid = isRealString( 'Erin' );

		expect(isValid).toBe(true);
		
	});

}); 