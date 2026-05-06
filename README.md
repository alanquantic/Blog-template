# 01 · Blog Template

Plantilla reutilizable para todos los blogs que migran desde WordPress.

**Stack:** Payload CMS 3 + Next.js 16 + Postgres (Neon).

> Esta plantilla es la base. Para cada blog real (cliente / sitio), se duplica esta
> carpeta y se personalizan estilos, componentes, branding y SEO.

---

## Decisión de stack

### Por qué Payload CMS 3 (y no otra cosa)

| Requisito del proyecto | Payload 3 lo cumple |
|---|---|
| Editor visual tipo Gutenberg para crear posts | Sí — Lexical rich-text + bloques reutilizables |
| Usuarios y roles | Sí — `admin`, `editor`, `author` configurados |
| Postgres / Neon | Sí — adaptador `@payloadcms/db-postgres` oficial |
| Despliegue Vercel | Sí — backend + frontend en mismo Next.js (monorepo) |
| Sin metadatos basura de WP | Sí — schema lo defines tú |
| Reutilizable por sitio | Sí — clonas y cambias colecciones/estilos |
| Drafts, preview, SEO, sitemap, redirects | Sí — plugins oficiales preconfigurados |

### Alternativas evaluadas y descartadas

- **Sanity / Contentlayer / Outstatic** — no usan Postgres, rompen el plan de Neon.
- **Tina CMS** — basado en Git/MDX, no escala con muchos posts y users limitado.
- **Ghost** — backend Node propio con SQLite/MySQL, no Postgres-first.
- **Strapi** — válido pero pesado y con menos integración Next.js que Payload 3.
- **Next.js Blog Starter `vercel/blog-starter`** — demasiado básico, sin users ni editor.

---

## Estructura

```
01-blog-template/
├── src/
│   ├── access/                      # Reusable access-control predicates
│   │   ├── anyone.ts                # Public read
│   │   ├── authenticated.ts         # Any logged-in user
│   │   ├── authenticatedOrPublished.ts  # Drafts hidden from public
│   │   └── isAdmin.ts               # Admin role only
│   ├── blocks/                      # Reusable Layout Builder blocks
│   │   ├── Archive/config.ts
│   │   ├── CallToAction/config.ts
│   │   ├── Code/config.ts
│   │   ├── Content/config.ts
│   │   ├── Hero/config.ts
│   │   └── MediaBlock/config.ts
│   ├── collections/
│   │   ├── Categories.ts
│   │   ├── Media.ts
│   │   ├── Pages.ts
│   │   ├── Posts.ts
│   │   ├── Tags.ts
│   │   └── Users.ts                 # With roles: admin | editor | author
│   ├── fields/
│   │   └── slug.ts                  # Reusable auto-slug field
│   ├── app/
│   │   ├── (frontend)/              # Public-facing Next.js pages
│   │   └── (payload)/               # Admin panel + REST/GraphQL APIs
│   ├── payload.config.ts            # Postgres adapter + plugins (SEO, redirects, search)
│   └── payload-types.ts             # Auto-generated; regenerate after install
├── .env.example
├── package.json
└── README.md
```

---

## Setup local

### 1. Crear DB en Neon

1. Crear proyecto en https://console.neon.tech
2. Copiar el **connection string** (formato `postgresql://...`).
3. Para desarrollo local conviene la cadena **non-pooled** para que las migraciones de
   Payload no fallen.

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con:

- `DATABASE_URL` — connection string de Neon.
- `PAYLOAD_SECRET` — genera uno con `openssl rand -base64 48`.
- `NEXT_PUBLIC_SERVER_URL` — `http://localhost:3000` en local.

### 3. Instalar y arrancar

```bash
npm install
npm run generate     # Generate importMap + payload-types from the current config
npm run dev
```

Abre http://localhost:3000/admin para crear el primer usuario admin.

> **Importante** — `npm run generate` es **obligatorio** la primera vez y **cada vez que**
> agregues / quites plugins, cambies features del editor Lexical, o agregues colecciones
> con campos custom. Si lo olvidas verás errores en consola del estilo:
>
> ```
> getFromImportMap: PayloadComponent not found in importMap ...
> ```
>
> El comando agrupa dos sub-comandos:
> - `generate:importmap` → registra los componentes RSC/Client de plugins y editores en
>   `src/app/(payload)/admin/importMap.js` (Next.js no permite imports dinámicos en RSC,
>   así que Payload usa un import map estático).
> - `generate:types` → regenera `src/payload-types.ts` con los tipos de las colecciones.

---

