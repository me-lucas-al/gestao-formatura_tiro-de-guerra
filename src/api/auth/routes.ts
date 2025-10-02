import { FastifyReply, FastifyRequest } from "fastify";
import app from "./auth";


declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    admin?: any;
  }
}

app.get(
  "/dashboard",
  { preValidation: [app.authenticate] },
  async (req: FastifyRequest, reply: FastifyReply) => {
    return { admin: req.admin };
  }
);