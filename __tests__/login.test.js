const bcrypt = require('bcrypt');

const { signin } = require('../src/controllers/auth');
const { User } = require('../src/schemas');

describe('Auth login test', () => {
    it('should respond with token and user object', async () => {
        const _id = 'user-id';
        const email = 'test@example.com';
        const password = 'password';
        const regex = /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/g;
        const user = {
            _id,
            email,
            subscription: 'free',
            password: await bcrypt.hash(password, 10),
            save: jest.fn(),
        };
        jest.spyOn(User, 'findOne').mockImplementation(() => user);

        const req = { body: { email, password } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        await signin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            token: expect.stringMatching(regex),
            user: {
                email: expect.any(String),
                subscription: expect.any(String),
            },
        });
    });
});
