const joi = require('joi');

exports.loginValidate = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
        password: joi.string().required().label('Password'),
    });
    return schema.validate(data);
}