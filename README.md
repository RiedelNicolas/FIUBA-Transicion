# FIUBA transicion

### PWA para calcular equivalencias entre planes viejos y planes 2023

### Env vars necesarias

```
VITE_NOMBRE_CARRERA: Nombre que aparecerá en el header. e.g.: 'Ingeniería Informática'
VITE_SLUG_CARRERA: Nombre de la carpeta donde está el plan. e.g.: 'informatica', 'industrial'.
VITE_WEB_URL: Esquema y dominio de la URL. e.g.: 'https://transicion.fi.uba.ar'
```

### JSON de planes

En `src/planes/` se encuentran las carpetas con los JSON de los distintos planes. Si se quiere modificar un plan, utilizar el script excel2json y pegar los archivos resultantes en las respectivas carpetas.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```
