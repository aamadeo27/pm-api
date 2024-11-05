import supertest from "supertest"

declare global {
  var request: supertest.SuperTest<supertest.Test>
}

declare module 'express-serve-static-core' {
  interface Request {
    csrfToken?: string;
  }
}

export {}

