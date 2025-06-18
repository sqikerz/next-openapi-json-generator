import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import z, { type ZodType } from "zod";
import maskWithReference from "./mask";
import type { SchemaObject } from "@omer-x/openapi-types/schema";


describe("maskWithReference", () => {
  const storedSchemas: Record<string, ZodType> = {
    User: z.object({
      id: z.string(),
      name: z.string(),
    }),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a reference if schema matches a stored schema", () => {
    const schema: SchemaObject = {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
      },
      required: ["id", "name"],
      additionalProperties: false,
    };

    const result = maskWithReference(schema, storedSchemas, true);
    expect(result).toEqual({ $ref: "#/components/schemas/User" });
  });

  it("should return the schema if it contains a $ref", () => {
    const schema: SchemaObject = {
      $ref: "#/components/schemas/SomeSchema",
    };
    const result = maskWithReference(schema, storedSchemas, true);
    expect(result).toEqual(schema);
  });

  it("should process oneOf schemas", () => {
    const schema = {
      oneOf: [
        { type: "string" },
        { type: "number" },
      ],
    } as unknown as SchemaObject;
    const result = maskWithReference(schema, storedSchemas, true);
    expect(result).toEqual({
      oneOf: [
        { type: "string" },
        { type: "number" },
      ],
    });
  });

  it("should process anyOf schemas", () => {
    const schema = {
      anyOf: [
        { type: "string" },
        { type: "number" },
      ],
    } as unknown as SchemaObject;
    const result = maskWithReference(schema, storedSchemas, true);
    expect(result).toEqual({
      anyOf: [
        { type: "string" },
        { type: "number" },
      ],
    });
  });

  it("should process object schemas", () => {
    const schema: SchemaObject = {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
      },
      required: ["id", "name"],
      additionalProperties: false,
    };
    const result = maskWithReference(schema, storedSchemas, true);
    expect(result).toEqual({
      $ref: "#/components/schemas/User",
    });
  });

  it("should process array schemas", () => {
    const schema: SchemaObject = {
      type: "array",
      items: { type: "string" },
    };
    const result = maskWithReference(schema, storedSchemas, true);
    expect(result).toEqual({
      type: "array",
      items: { type: "string" },
    });
  });

  it("should process array schemas with multiple items", () => {
    const schema: SchemaObject = {
      type: "array",
      items: [
        { type: "string" },
        { type: "number" },
      ],
    };
    const result = maskWithReference(schema, storedSchemas, true);
    expect(result).toEqual({
      type: "array",
      items: [
        { type: "string" },
        { type: "number" },
      ],
    });
  });

  it("should process array schemas with a single item that references a stored schema", () => {
    const schema: SchemaObject = {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
        },
        required: ["id", "name"],
        additionalProperties: false,
      },
    };

    const result = maskWithReference(schema, storedSchemas, true);

    expect(result).toEqual({
      type: "array",
      items: {
        $ref: "#/components/schemas/User",
      },
    });
  });

  it("should process array schemas with a single primitive item", () => {
    const schema: SchemaObject = {
      type: "array",
      items: { type: "string" },
    };

    const result = maskWithReference(schema, storedSchemas, true);

    expect(result).toEqual({
      type: "array",
      items: { type: "string" },
    });
  });

  it("should handle array schema with undefined items", () => {
    const schema: SchemaObject = {
      type: "array",
      items: { type: "null" },
    };

    const result = maskWithReference(schema, storedSchemas, true);

    expect(result).toEqual({
      type: "array",
      items: { type: "null" },
    });
  });

  it("should process array schema with non-array items that is not a reference to a stored schema", () => {
    const schema: SchemaObject = {
      type: "array",
      items: {
        type: "object",
        properties: {
          customField: { type: "string" },
          anotherField: { type: "number" },
        },
        required: ["customField"],
      },
    };

    const result = maskWithReference(schema, storedSchemas, true);

    expect(result).toEqual({
      type: "array",
      items: {
        type: "object",
        properties: {
          customField: { type: "string" },
          anotherField: { type: "number" },
        },
        required: ["customField"],
      },
    });
  });

  it("should handle object schema with undefined properties", () => {
    const schema: SchemaObject = {
      type: "object",
      // properties is undefined here
    };

    const result = maskWithReference(schema, storedSchemas, true);

    expect(result).toEqual({
      type: "object",
      properties: {},
    });
  });
});
