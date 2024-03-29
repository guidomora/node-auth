# Rest Project + TypeScript

Este proyecto previamente inicializado tiene todo lo necesario para trabajar con TypeScript, Express y Rest.

Cada paso de su configuración ya se ha realizado previamente en el curso, por lo que solo es necesario clonar el proyecto y comenzar a trabajar.


## Instalación

1. Clonar .env.template a .env y configurar las variables de entorno
2. Ejecutar `npm install` para instalar las dependencias
3. En caso de necesitar base de datos, configurar el docker-compose.yml y ejecutar `docker-compose up -d` para levantar los servicios deseados.
4. Ejecutar `npm run dev` para levantar el proyecto en modo desarrollo






## Structure
Config
|    regular-exp ---> email validation
|    envs ---> env configuration
|
Presentation
|    Auth -----> Authentication
|        controller ----> gives response to the client, handdlers
|        routes     ----> routes defined
|    Services
         auth.service ---> handles the state of the authenticated user
Data
|    mongoDB
|        mongo-database ---> connection with mongo using mongoose
|         models
|            user.models ---> user model mongoose
|
Domain -----> rules that will domain in our app
|   errors
|       custom.errors ---> customized errors
|   entities
|       user.entity ---> when returning a user we wont return our mongoose model, instead we return user entity
|
|   dtos ---> they make sure that we can trust the properties of that object
|       auth
|           register-user.dto --->#   n o d e - a u t h  
 