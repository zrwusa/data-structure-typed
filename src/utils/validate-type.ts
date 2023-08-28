import {z} from 'zod';
import {NonNumberNonObjectButDefined, ObjectWithNonNumberId, ObjectWithNumberId, ObjectWithoutId} from './types';


export const nonNumberNonObjectButDefinedSchema = z.union([z.string(),
    z.boolean(), z.any()])
    .nullable()

export const keyValueObjectSchema = z.record(z.unknown())

export const objectWithoutIdSchema = keyValueObjectSchema.refine(obj => !('id' in obj), {
    message: 'Object cannot contain the \'id\' field',
});

export const keyValueObjectWithIdSchema = z.record(z.any()).and(
    z.object({
        id: z.union([z.string(), z.number(), z.any()])
    })
)

export const objectWithNonNumberIdSchema = z.record(z.any()).and(
    z.object({
        id: z
            .union([z.string(), z.boolean(), z.any(), z.any(), z.undefined()])
            .nullable()
    })
)

export const objectWithNumberIdSchema = z.record(z.any()).and(
    z.object({
        id: z.number()
    })
)

export const binaryTreeNodeValWithId = z.union([
    nonNumberNonObjectButDefinedSchema,
    objectWithoutIdSchema,
    objectWithNonNumberIdSchema,
    objectWithNumberIdSchema
])

export function parseBySchema(schema: z.Schema, val: any) {
    try {
        schema.parse(val);
        return true;
    } catch (error) {
        return false;
    }
}

export function isNonNumberNonObjectButDefined(val: any): val is NonNumberNonObjectButDefined {
    return parseBySchema(nonNumberNonObjectButDefinedSchema, val);
}

export function isObjectWithoutId(val: any): val is ObjectWithoutId {
    return parseBySchema(objectWithoutIdSchema, val);
}

export function isObjectWithNonNumberId(val: any): val is ObjectWithNonNumberId {
    return parseBySchema(objectWithNonNumberIdSchema, val);
}

export function isObjectWithNumberId(val: any): val is ObjectWithNumberId {
    return parseBySchema(objectWithNonNumberIdSchema, val);
}

export function isNumber(val: any): val is number {
    return typeof val === 'number';
}