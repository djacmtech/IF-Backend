const joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const db = require('../models');
const User = db.user;

exports.registerValidate = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('email'),
        password: passwordComplexity().required().label('password'),
        confirmPassword: joi.ref('password'),
    });
    return schema.validate(data);
}