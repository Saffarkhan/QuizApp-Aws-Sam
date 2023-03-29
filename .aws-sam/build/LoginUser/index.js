const layer = require("/opt/nodejs")
const {Controller} = layer

//let lodash = require('lodash')

exports.lambdaHandler = async (event, context) => {

    let response = null
    try {
        response = await Controller.Account.login(event)
    } catch (err) {
        console.log(err)
        response = { "statusCode": 500, "body": JSON.stringify({ error: true, message: err.message }) }
    }

    response = {
        ...response, headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,PATCH,DELETE"
        },
    }
    //let response = { "statusCode": 500, "body": JSON.stringify({ error: false, message: "Success" }) }
    return response
};
