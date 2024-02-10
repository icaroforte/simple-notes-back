const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('notes', { content: 1, subContent: 1 });
    response.json(users);
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password, roles } = request.body;
    const rolesUpper = roles.map(role => role.toUpperCase());
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash,
        roles: rolesUpper
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
})

usersRouter.put('/:id', async (request, response) => {
    const { name, password, roles } = request.body;
    const rolesUpper = roles.map(role => role.toUpperCase());
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = {
        name,
        passwordHash,
        roles: rolesUpper
    };

    await User.findByIdAndUpdate(request.params.id, user, { new: true }).then(userUpdated => {
        response.json(userUpdated);
    });
})



module.exports = usersRouter;