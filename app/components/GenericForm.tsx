"use client";

import React, { useReducer, useEffect } from "react";
import { ZodSchema, ZodError, ZodIssue } from "zod";

// Action Types
type Action<T> =
  | { type: "SET_FIELD_VALUE"; field: keyof T; value: any }
  | { type: "SET_ERRORS"; errors: Partial<Record<keyof T, string>> }
  | { type: "RESET_FORM"; values: T }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean };

// State Type
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
}

// Reducer Function
function formReducer<T>(state: FormState<T>, action: Action<T>): FormState<T> {
  switch (action.type) {
    case "SET_FIELD_VALUE":
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined }, // Clear error on change
      };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "RESET_FORM":
      return { values: action.values, errors: {}, isSubmitting: false };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.isSubmitting };
    default:
      return state;
  }
}

export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "date"
  | "select"
  | "checkbox"
  | "textarea";

export interface FieldConfig<T> {
  name: keyof T;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string | number }[]; // For select
  required?: boolean;
  className?: string;
  render?: (props: {
    value: any;
    onChange: (value: any) => void;
    error?: string;
  }) => React.ReactNode;
}

interface GenericFormProps<T> {
  initialValues: T;
  validationSchema?: ZodSchema<T>;
  fields: FieldConfig<T>[];
  onSubmit: (values: T) => Promise<void> | void;
  title?: string;
  submitLabel?: string;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function GenericForm<T>({
  initialValues,
  validationSchema,
  fields,
  onSubmit,
  title,
  submitLabel = "Submit",
  onCancel,
  isLoading = false,
}: GenericFormProps<T>) {
  const [state, dispatch] = useReducer(formReducer, {
    values: initialValues,
    errors: {},
    isSubmitting: false,
  });

  // Update state if initialValues change (e.g., when editing and data loads)
  useEffect(() => {
    dispatch({ type: "RESET_FORM", values: initialValues });
  }, [initialValues]);

  const handleChange = (name: keyof T, value: any) => {
    dispatch({ type: "SET_FIELD_VALUE", field: name, value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_SUBMITTING", isSubmitting: true });

    let submitValues = state.values;

    // Validation
    if (validationSchema) {
      try {
        submitValues = validationSchema.parse(state.values);
        dispatch({ type: "SET_ERRORS", errors: {} });
      } catch (error) {
        if (error instanceof ZodError) {
          const zodError = error as any; // Cast to any to avoid type issues with 'errors' vs 'issues'
          const fieldErrors: Partial<Record<keyof T, string>> = {};
          // @ts-ignore
          zodError.errors.forEach((err: ZodIssue) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as keyof T] = err.message;
            }
          });
          dispatch({ type: "SET_ERRORS", errors: fieldErrors });
          dispatch({ type: "SET_SUBMITTING", isSubmitting: false });
          return;
        }
      }
    }

    try {
      await onSubmit(submitValues);
    } catch (error) {
      console.error("Form submission error", error);
    } finally {
      dispatch({ type: "SET_SUBMITTING", isSubmitting: false });
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      {title && (
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5">
          {fields.map((field) => (
            <div key={String(field.name)} className={field.className}>
              {field.render ? (
                field.render({
                  value: state.values[field.name],
                  onChange: (value) => handleChange(field.name, value),
                  error: state.errors[field.name] as string,
                })
              ) : field.type === "checkbox" ? (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={String(field.name)}
                    checked={!!state.values[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={String(field.name)}
                    className="text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                </div>
              ) : (
                <>
                  <label
                    htmlFor={String(field.name)}
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={String(field.name)}
                      value={String(state.values[field.name] || "")}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      id={String(field.name)}
                      value={String(state.values[field.name] || "")}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full p-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px]"
                    />
                  ) : (
                    <input
                      type={field.type}
                      id={String(field.name)}
                      value={
                        field.type === "date" && state.values[field.name]
                          ? new Date(state.values[field.name] as any)
                              .toISOString()
                              .split("T")[0]
                          : String(state.values[field.name] || "")
                      }
                      onChange={(e) =>
                        handleChange(
                          field.name,
                          field.type === "number"
                            ? Number(e.target.value)
                            : e.target.value
                        )
                      }
                      placeholder={field.placeholder}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  )}
                </>
              )}
              {/* Error Message */}
              {state.errors[field.name] && (
                <p className="mt-1 text-xs text-red-500">
                  {state.errors[field.name] as string}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={state.isSubmitting || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {state.isSubmitting || isLoading ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
