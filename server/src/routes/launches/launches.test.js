const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
	test('It should respond with 200 success', async () => {
		await request(app)
			.get('/launches')
			.expect(200)
			.expect('Content-Type', /json/);
	});
});

describe('Test POST /launch', () => {
	const completeLaunchData = {
		mission: 'USS Enterprise',
		rocket: 'NCC 1701-D',
		target: 'Kepler-186 f',
		launchDate: 'January 4, 2028',
	};

	const launchDataWithoutDate = {
		mission: 'USS Enterprise',
		rocket: 'NCC 1701-D',
		target: 'Kepler-186 f',
	};

	test('It should respond with 201 success', async () => {
		const response = await request(app)
			.post('/launches')
			.send(completeLaunchData)
			.expect('Content-Type', /json/)
			.expect(201);

		const requestDate = new Date(completeLaunchData.launchDate).valueOf();
		const responseDate = new Date(response.body.launchDate).valueOf();

		expect(response.body).toMatchObject({
			...launchDataWithoutDate,
		});
		expect(responseDate).toBe(requestDate);
	});

	test('It should catch missing required properties', async () => {
		await request(app)
			.post('/launches')
			.send({
				mission: 'USS Enterprise',
				rocket: 'NCC 1701-D',
				destination: 'Kepler-186 f',
				launchDate: 'January 4, 2028',
			})
			.expect(400);
	});

	test('It should catch invalid dates', async () => {
		await request(app)
			.post('/launches')
			.send({
				mission: 'USS Enterprise',
				rocket: 'NCC 1701-D',
				target: 'Kepler-186 f',
				launchDate: 'LolMonth 4 2028',
			})
			.expect(400);
	});
});
