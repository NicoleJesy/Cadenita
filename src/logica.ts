export const CONFIG = {
  FILAS: 6, // filas
  COLUMNAS: 5, // columnas
  JUGADOR_1: 1, // identificador de jugador
  JUGADOR_2: 2, // identificador de jugador
  CARGAS_INICIALES: 0, // cargas por casilla
  CARGAS_POR_TOQUE: 1, // carga por toque
  CARGAS_POR_VECINA: 1, // carga por casilla vecina al explotar
  MAX_EXPLOSIONES_POR_TURNO: 500, // explosiones por turno
} as const

export type Jugador = typeof CONFIG.JUGADOR_1 | typeof CONFIG.JUGADOR_2

export interface Casilla {
  dueno: Jugador | null
  cargas: number
}

export interface EstadoPartida {
  tablero: Casilla[][]
  jugadorActual: Jugador
  ganador: Jugador | null
  terminada: boolean
  explosionesUltimoTurno: number
  ultimasExplosiones: Posicion[]
}

export interface Posicion {
  fila: number
  columna: number
}

function crearTablero(): Casilla[][] {
  return Array.from({ length: CONFIG.FILAS }, () =>
    Array.from({ length: CONFIG.COLUMNAS }, () => ({
      dueno: null,
      cargas: CONFIG.CARGAS_INICIALES,
    })),
  )
}

function obtenerRival(jugador: Jugador): Jugador {
  return jugador === CONFIG.JUGADOR_1
    ? CONFIG.JUGADOR_2
    : CONFIG.JUGADOR_1
}

function obtenerVecinas(tablero: Casilla[][], posicion: Posicion): Posicion[] {
  const vecinas: Posicion[] = []
  const fila = posicion.fila
  const columna = posicion.columna

  if (fila > 0) vecinas.push({ fila: fila - 1, columna })
  if (fila < tablero.length - 1) vecinas.push({ fila: fila + 1, columna })
  if (columna > 0) vecinas.push({ fila, columna: columna - 1 })
  if (columna < tablero[fila].length - 1) {
    vecinas.push({ fila, columna: columna + 1 })
  }

  return vecinas
}

function contarCasillasDe(tablero: Casilla[][], jugador: Jugador): number {
  return tablero.reduce(
    (total, fila) =>
      total + fila.filter((casilla) => casilla.dueno === jugador).length,
    0,
  )
}

export function crearPartida(): EstadoPartida {
  return {
    tablero: crearTablero(),
    jugadorActual: CONFIG.JUGADOR_1,
    ganador: null,
    terminada: false,
    explosionesUltimoTurno: 0,
    ultimasExplosiones: [],
  }
}

export function tocarCasilla(
  estado: EstadoPartida,
  fila: number,
  columna: number,
): boolean {
  if (
    estado.terminada ||
    !Number.isInteger(fila) ||
    !Number.isInteger(columna) ||
    fila < 0 ||
    fila >= estado.tablero.length ||
    columna < 0 ||
    columna >= estado.tablero[fila].length
  ) {
    return false
  }

  const jugador = estado.jugadorActual
  const rival = obtenerRival(jugador)
  const casilla = estado.tablero[fila][columna]

  if (casilla.dueno !== null && casilla.dueno !== jugador) return false

  const rivalTeniaCasillas = contarCasillasDe(estado.tablero, rival) > 0
  estado.ultimasExplosiones = []
  casilla.dueno = jugador
  casilla.cargas += CONFIG.CARGAS_POR_TOQUE

  const pendientes: Posicion[] = [{ fila, columna }]
  let explosiones = 0

  while (
    pendientes.length > 0 &&
    explosiones < CONFIG.MAX_EXPLOSIONES_POR_TURNO
  ) {
    const posicion = pendientes.shift()!
    const casillaActual = estado.tablero[posicion.fila][posicion.columna]
    const vecinas = obtenerVecinas(estado.tablero, posicion)

    if (casillaActual.cargas < vecinas.length) continue

    casillaActual.cargas -= vecinas.length
    casillaActual.dueno = jugador
    explosiones += 1
    estado.ultimasExplosiones.push(posicion)

    for (const vecina of vecinas) {
      const casillaVecina = estado.tablero[vecina.fila][vecina.columna]
      casillaVecina.dueno = jugador
      casillaVecina.cargas += CONFIG.CARGAS_POR_VECINA
      pendientes.push(vecina)
    }

    if (rivalTeniaCasillas && contarCasillasDe(estado.tablero, rival) === 0) {
      estado.ganador = jugador
      estado.terminada = true
      estado.explosionesUltimoTurno = explosiones
      return true
    }
  }

  estado.explosionesUltimoTurno = explosiones

  if (!estado.terminada) {
    estado.jugadorActual = rival
  }

  return true
}

export function reiniciarPartida(estado: EstadoPartida): boolean {
  if (estado === null || typeof estado !== 'object') return false

  estado.tablero = crearTablero()
  estado.jugadorActual = CONFIG.JUGADOR_1
  estado.ganador = null
  estado.terminada = false
  estado.explosionesUltimoTurno = 0
  estado.ultimasExplosiones = []

  return true
}
