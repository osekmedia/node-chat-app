const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {

	var users;

	beforeEach( () => {
		users = new Users();

		users.users = [{
			id: '1',
			name: 'Bob',
			room: 'Testers'
		},
		{
			id: '2',
			name: 'Amy',
			room: 'Developers'
		},
		{
			id: '3',
			name: 'Penelope',
			room: 'Testers'
		}];
	});

	it('Should add a new user', () => {
		var users = new Users();
		var user = {
			id: '1234',
			name: 'Erin',
			room: 'Awesome'
		};

		var resUser = users.addUser( user.id, user.name, user.room );

		expect(users.users).toEqual([user]);

	});

	it('Should remove a user', () => {

		var user = users.removeUser( '1' );

		expect(user.id).toBe('1');
		expect(users.users.length).toBe(2);
	});

	it('Should not remove a user', () => {

		var user = users.removeUser( '10' );

		expect(user).toNotExist();
		expect(users.users.length).toBe(3);
	});

	it('Should find a user', () => {
		var user = users.getUser( '2' );
		expect(user.id).toBe('2');
	});

	it('Should not find a user', () => {
		var user = users.getUser( '20' );
		expect(user).toNotExist();
	});

	it('Should return names of all users in Testers group', () => {

		var userlist = users.getUserList( 'Testers' );
		expect(userlist).toEqual(['Bob', 'Penelope']);
		
	});

	it('Should return names of all users in Developer group', () => {

		var userlist = users.getUserList( 'Developers' );
		expect(userlist).toEqual(['Amy']);
		
	});

});