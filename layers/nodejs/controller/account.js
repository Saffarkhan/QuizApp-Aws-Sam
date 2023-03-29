class Account {
    
    static async login(event) {
        try {
            event.body = JSON.parse(event.body)
        } catch (error) {
            return {
                "statusCode": 400,
                "body": JSON.stringify({ error: true, message: "Invalid Body" })
            }
        }

        let res = { "statusCode": 500, "body": JSON.stringify({ error: false, message: "Success" }) }
        return res
    }
}

module.exports = Account
