import internal from "stream";

export class cHttpMessages {
    //📋 generic http messages

    //informational 1xx

    //success 2xx
    static ok = { statusCode: 200, error: false, message: 'OK' };
    static created = { statusCode: 201, error: false, message: 'Created' };
    static accepted = { statusCode: 202, error: false, message: 'Accepted' };
    static noContent = { statusCode: 204, error: false, message: 'No content' };

    //redirect 3xx
    static movedPermanently = { statusCode: 301, error: false, message: 'Moved permanently' };


    //client error 4xx
    static badRequest = { statusCode: 400, error: true, message: 'Bad request' };
    static unauthorized = { statusCode: 401, error: true, message: 'Unauthorized' };
    static forbidden = { statusCode: 403, error: true, message: 'Forbidden' };
    static notFound = { statusCode: 404, error: true, message: 'Not found' };
    static methodNotAllowed = { statusCode: 405, error: true, message: 'Method not allowed' };

    static tooManyRequests = { statusCode: 429, error: true, message: 'Too many requests' };

    
    //server error 5xx
    static internalServerError = { statusCode: 500, error: true, message: 'Internal server error' };
    static badGateway = { statusCode: 502, error: true, message: 'Bad gateway' };
    static serviceUnavailable = { statusCode: 503, error: true, message: 'Service unavailable' };
    static gatewayTimeout = { statusCode: 504, error: true, message: 'Gateway timeout' };
    
    
    
    
    //📝 form http messages
    static generateBadRequestMessage(message?: unknown) {
        return { statusCode: 400, error: true, message: "Bad request: " + message};
    }
    static generateUnauthorizeMessage(message?: unknown) {
        return { statusCode: 401, error: true, message: "Unautharized: " +  message};
    }
    static generateForbiddenMessage(message?: unknown) {
        return { statusCode: 403, error: true, message: "Forbidden: " + message};
    }
    static generateNotFoundMessage(message?: unknown) {
        return { statusCode: 404, error: true, message: "Not found: " + message};
    }
    

    //🎨 custom http messages
    static generateMessage(statusCode: number, error: boolean, message?: unknown) {
        return { statusCode: statusCode, error: error, message: message};
    }

    static generatePayload(statusCode: unknown, error: boolean, payload?: unknown) {
        return { statusCode: statusCode, error: error, payload: payload };
    }

}

