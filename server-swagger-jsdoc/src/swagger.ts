import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'xCustomServer API',
        version: '1.0.0',
        description: 'A Xentral add-in under the heavenly might of the Little Dragon.',
    },
    externalDocs: {
        description: "swagger.json",
        url: "/swagger.json"
    }
};

const options = {
    swaggerDefinition,
    apis: [
        path.join(__dirname, "./routes/*.{ts,js}"),
        path.join(__dirname, "./models/*.{ts,js}")/*,
        path.join(__dirname, "./routes/*.js"),
        path.join(__dirname, "./routes/*.ts")*/
    ], // Paths to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;