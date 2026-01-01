// Prisma 7 configuration file
// This file is used by Prisma CLI for migrations and other operations

export default {
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
};
