const joi = require('joi');

exports.loginValidate = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('email'),
        password: joi.string().required().label('password'),
    });
    return schema.validate(data);
}