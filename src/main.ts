import './style.css'
import {
  CONFIG,
  crearPartida,
  reiniciarPartida,
  tocarCasilla,
  type EstadoPartida,
  type Jugador,
  type Posicion,
} from './logica.ts'

function obtenerContenedor(): HTMLDivElement {
  const contenedor = document.querySelector<HTMLDivElement>('#app')
  if (!contenedor) {
    throw new Error('No se encontró el contenedor principal del juego.')
  }
  return contenedor
}

const aplicacion = obtenerContenedor()

let partida: EstadoPartida = crearPartida()
let nombres: Record<Jugador, string> = {
  [CONFIG.JUGADOR_1]: 'Jugador 1',
  [CONFIG.JUGADOR_2]: 'Jugador 2',
}
let relevoPendiente = false
let cursor = { fila: 0, columna: 0 }

function escaparHtml(texto: string): string {
  return texto.replace(/[&<>"']/g, (caracter) => {
    const entidades: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entidades[caracter]
  })
}

function nombreDe(jugador: Jugador): string {
  return escaparHtml(nombres[jugador])
}

function vibrar(patron: number | number[]): void {
  if ('vibrate' in navigator) navigator.vibrate(patron)
}

function renderizarInicio(): void {
  aplicacion.innerHTML = `
    <main class="pantalla pantalla-inicio">
      <div class="marca" aria-hidden="true"><span>✳</span></div>
      <p class="sobretitulo">Duelo local · 2 jugadores</p>
      <h1>Cadenita</h1>
      <p class="bajada">Una carga puede encender toda la red.</p>
      <form class="formulario-nombres" id="formulario-nombres">
        <label class="campo-nombre campo-azul">
          <span>Jugador azul</span>
          <input name="azul" type="text" autocomplete="off" placeholder="Jugador 1">
        </label>
        <label class="campo-nombre campo-rojo">
          <span>Jugador rojo</span>
          <input name="rojo" type="text" autocomplete="off" placeholder="Jugador 2">
        </label>
        <button class="boton boton-principal" type="submit">Empezar partida <span aria-hidden="true">↗</span></button>
      </form>
      <p class="nota-inicio">6 × 5 casillas <span aria-hidden="true">·</span> Pasa el teléfono en cada turno</p>
    </main>
  `

  const formulario = aplicacion.querySelector<HTMLFormElement>('#formulario-nombres')
  if (!formulario) throw new Error('No se encontró el formulario de jugadores.')

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault()
    const datos = new FormData(formulario)
    nombres = {
      [CONFIG.JUGADOR_1]: String(datos.get('azul')).trim() || 'Jugador 1',
      [CONFIG.JUGADOR_2]: String(datos.get('rojo')).trim() || 'Jugador 2',
    }
    partida = crearPartida()
    cursor = { fila: 0, columna: 0 }
    renderizarJuego()
  })
}

function obtenerIndicesImpactados(explosiones: Posicion[]): Map<string, number> {
  const impactados = new Map<string, number>()

  explosiones.forEach((posicion, indice) => {
    const vecinas: Posicion[] = []
    if (posicion.fila > 0) {
      vecinas.push({ fila: posicion.fila - 1, columna: posicion.columna })
    }
    if (posicion.fila < CONFIG.FILAS - 1) {
      vecinas.push({ fila: posicion.fila + 1, columna: posicion.columna })
    }
    if (posicion.columna > 0) {
      vecinas.push({ fila: posicion.fila, columna: posicion.columna - 1 })
    }
    if (posicion.columna < CONFIG.COLUMNAS - 1) {
      vecinas.push({ fila: posicion.fila, columna: posicion.columna + 1 })
    }
    for (const vecina of vecinas) {
      const clave = `${vecina.fila}-${vecina.columna}`
      if (!impactados.has(clave)) impactados.set(clave, indice)
    }
  })

  return impactados
}

