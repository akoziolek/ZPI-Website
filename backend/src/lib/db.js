import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";


// config to use only one prisma client/connection to the database 

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

const prismaClient = global.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prismaClient;
}

export default prismaClient;
