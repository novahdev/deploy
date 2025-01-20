# Deploy | Novah.dev

Este proyecto se encarga del despliegue de aplicaciones web en el servidor mediante una aplicación de consola y peticiones HTTP. Además, incluye un **panel de administración** para gestionar los proyectos en el servidor.

## Características

- **Despliegue Automático**: Despliega aplicaciones web en el servidor utilizando comandos de consola.
- **Peticiones HTTP**: Soporta operaciones de despliegue a través de peticiones HTTP.
- **Panel de Administración**: Interfaz amigable para gestionar los proyectos en el servidor.

## Requerimientos

- **Servidor**: Debe contar con acceso SSH y un servidor HTTP configurado.
- **Base de Datos**: SQLite.
- **Ambiente de Desarrollo**: Node.js, npm, y cualquier otro software necesario especificado en el archivo `package.json`.
- **Node.js**: La aplicación de consola requiere Node.js.

## Estructura del Proyecto

- **apps/api**: API del servidor encargada de recibir las peticiones HTTP y desplegar las aplicaciones desarrolladas con Nestjs.
- **apps/panel**: Panel de administración del servidor desarrollado con Angular.
- **apps/cli**: CLI de Node.js para el despliegue de las aplicaciones en el servidor.
- **apps/website**: Sitio web del proyecto desarrollado en Angular y publicado en `https://deploy.novah.dev`

## Instalación

1. Clona el repositorio del proyecto en tu máquina local:
    ```shell
    git clone https://github.com/heilernova/deploy.git
    ```
2. Navega al directorio del proyecto:
    ```shell
    cd deploy
    ```
3. Instala las dependencias del proyecto:
    ```shell
    npm install
    ```
4. Configura las variables de entorno según los archivos de ejemplo proporcionados (`.env`).

## Uso

### Despliegue mediante Consola

Iniciar sesión en el servidor
```shell
deploy login
```

Conectar el proyecto con el servidor
```shell
deploy add
```

Ejecuta el siguiente comando para desplegar una aplicación web en el servidor:
```shell
deploy [nombre-proyecto]
```