## Qué viene preconfigurado

### Colecciones

- **Users** — auth + roles (`admin`, `editor`, `author`). Solo admin puede crear/editar
  otros usuarios; cada usuario puede editar su propio perfil.
- **Posts** — título, excerpt, hero image, rich-text Lexical, bloques embebidos
  opcionales, categorías, tags, autores, `publishedAt`, drafts con autosave +
  schedule publish, slug auto-generado.
- **Pages** — título, layout libre con bloques (Hero / Content / MediaBlock / CTA /
  Archive / Code), drafts, slug auto.
- **Categories** y **Tags** — taxonomías con slug.
- **Media** — uploads con tamaños responsive (thumbnail / card / tablet / desktop),
  alt text obligatorio.

### Bloques (Layout Builder)

| Bloque | Para qué sirve |
|---|---|
| `Hero` | Sección principal con heading, subheading, imagen y hasta 2 CTAs |
| `Content` | Bloque de texto rico Lexical con headings y links |
| `MediaBlock` | Imagen/video con caption |
| `CallToAction` | Sección de CTA simple |
| `Archive` | Listado de posts (auto por categoría/limit, o selección manual) |
| `Code` | Bloque de código con lenguaje seleccionable |

### Plugins activos

- `@payloadcms/plugin-seo` — campos SEO (meta title, description, OG image) en `posts`
  y `pages`. Auto-genera title desde el campo `title`.
- `@payloadcms/plugin-redirects` — gestionar redirects 301 desde el admin (clave para
  preservar SEO al migrar de WordPress).
- `@payloadcms/plugin-search` — colección `search` con índice de posts y pages.

---

## Cómo "forkear" para un blog real

```bash
cp -r 01-blog-template ../mis-blogs/blog-cliente-foo
cd ../mis-blogs/blog-cliente-foo
# Cambiar package.json -> name
# Crear nueva DB en Neon y nuevo .env
# Personalizar src/app/(frontend)/ con el branding del cliente
# Levantar: npm install && npm run dev
```

> **No tocar** las colecciones del template salvo que el cambio aplique a TODOS los
> blogs futuros. Si un cliente necesita una colección extra, agrégala en su fork, no
> aquí.

---

## Despliegue (Vercel)

1. Push el fork a GitHub.
2. Importar repo en Vercel.
3. Setear las variables de entorno (`DATABASE_URL`, `PAYLOAD_SECRET`,
   `NEXT_PUBLIC_SERVER_URL`).
4. Deploy. La primera vez Vercel correrá las migraciones de Payload contra Neon
   automáticamente.

> **Storage de medios**: en producción NO uses el filesystem local. Conecta
> `@payloadcms/storage-vercel-blob` o `@payloadcms/storage-s3` (R2/S3) — es el siguiente
> paso recomendado al deployar.

---

## Troubleshooting

| Síntoma | Causa probable | Solución |
|---|---|---|
| `Error: getaddrinfo ENOTFOUND ep-xxx-pooler.aws.neon.tech` durante migraciones | Estás usando el connection string `pooled` y las migraciones no soportan PgBouncer | Usa el string **non-pooled** (sin `-pooler`) para el primer arranque |
| `relation "_payload_migrations" does not exist` se queda en bucle | Faltan extensiones Postgres en Neon | En el SQL editor de Neon: `CREATE EXTENSION IF NOT EXISTS pg_trgm;` |
| `PAYLOAD_SECRET is not set` aunque está en `.env` | Lanzaste `npm run dev` desde otro directorio | Asegúrate de estar en la raíz de la plantilla |
| `EADDRINUSE :3000` | Otro proceso ocupa el puerto | `npm run dev -- -p 3001` o cierra el otro proceso |
| `getFromImportMap: PayloadComponent not found in importMap ...` | Cambiaste plugins / features Lexical / colecciones y no regeneraste el import map | `npm run generate` y reinicia el dev server (Ctrl+C → `npm run dev`) |
| El admin carga pero al guardar un post falla por tipos | `payload-types.ts` desfasado | `npm run generate:types` y reinicia |

---

## Próximos pasos pendientes

- [ ] Agregar adapter de storage para producción (Vercel Blob o S3/R2).
- [ ] Configurar email para `forgot password` (Resend o similar).
- [ ] Definir frontend público real (rutas `/`, `/posts/[slug]`, `/pages/[slug]`,
      `/categories/[slug]`, `/tags/[slug]`) — esto se hace por blog, no en el template.
- [ ] Conectar plugin `@payloadcms/live-preview-react` cuando los frontends reales
      estén implementados.
