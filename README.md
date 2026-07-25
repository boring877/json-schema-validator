# JSON Schema Validator

Validate JSON documents against **JSON Schema (Draft 2020-12)** and generate TypeScript types from those schemas. The schema is the single source of truth — runtime validation rules and TypeScript types are both derived from it, so they can never drift out of sync.

## Features

- **Draft 2020-12 schemas** — `$id`, `$defs`, cross-file `$ref`, `format`, `pattern`, `enum`, `additionalProperties`, `examples`
- **Runtime validation** with [Ajv](https://ajv.js/) — multi-file `$ref` resolution, format checks (`uuid`, `email`, `date-time`), and human-readable error reporting
- **Type generation** with [json-schema-to-typescript](https://github.com/bcherny/json-schema-to-typescript) — emits TypeScript interfaces from the schema, no manual types to maintain

## Repo layout

```
schemas/
  user.schema.json      # User schema (Draft 2020-12)
  address.schema.json   # Address subschema, referenced via $ref
data/
  valid/user.json       # document that validates cleanly
  invalid/user.json     # document that should be rejected
src/
  validate.ts           # loads schemas, validates data/, prints errors
  generate-types.ts     # compiles the schema into src/types/user.ts
```

## Usage

Requirements: Node 18+ (or [Bun](https://bun.sh)/tsx).

```bash
npm install
npm run validate          # validate the documents under data/
npm run generate-types    # write src/types/user.ts from schemas/user.schema.json
npm run build             # type-check with tsc
```

## The schema

`schemas/user.schema.json` uses the modern Draft 2020-12 vocabulary:

| Feature | Where |
|---|---|
| `type` + `required` | root |
| `additionalProperties: false` | locks the object down |
| `format: uuid / email / date-time` | `id`, `email`, `createdAt` |
| `pattern`, `minLength`, `maxLength` | `username` |
| `minimum` / `maximum` | `age` |
| `enum` | `role` |
| `uniqueItems` | `tags` |
| `$ref` to another schema file | `address` → `address.schema.json` |
| `examples` | bottom of the file |

## Validation output

Invalid documents produce a structured error for every violated constraint, with the instance path and the failing params:

```
=== Should FAIL ===
  ✗ user.json
      • [(root)] must NOT have additional properties
        params: {"additionalProperty":"extraUnknownField"}
      • [/id] must match format "uuid"
      • [/email] must match format "email"
      • [/role] must be equal to one of the allowed values
        params: {"allowedValues":["admin","editor","viewer"]}
      ...
```

## Why JSON Schema?

It's the de facto language for API contracts: language-agnostic, the foundation of OpenAPI 3.1 (which adopted Draft 2020-12 wholesale), and lets you generate docs, types, mock data, and validators from one artifact.

## Links

- JSON Schema spec — https://json-schema.org/
- Understanding JSON Schema — https://json-schema.org/understanding-json-schema
- Ajv docs — https://ajv.js.org/
- json-schema-to-typescript — https://github.com/bcherny/json-schema-to-typescript

## License

MIT
