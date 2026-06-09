import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Clínica Grupo AC',
            version: '1.0.0',
            description: 'Documentación de la API'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },
    apis: ['./src/rutas/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;