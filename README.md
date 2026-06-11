# ProgramacionIII_Clinica_medica
2026 1er cuatrimestre - TECNICATURA UNIVERSITARIA EN DESARROLLO WEB

## Grupo AC
### Integrantes
* Solange Blanc
* Natasha Fernandez
* Ivonne Micaela Fernandez
* Esteban Medina
* Yanina Galvan
* Gustavo Adrián Pereyra
## Enlace a GITHUB
https://github.com/NatashaFernandez/ProgramacionIII_Clinica_medica

## Consignas
La clínica médica para la que desarrolló el sitio web y aplicación con funcionalidades del lado del
cliente desea completar el proyecto para lo cual le encarga el desarrollo de una aplicación del lado
del servidor que permita registrar el siguiente modelo de datos:

##REQUISITOS FUNCIONALES
Según los roles de la aplicación se listan las funcionalidades que deben estar permitidas:

### Médico (ROL = 1)
● Iniciar sesión.

● Listar turnos propios.

● Marcar un turno como atendido.

### Paciente (ROL = 2)
● Iniciar sesión.

● Crear reservas (turnos propios).

● Listar turnos propios.

● Listar especialidades.

● Listar todos los médicos y de una especialidad.

### Administrador (ROL = 3)
● Iniciar sesión.

● Listar, crear y editar especialidades.

● Asociar médicos con especialidades.

● Listar, crear y editar obras sociales.

● Asociar médicos con obras sociales.

● Asociar pacientes con obras sociales.

● Registrar un turno para un paciente, médico y fecha.

● Obtener estadísticas de atenciones.

## RESTRICCIONES Y REGLAS DE NEGOCIO:
● Las estadísticas deben generarse exclusivamente mediante procedimientos almacenados
(stored procedures).

● Los informes en PDF deben contener información sobre los turnos: cantidad, pacientes,
obras sociales, etc.

● El campo valor_total de la tabla turnos_reservas se calcula de la siguiente manera:
medicos.valor_consulta - (obras_sociales.porcentaje_descuento *
medicos.valor_consulta) para los casos en que la obra social NO sea particular
(es_particular = 0). Si la obra social ES particular (es_particular = 1)
valor_total = medicos.valor_consulta.

● Los “delete” no serán borrados físicos, se utilizaran “soft delete”, es decir se utilizará el
campo activo para indicar si el registro de la tabla está borrado o no. En este sentido para
ser consistente todos los registros que se busquen de la base de datos deberán cumplir el
criterio activo = 1.

## ASPECTOS TÉCNICOS REQUERIDOS
● Autenticación con JWT.

● Autorización por roles.

● Uso del framework Express.

● Persistencia de datos en MySQL.

● Utilización de Transacciones MySQL.

● Buen manejo de errores y respuestas HTTP apropiadas.

● Documentación del API haciendo uso de Swagger.

● Utilización de variables de entorno para el manejo de información sensible.

● CORS para habilitar / deshabilitar futuras conexiones desde el cliente web (front-end).

● Middlewares:

■ Validaciones. Ej.: express-validator.
■ Registro de solicitudes. Ej.: Morgan.
■ Carga de archivos. Ej.: Multer.

---

## EXTRAS
Cada grupo podrá agregar una funcionalidad extra al desarrollo.
### Lista de ejemplos:
● Permitir al profesional agregar comentarios u observaciones respecto de la atención.

● Sistema de auditoría: historial de acciones por usuario.

● Registro de usuarios: pacientes, médicos y administradores.

● Reinicio de contraseña para los usuarios.

● Incluir funcionalidades SSE o WebSockets que permitan saber a los pacientes cuál es el
próximo turno a llamar.

● Endpoint con LLM para identificar posibles diagnósticos.


************************************************************ENTREGA DE AVANCES 8-5-2026********************************************************************

iNTEGRANTE: SOLANGE BLANC- YANINA GALVAN
Tareas realizadas:
Inicialización del proyecto: Configuración de la estructura de carpetas y entorno Node.js. 
Arquitectura: Implementación de módulos ES6 (import/export) y gestión de variables de entorno con .env. 
Desarrollo de Entidad: Implementación completa del BREAD para Especialidades. 
Base de Datos: Configuración del Pool de conexiones con mysql2/promise. 
Stack TecnológicoMotor: Node.js  
Framework: Express 
Base de Datos: MySQL 
Middlewares: Morgan (logging) y Express.json (parseo)  
Estructura de Archivos (Especialidades) :
-index.js: Servidor central y configuración de middlewares. 
-src/configuracion/db.js: Conexión a la DB mediante variables de entorno. 
-src/controladores/especialidadesControlador.js: Lógica CRUD y borrado lógico (activo = 1). 
-src/rutas/especialidadesRutas.js: Definición de endpoints de la entidad.  

INTEGRANTE: IVONNE FERNÁNDEZ

INTEGRANTE: NATASHA FERNÁNDEZ

#####ENTREGA FINAL###########
INTEGRANTES: 
###SOLANGE BLANC####

###YANINA GALVÁN#####

###IVONNE FERNÁNDEZ###

###NATASHA FERNÁNDEZ###