function crearTablero(explosiones: Posicion[]): string {
  const impactados = obtenerIndicesImpactados(explosiones)
  const tiempoTotal = Math.min(900, explosiones.length * 45)

  return partida.tablero
    .map((fila, indiceFila) =>
      fila
        .map((casilla, indiceColumna) => {
          const clave = `${indiceFila}-${indiceColumna}`
          const indiceExplosion = explosiones.findIndex(
            (posicion) =>
              posicion.fila === indiceFila &&
              posicion.columna === indiceColumna,
          )
          const indiceImpacto = impactados.get(clave)
          const esSeleccionada =
            cursor.fila === indiceFila && cursor.columna === indiceColumna
          const clases = ['casilla']
          if (casilla.dueno === CONFIG.JUGADOR_1) clases.push('casilla-azul')
          if (casilla.dueno === CONFIG.JUGADOR_2) clases.push('casilla-roja')
          if (casilla.dueno === null) clases.push('casilla-neutra')
          if (casilla.cargas > 0) clases.push('casilla-cargada')
          if (esSeleccionada) clases.push('casilla-seleccionada')
          if (indiceExplosion >= 0) clases.push('casilla-explosion')
          else if (indiceImpacto !== undefined) clases.push('casilla-impacto')
          const indiceAnimacion = indiceExplosion >= 0 ? indiceExplosion : indiceImpacto
          const retraso =
            indiceAnimacion === undefined
              ? ''
              : `--retraso: ${Math.round((indiceAnimacion / Math.max(explosiones.length, 1)) * tiempoTotal)}ms;`
          const profundidad = Math.min(casilla.cargas, 5)

          return `
            <button
              class="${clases.join(' ')}"
              type="button"
              data-fila="${indiceFila}"
              data-columna="${indiceColumna}"
              aria-label="Fila ${indiceFila + 1}, columna ${indiceColumna + 1}, ${casilla.cargas} ${casilla.cargas === 1 ? 'carga' : 'cargas'}, ${casilla.dueno === null ? 'neutra' : `de ${nombreDe(casilla.dueno)}`}"
              aria-current="${esSeleccionada ? 'true' : 'false'}"
              tabindex="${esSeleccionada ? '0' : '-1'}"
              style="--profundidad: ${profundidad}; --altura: ${profundidad * 3}px; ${retraso}"
              ${relevoPendiente || partida.terminada ? 'disabled' : ''}
            >
              <span class="cargas" aria-hidden="true">${casilla.cargas > 0 ? casilla.cargas : ''}</span>
              <span class="solo-lectores">Fila ${indiceFila + 1}, columna ${indiceColumna + 1}</span>
            </button>
          `
        })
        .join(''),
    )
    .join('')
}

function textoFinal(): string {
  const ganador = partida.ganador
  if (ganador === null) return ''
  const rival =
    ganador === CONFIG.JUGADOR_1 ? CONFIG.JUGADOR_2 : CONFIG.JUGADOR_1
  return `¡COLAPSO EN CADENA! ${nombreDe(ganador)} desató ${partida.explosionesUltimoTurno} explosiones seguidas y vaporizó la red de ${nombreDe(rival)}.`
}

