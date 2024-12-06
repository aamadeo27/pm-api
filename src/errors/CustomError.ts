export class CustomError extends Error { 
  statusCode: number

  constructor(message: string, statusCode: number = 500){
    super(message)

    this.statusCode = statusCode
    Object.setPrototypeOf(this, Error.prototype)
  }
}

export class InvalidTokenError extends Error {
  constructor(message: string){
    super(message)
  }
}