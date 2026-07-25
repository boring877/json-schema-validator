# JSON Schema Example

A small, self-contained project demonstrating how I work with **JSON Schema (Draft 2020-12)** in practice:

- ✍️ Authoring schemas with the modern Draft 2020-12 vocabulary (`$id`, `$defs`, `$ref`, `format`, `pattern`, `enum`, `additionalProperties`, …)
- 🔍 **Runtime validation** of JSON documents with [Ajv](https://ajv.js/) — including `$ref` resolution across multiple files and meaningful error reporting
- 🏭 **Type generation** from the schema with [json-schema-to-typescript](https://github.com/bcherny/json-schema-to-typescript) — the schema is the single source of truth, TypeScript types are generated from it

## Repo layout

```
schemas/
  user.schema.json      # User schema (Draft 2020-12)
  address.schema.json   # Address subschema, referenced via $ref
data/
  valid/user.json       # should validate ✅
  invalid/user.json     # should be rejected ✅
src/
  validate.ts           # loads schemas, validates data/, prints errors
  generate-types.ts     # compiles the schema into src/types/user.ts
```

## Quick start

```bash
npm install
npm run validate          # validate the sample data
npm run generate-types    # write src/types/user.ts
```

You'll need Node 18+ (or [Bun](https://bun.sh)/tsx).

## The schema in one screenshot

`schemas/user.schema.json` exercises the features most teams care about:

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

## Why JSON Schema?

It's the lingua franca of API contracts: language-agnostic, supported by OpenAPI 3.1 (which adopted Draft 2020-12 wholesale), and lets you generate docs, types, mock data, and validators from one artifact. Keeping the schema as the source of truth means the TS types, the validation rules and the API docs can't drift out of sync.

## Useful links

- JSON Schema spec — https://json-schema.org/
- Understanding JSON Schema (book) — https://json-schema.org/understanding-json-schema
- Ajv docs — https://ajv.js.org/
- json-schema-to-typescript — https://github.com/bcherny/json-schema-to-typescript

## License

MIT
