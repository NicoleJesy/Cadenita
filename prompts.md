# Prompts del proyecto Cadenita

Recopilación de las solicitudes y mensajes que fui dando para este proyecto, en orden cronológico. Se omiten los adjuntos automáticos del navegador.

## 1. Crear la lógica del juego

Creá el archivo src/logica.ts con las reglas de [MI JUEGO / MI APLICACIÓN],  
según la ficha de abajo.

REGLAS TÉCNICAS, obligatorias
- TypeScript. Exportá los tipos y el objeto CONFIG con todos los números
  juntos arriba, cada uno con un comentario que diga su unidad.
- Este archivo NO puede tocar la pantalla: nada de document, window, alert ni
  console.log. Solo datos y funciones sobre el estado.
- Cada función que cambia el estado devuelve true si la acción fue válida y
  false si no se pudo hacer.
- Si hace falta azar, usá un generador con semilla y exportalo, para que la
  misma semilla dé siempre el mismo resultado.
- Código y comentarios en español.

REGLAS DE TRABAJO
- Hacé exactamente lo que dice la ficha. Nada más.
- Si algo es ambiguo o imposible, paralo y preguntame antes de inventar.
- Al terminar, listame qué dejaste fuera y qué decidiste vos donde la ficha
  no decía nada.

FICHA:

NOMBRE DEL PROYECTO

Cadenita

EN UNA FRASE

Un juego de estrategia en cuadrícula donde tocas casillas para cargarlas hasta que explotan y conquistan las casillas vecinas en una reacción en cadena.

PARA QUIÉN ES

Para Mateo, de 14 años, que quiere jugar una partida rápida de dos minutos en el colectivo mientras va a la escuela.

QUÉ LOGRA

Eliminar todas las fichas del rival y conquistar el 100% del tablero provocando cascadas de explosiones.

LOS TRES VERBOS

Tocar (elegir una casilla para agregarle una carga).

Explotar (hacer que una casilla llena reparta sus cargas a las vecinas).

Reiniciar (empezar una partida nueva cuando termina la anterior).

TERMINA BIEN SI…

Consigues pintar todas las casillas del tablero con tu color y el rival se queda sin fichas.

TERMINA MAL SI…

El rival provoca una reacción en cadena que elimina tu última casilla; la pantalla se tiñe de rojo con el mensaje «¡Te quedaste sin fichas!» y un botón de reintento.

QUÉ SE VE EN PANTALLA

La cuadrícula del juego al centro, el turno actual (mostrando de quién es el color), el marcador de casillas de cada jugador y un botón de reinicio en la esquina superior.

CONTROLES

Con el teclado: Flechas de dirección para mover el cursor por la cuadrícula y barra espaciadora (o Enter) para cargar la casilla.

Con el dedo: Tocar directamente la casilla elegida en la pantalla táctil.

COLORES Y QUÉ SIGNIFICAN

Gris oscuro: Casillas vacías o neutras.

Azul: Casillas y cargas del Jugador 1.

Rojo: Casillas y cargas del Jugador 2 (o la máquina).

Amarillo: Destello brillante que dura un instante cuando una casilla explota.

CRITERIO DE ACEPTACIÓN

«Abro el juego en el celular, toco una casilla azul con tres cargas, veo cómo explota y se expande a las cuatro casillas de alrededor volviéndolas azules, logro pintar la última casilla del rival, veo el cartel de "¡Ganaste!" y toco el botón para volver a jugar.»

LO QUE NO VA

Sin sonidos ni música pesada de librerías externas, sin menús principales ni pantallas de carga, sin registro de usuarios, sin multijugador por internet (solo local en el mismo teléfono).

## 2. Preguntar qué falta

que falta?

## 3. Pedir el trabajo por partes

oki pidemelo por partes

## 4. Tutorial visual y casillas críticas

Necesito mejorar la experiencia de usuario (UX) en mi juego de Reacción en Cadena actualizando `src/main.ts` y `src/style.css` con dos funciones clave sin romper la interfaz 3D ni la lógica existente:

1. Modal de Bienvenida / Tutorial Visual:
- Crear e inyectar un modal al iniciar el juego con 3 pasos claros:
  1. Toca casillas vacías o de tu color para agregar cargas.
  2. Cuando una casilla se llena, explota y distribuye sus cargas a los vecinos.
  3. Límites de explosión: Esquinas = 2, Bordes = 3, Centro = 4.
- Incluir un botón "¡Entendido, a jugar!" que cierre el modal.
- Agregar un botón discreto de ayuda (?) en la interfaz superior para volver a abrir el tutorial en cualquier momento.

