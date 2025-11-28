# Turnero Backend (NestJS + TypeORM + MySQL)
API REST para gestión de turnos genéricos (usuarios, recursos, disponibilidades y turnos) con soft-delete y autenticación JWT.

## Requisitos
- Node 20+
- MySQL accesible con base `turnero` (ajustar host/puerto/credenciales en `src/app.module.ts`).

## Setup
```bash
npm install
```

Copiar `.env.example` a `.env` y ajustar credenciales:
```bash
cp .env.example .env
# Edita DB_HOST/DB_PORT/DB_USER/DB_PASS/DB_NAME y JWT_SECRET/JWT_EXPIRES_IN
```

## Ejecución
```bash
# desarrollo (synchronize ON)
npm run start:dev

# producción (build + run)
npm run build && npm run start:prod
```
La API expone por defecto en `http://localhost:3000`.

## Auth
- Registro: `POST /auth/register` (nombre, apellido, email, password). Guarda `passwordHash` con bcrypt, marca `activo=true`.
- Login: `POST /auth/login` → devuelve `{ access_token, user }`.
- Uso: enviar `Authorization: Bearer <token>` en endpoints protegidos.
- Estrategias/guards: `JwtAuthGuard` se usa en `GET /usuarios` y `GET /turnos` como ejemplo (reutilizable en otros endpoints).

## Recursos principales
- Usuarios: `POST /usuarios`, `GET /usuarios`, `GET /usuarios/:id`, `DELETE /usuarios/:id` (soft delete).
- Recursos: `POST /recursos`, `GET /recursos`, `GET /recursos/:id`, `DELETE /recursos/:id`.
- Disponibilidades: `POST /recursos/:recursoId/disponibilidades`, `GET /recursos/:recursoId/disponibilidades`, `DELETE /disponibilidades/:id`.
- Turnos: `POST /turnos`, `GET /turnos` (filtros `recursoId`, `usuarioId`, `desde`, `hasta`), `GET /turnos/:id`, `DELETE /turnos/:id`.
- Slots disponibles: `GET /recursos/:recursoId/slots-disponibles?fecha=YYYY-MM-DD`.

## Reglas de negocio (turnos)
- Deben pertenecer a usuario y recurso.
- Intervalo debe caer en una disponibilidad ACTIVA del recurso (fecha, día de semana CSV 0–6, horario y múltiplo de `duracionSlotMin`).
- No puede superponerse con turnos del mismo recurso en estados `RESERVADO`/`CONFIRMADO` (soft-delete excluido).

## Soft delete
- Todas las entidades tienen `deletedAt`. Se usa `softRemove`/`softDelete`.
- Listados excluyen registros con `deletedAt` por defecto.

## Arquitectura
- Módulos: `usuarios`, `recursos`, `disponibilidades`, `turnos`, `auth`.
- DTOs con `class-validator`. Validación global con `ValidationPipe` (whitelist/forbid).
- Conexión TypeORM en `src/app.module.ts` (synchronize activado para desarrollo).

## Tests
No se incluyeron pruebas específicas para el dominio. Comandos estándar Nest:
```bash
npm run test
npm run test:e2e
npm run test:cov
```
