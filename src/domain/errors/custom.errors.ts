export class CustomError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly message: string,
    ){
        super(message);
    }

    static badRequest(message: string){ // cuando querramos usar esto, solo hay que
        return new CustomError(400, message); // hacer CustomError.badRequest("mensaje de error")
    }

    static unauthorized(message: string){
        return new CustomError(401, message);
    }

    static forbidden(message: string){
        return new CustomError(403, message);
    }

    static notFound(message: string){
        return new CustomError(404, message);
    }

    static internalServer(message: string){
        return new CustomError(500, message);
    }
}