2. Indicador de Estado Crítico (Peligro de Explosión):
- Calcular dinámicamente el límite de cada casilla según su posición (esquina: 2, borde: 3, centro: 4).
- Si a una casilla le falta solo 1 carga para explotar (ej: 1/2 en esquina, 2/3 en borde, 3/4 en centro), agregarle la clase CSS `.critical`.
- En `src/style.css`, definir para `.critical` un efecto de pulso animado (@keyframes) con resplandor neón/glow para advertir visualmente a los jugadores que la casilla está a punto de estallar.

Por favor, proporcióname el código actualizado para `src/main.ts` y los estilos CSS necesarios para agregarlos a `src/style.css`.

## 5. Preguntar qué falta

que falta?

## 6. Volver a pedir tutorial y casillas críticas

Necesito mejorar la experiencia de usuario (UX) en mi juego de Reacción en Cadena actualizando `src/main.ts` y `src/style.css` con dos funciones clave sin romper la interfaz 3D ni la lógica existente:

1. Modal de Bienvenida / Tutorial Visual:
- Crear e inyectar un modal al iniciar el juego con 3 pasos claros:
  1. Toca casillas vacías o de tu color para agregar cargas.
  2. Cuando una casilla se llena, explota y distribuye sus cargas a los vecinos.
  3. Límites de explosión: Esquinas = 2, Bordes = 3, Centro = 4.
- Incluir un botón "¡Entendido, a jugar!" que cierre el modal.
- Agregar un botón discreto de ayuda (?) en la interfaz superior para volver a abrir el tutorial en cualquier momento.

2. Indicador de Estado Crítico (Peligro de Explosión):
- Calcular dinámicamente el límite de cada casilla según su posición (esquina: 2, borde: 3, centro: 4).
- Si a una casilla le falta solo 1 carga para explotar (ej: 1/2 en esquina, 2/3 en borde, 3/4 en centro), agregarle la clase CSS `.critical`.
- En `src/style.css`, definir para `.critical` un efecto de pulso animado (@keyframes) con resplandor neón/glow para advertir visualmente a los jugadores que la casilla está a punto de estallar.

Por favor, proporcióname el código actualizado para `src/main.ts` y los estilos CSS necesarios para agregarlos a `src/style.css`.

## 7. Decir “vaya eso”

vaya eso

## 8. Adaptar el juego para celular

Hacé que esto funcione bien en un celular:

1. Todo lo que se toca tiene que medir al menos 44 píxeles de alto y de ancho.
2. Nada se sale de la pantalla a lo ancho: cero desplazamiento horizontal.
3. El texto nunca baja de 16 píxeles.
4. Funciona con el dedo (toque) y también con teclado, las dos cosas.
5. Agregá la etiqueta viewport en index.html si falta.

No cambies las reglas ni la dificultad. Decime qué ajustaste.

## 9. Preguntar cómo verlo en el celular

como lo hago para verlo en el celular?

## 10. Preguntar si está disponible

lo tienes?

## 11. Revisar seis problemas del proyecto

Revisá todo el proyecto buscando estos seis problemas, y decime cuáles tiene  
y en qué línea está cada uno:

1. Lógica metida dentro de main.ts.
2. Números sueltos fuera del objeto CONFIG.
3. Un final bueno al que no se pueda llegar: hacé el cálculo con los números reales.
4. Estado que no se reinicia bien al empezar de nuevo.
5. Variables o funciones que quedaron sin uso.
6. Alguna regla de mi ficha que las pruebas no cubran.

Solo el informe, numerado. TODAVÍA NO ARREGLES NADA.

## 12. Mensaje después de diez toques

nueva funcionalidad, que a los 10 toques de casilla.. le salga un mensaje de que que rapido es..

## 13. Mejorar el inicio

ademas que el inicio sea diferente que tenga un estilo mas pro

## 14. Mostrar opciones después de treinta toques

tambien que a los 30 toques salga una pantallita si quiere reiniciar el juego o si quiere continuar

## 15. Agregar opción para salir del juego

pero tambien aparezca salir del juego

## 16. Crear el README

Escribí el archivo README.md en español con estas seis partes:

1. Nombre y la frase de mi ficha.
2. Qué hace y cómo se usa, en tres líneas.
3. El enlace para abrirlo.
4. Cómo correrlo en otra máquina: los comandos exactos.
5.Qué dirigí yo y qué error encontré probando.
6. Declaración de autoría: qué herramienta usé, que el código lo generó un
   agente de IA bajo mi dirección, y qué partes puedo explicar.

## 17. Crear este archivo de prompts

crea un archivo .md llamado prompts.md este contendra todos los prompts q te he dado
