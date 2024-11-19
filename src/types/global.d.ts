import supertest from "supertest"
import express from "express"
import { PrismaClient } from "@prisma/client";

declare global {
  var request: supertest.SuperTest<supertest.Test>
  var db: PrismaClient

  namespace Express {
    export interface Request {
      res?: Response
    }
  }
}

export {}

