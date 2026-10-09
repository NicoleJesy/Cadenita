# Cadenita

## 1. Nombre y frase

**Cadenita**  
Un juego de estrategia en cuadrícula donde tocas casillas para cargarlas hasta que explotan y conquistan las casillas vecinas en una reacción en cadena.

## 2. Qué hace y cómo se usa

Es un juego local para dos jugadores: cada quien toma el teléfono durante su turno.  
Toca una casilla vacía o de tu color para agregar una carga; al llenarse, explota y carga a sus vecinas.  
Gana quien elimina las casillas del rival; usa las flechas y Espacio o Enter si juegas con teclado.

## 3. Enlace para abrirlo

[Abrir Cadenita](http://10.93.28.40:5173/)

Este enlace funciona mientras el servidor de desarrollo esté activo y el dispositivo esté conectado a la misma red Wi-Fi que la computadora que lo sirve. La dirección local puede cambiar.

## 4. Cómo correrlo en otra máquina

Instala Node.js, abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
npm ci
npm run dev -- --host 0.0.0.0
```

Abre en esa máquina la dirección que Vite muestre en la terminal, normalmente `http://localhost:5173/`. Para compilar la versión de producción:

```powershell
npm run build
```

## 5. Qué dirigí y qué error encontré al probar

Dirigí el diseño del juego y pedí la lógica de cargas y explosiones, el tablero 3D, el juego local por turnos, los controles táctiles y de teclado, el tutorial, las alertas de casillas críticas, los mensajes a los 10 y 30 toques y la opción de salir.

Al revisar la condición de victoria encontré que el juego podía declarar un ganador cuando el rival se quedaba sin casillas, aunque todavía quedaran casillas neutras. Eso no cumple por completo la condición de la ficha de conquistar el 100 % del tablero. La compilación con `npm run build` termina correctamente; no hay pruebas automatizadas de reglas configuradas en el proyecto.

## 6. Declaración de autoría

Usé Visual Studio Code con Copilot SDK. El código fue generado por un agente de inteligencia artificial bajo mi dirección; yo definí los requisitos, pedí las funciones y revisé el resultado. Puedo explicar las reglas de cargas y explosiones, cómo se alternan los turnos, los controles, los mensajes por cantidad de toques y las opciones para reiniciar o salir.
