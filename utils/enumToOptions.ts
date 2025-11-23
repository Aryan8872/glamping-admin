import { ReactElement } from "react";

export function enumToOptions<T extends Record<string, string | number>>(enumObj: T) {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key))) // ignore reverse mapping in numeric enums
    .map((key) => ({ label: key, value: enumObj[key] as string | number}));
}