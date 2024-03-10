//custom API Error ko handle kr rhe h , error response bhejne ke liye

class ApiError extends Error{
    constructor(statusCode,message = "Something went Wrong",errors = [],statck = ""){
        //message to override krna hi krna h
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        //developer ke liye ki kahan exact error h issiliye error stack tree bana rhe h issiliye
        if(statck){
            this.stack = statck
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}


export {ApiError}