function renderizarJuego(explosiones: Posicion[] = []): void {
  const conteoAzul = partida.tablero
    .flat()
    .filter((casilla) => casilla.dueno === CONFIG.JUGADOR_1).length
  const conteoRojo = partida.tablero
    .flat()
    .filter((casilla) => casilla.dueno === CONFIG.JUGADOR_2).length
  const jugador = partida.jugadorActual
  const mensajeTurno = relevoPendiente
    ? `<div class="cortina relevo" role="dialog" aria-modal="true" aria-labelledby="titulo-relevo">
        <div class="panel-cortina">
          <span class="icono-relevo" aria-hidden="true">⇄</span>
          <p class="sobretitulo">Cambio de turno</p>
          <h2 id="titulo-relevo">Pasa el teléfono</h2>
          <p>Ahora juega <strong class="${jugador === CONFIG.JUGADOR_1 ? 'texto-azul' : 'texto-rojo'}">${nombreDe(jugador)}</strong>.</p>
          <button class="boton boton-principal" id="continuar-turno" type="button">Ya estoy listo</button>
        </div>
      </div>`
    : ''
  const mensajeFinal = partida.terminada
    ? `<div class="cortina final" role="dialog" aria-modal="true" aria-labelledby="titulo-final">
        <div class="panel-cortina panel-final">
          <span class="icono-final" aria-hidden="true">✳</span>
          <p class="sobretitulo">La red cambió de dueño</p>
          <h2 id="titulo-final">¡Colapso en cadena!</h2>
          <p>${textoFinal()}</p>
          <button class="boton boton-principal" id="volver-a-jugar" type="button">Volver a jugar</button>
        </div>
      </div>`
    : ''

  aplicacion.innerHTML = `
    <main class="pantalla pantalla-juego">
      <header class="barra-superior">
        <span class="logo-mini" aria-label="Cadenita">C<span>✳</span></span>
        <p class="estado-partida">${partida.terminada ? 'Partida terminada' : `Turno de <strong class="${jugador === CONFIG.JUGADOR_1 ? 'texto-azul' : 'texto-rojo'}">${nombreDe(jugador)}</strong>`}</p>
        <button class="boton-reinicio" id="reiniciar" type="button" aria-label="Reiniciar partida" title="Reiniciar partida">↻</button>
      </header>
      <section class="marcador" aria-label="Marcador de casillas">
        <div class="jugador jugador-azul ${jugador === CONFIG.JUGADOR_1 && !partida.terminada ? 'jugador-activo' : ''}">
          <span class="punto-color" aria-hidden="true"></span>
          <span class="nombre-jugador">${nombreDe(CONFIG.JUGADOR_1)}</span>
          <strong>${conteoAzul}</strong>
        </div>
        <span class="separador-marcador" aria-hidden="true">/ ${CONFIG.FILAS * CONFIG.COLUMNAS}</span>
        <div class="jugador jugador-rojo ${jugador === CONFIG.JUGADOR_2 && !partida.terminada ? 'jugador-activo' : ''}">
          <span class="punto-color" aria-hidden="true"></span>
          <span class="nombre-jugador">${nombreDe(CONFIG.JUGADOR_2)}</span>
          <strong>${conteoRojo}</strong>
        </div>
      </section>
      <section class="zona-tablero" aria-label="Partida de Cadenita">
        <div class="escena-tablero">
          <div class="tablero" id="tablero" role="group" aria-label="Tablero de 6 filas por 5 columnas">
            ${crearTablero(explosiones)}
          </div>
          <div class="sombra-tablero" aria-hidden="true"></div>
        </div>
        <p class="instruccion">${partida.terminada ? 'La cadena está completa.' : 'Toca una casilla neutra o de tu color para cargarla.'}</p>
      </section>
      <footer class="ayuda-controles">
        <span class="tecla">← ↑ ↓ →</span><span>Mover</span>
        <span class="tecla">Espacio / Enter</span><span>Cargar</span>
      </footer>
    </main>
    ${mensajeTurno}
    ${mensajeFinal}
  `

  const tablero = aplicacion.querySelector<HTMLDivElement>('#tablero')
  tablero?.querySelectorAll<HTMLButtonElement>('.casilla').forEach((boton) => {
    boton.addEventListener('click', () => {
      if (relevoPendiente || partida.terminada) return
      const fila = Number(boton.dataset.fila)
      const columna = Number(boton.dataset.columna)
      if (!tocarCasilla(partida, fila, columna)) return

      cursor = { fila, columna }
      vibrar(partida.explosionesUltimoTurno > 0 ? [8, 18, 45] : 10)
      if (!partida.terminada) relevoPendiente = true
      renderizarJuego(partida.ultimasExplosiones)

      if (relevoPendiente) {
        aplicacion.querySelector<HTMLButtonElement>('#continuar-turno')?.focus()
      } else {
        aplicacion.querySelector<HTMLButtonElement>('#volver-a-jugar')?.focus()
      }
    })
  })

  tablero?.addEventListener('keydown', (evento: KeyboardEvent) => {
    const direcciones: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    }
    const direccion = direcciones[evento.key]
    if (!direccion) return

    evento.preventDefault()
    cursor = {
      fila: Math.max(0, Math.min(CONFIG.FILAS - 1, cursor.fila + direccion[0])),
      columna: Math.max(
        0,
        Math.min(CONFIG.COLUMNAS - 1, cursor.columna + direccion[1]),
      ),
    }
    tablero
      .querySelector<HTMLButtonElement>(
        `[data-fila="${cursor.fila}"][data-columna="${cursor.columna}"]`,
      )
      ?.focus()
  })

  aplicacion
    .querySelector<HTMLButtonElement>('#continuar-turno')
    ?.addEventListener('click', () => {
      relevoPendiente = false
      renderizarJuego()
      aplicacion
        .querySelector<HTMLButtonElement>(
          `[data-fila="${cursor.fila}"][data-columna="${cursor.columna}"]`,
        )
        ?.focus()
    })

  aplicacion
    .querySelector<HTMLButtonElement>('#reiniciar')
    ?.addEventListener('click', () => {
      reiniciarPartida(partida)
      cursor = { fila: 0, columna: 0 }
      relevoPendiente = false
      renderizarJuego()
    })

  aplicacion
    .querySelector<HTMLButtonElement>('#volver-a-jugar')
    ?.addEventListener('click', () => {
      reiniciarPartida(partida)
      cursor = { fila: 0, columna: 0 }
      relevoPendiente = false
      renderizarJuego()
    })
}

renderizarInicio()
