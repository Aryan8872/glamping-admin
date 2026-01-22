import { useState } from "react";
import { ZodSchema } from "zod";

export interface FieldError {
    field: string;
    message: string;
}

export interface UseFormValidationReturn {
    errors: Record<string, string>;
    setFieldError: (field: string, message: string) => void;
    clearFieldError: (field: string) => void;
    setErrors: (errors: FieldError[]) => void;
    clearAllErrors: () => void;
    hasErrors: boolean;
    /**
     * Validates a single field against a specific Zod schema.
     * Updates error state automatically.
     * @returns true if valid, false otherwise
     */
    checkField: (field: string, value: any, schema: ZodSchema) => boolean;
}

export function useFormValidation(): UseFormValidationReturn {
    const [errors, setErrorsState] = useState<Record<string, string>>({});

    const setFieldError = (field: string, message: string) => {
        setErrorsState((prev) => ({ ...prev, [field]: message }));
    };

    const clearFieldError = (field: string) => {
        setErrorsState((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const setErrors = (errorList: FieldError[]) => {
        const errorMap: Record<string, string> = {};
        errorList.forEach((err) => {
            // Handle nested fields (e.g., "address.street") by taking the last part or keeping it as is
            // For now, we assume simple keys match or the backend sends the exact key used in frontend
            errorMap[err.field] = err.message;
        });
        setErrorsState(errorMap);
    };

    const clearAllErrors = () => {
        setErrorsState({});
    };

    const checkField = (field: string, value: any, schema: ZodSchema) => {
        try {
            schema.parse(value);
            clearFieldError(field);
            return true;
        } catch (err: any) {
            if (err.errors && err.errors[0]) {
                setFieldError(field, err.errors[0].message);
            }
            return false;
        }
    };

    return {
        errors,
        setFieldError,
        clearFieldError,
        setErrors,
        clearAllErrors,
        hasErrors: Object.keys(errors).length > 0,
        checkField,
    };
}
