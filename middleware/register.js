const joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const db = require('../models');
const User = db.user;

exports.registerValidate = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('email'),
        password: joi.string().required().label('password'),
        // password: passwordComplexity({
        //     min: 8,
        //     max: 26,
        //     lowerCase: 1,
        //     upperCase: 1,
        //     numeric: 1,
        //     symbol: 1,
        //     requirementCount: 4,
        // }),
        confirmPassword: joi.ref('password'),
    });
    return schema.validate(data);
}