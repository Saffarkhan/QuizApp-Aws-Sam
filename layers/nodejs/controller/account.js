const AWS = require("aws-sdk")
const Joi = require("joi")

class Account {

    static async login(event) {
        try {
            event.body = JSON.parse(event.body)
        } catch (error) {
            return { "statusCode": 404, "body": JSON.stringify({ error: true, message: "Invalid Body" }) }
        }

        let validation_schema = Joi.object({
            email: Joi.string().required().pattern(new RegExp("[a-z0-9\\.]+@[a-z]+\\.[a-z]{2,3}"))
                .messages({
                    'string.pattern.base': "Invalid email format"
                }),
            password: Joi.string().required(), 
            phone_nubmer: Joi.number().optional()
        })

        let { error, value } = validation_schema.validate(event.body, { allowUnknown: false })
        if (error) {
            return { "statusCode": 404, "body": JSON.stringify({ error: true, message: error.message }) }
        }

        let { phone_nubmer, email, password } = event.body


        try {

            let cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider()

            let params = {
                ClientId: process.env.CognitoClientID,
                Username: email,
                Password: password,
                UserAttributes: [
                    {
                        Name: 'email',
                        Value: email
                    }
                ]
            }


            let promise = new Promise((resolve, reject) => {
                cognitoIdentityServiceProvider.signUp(params, function (err, data) {
                    if (err) {
                        console.log('Error:', err);
                        resolve({ "statusCode": 404, "body": JSON.stringify({ error: true, message: err.message }) })
                    } else {
                        console.log('User created:', data);
                        resolve({ "statusCode": 200, "body": JSON.stringify({ error: false, message: "user created", data: { data } }) })
                    }
                });
            })
            return await promise;
            
        } catch (error) {
            return { "statusCode": 500, "body": JSON.stringify({ error: true, message: "Invalid Body" }) }
        }

        /* let res = { "statusCode": 500, "body": JSON.stringify({ error: false, message: "Success" }) }
        return res */
    }
}

module.exports = Account
