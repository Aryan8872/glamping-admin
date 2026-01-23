"use client";

import { toast } from "react-toastify";

import { useReducer, useState } from "react";
import { IoClose } from "react-icons/io5";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { createUser } from "../services/userService";
import { USER_STATUS, USER_TYPE } from "../types/UserTypes";
import { useFormValidation } from "@/hooks/useFormValidation";
import { userSchema } from "@/lib/validation/userValidation";
import { FormInput } from "@/components/forms/FormInput";
import { useRef } from "react";
import { buildImageUrl } from "@/lib/http/http";
import { BiUser, BiPlus } from "react-icons/bi";

interface AddUserProps {
  onClose: () => void;
  onSuccess: () => void;
}

type State = {
  fullName: string;
  phoneNumber: string;
  email: string;
  userType: USER_TYPE;
  userStatus: USER_STATUS;
  isFeatured: boolean;
  hostTagline: string;
  yearsOfExperience: number;
  profilePicture: File | null;
};

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "RESET" };

const initialState: State = {
  fullName: "",
  phoneNumber: "",
  email: "",
  userType: USER_TYPE.USER,
  userStatus: USER_STATUS.ENABLED,
  isFeatured: false,
  hostTagline: "",
  yearsOfExperience: 0,
  profilePicture: null,
};

function formReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function AddUser({ onClose, onSuccess }: AddUserProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const {
    errors,
    setErrors,
    clearAllErrors,
    checkField,
    clearFieldError,
    setFieldError,
  } = useFormValidation();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof State, value: any) => {
    dispatch({ type: "SET_FIELD", field, value });
    if (field in userSchema.shape) {
      checkField(
        field,
        value,
        userSchema.shape[field as keyof typeof userSchema.shape],
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGeneralError("");
    clearAllErrors();

    // Client-side validation
    const result = userSchema.safeParse({
      fullName: state.fullName,
      email: state.email,
      phoneNumber: state.phoneNumber,
      userType: state.userType,
      userStatus: state.userStatus,
      isFeatured: state.isFeatured,
      hostTagline: state.hostTagline,
      yearsOfExperience: state.yearsOfExperience,
    });

    if (!result.success) {
      const fieldErrors = result.error.issues.map((e) => ({
        field: e.path[0] as string,
        message: e.message,
      }));
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", state.fullName);
      formData.append("email", state.email);
      formData.append("phoneNumber", state.phoneNumber);
      formData.append("userType", state.userType);
      formData.append("userStatus", state.userStatus);

      if (state.profilePicture) {
        formData.append("profilePicture", state.profilePicture);
      }

      if (state.userType === USER_TYPE.CAMPHOST) {
        formData.append("isFeatured", String(state.isFeatured));
        if (state.hostTagline)
          formData.append("hostTagline", state.hostTagline);
        if (state.yearsOfExperience)
          formData.append(
            "yearsOfExperience",
            state.yearsOfExperience.toString(),
          );
      }

      await createUser(formData);
      toast.success("User created successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to create user:", error);

      let errorMessage = "Failed to create user";

      // If it's a backend validation error (400)
      if (error.body?.errors) {
        setErrors(error.body.errors);
        return;
      }

      // Try to extract a clean message from different possible error structures
      const rawMessage = error.body?.message || error.message;

      if (typeof rawMessage === "string") {
        if (
          rawMessage.includes(
            "Unique constraint failed on the fields: (`email`)",
          )
        ) {
          errorMessage = "A user with this email already exists.";
        } else if (rawMessage.includes("Unique constraint failed")) {
          errorMessage = "A record with these details already exists.";
        } else if (rawMessage.includes("Internal Server Error")) {
          errorMessage =
            "Something went wrong on the server. Please try again later.";
        } else {
          // Clean up Prisma technical details if any
          errorMessage =
            rawMessage
              .replace(
                /\n|Invalid `prisma\..*?` invocation:|Unique constraint failed on the fields:.*?/g,
                "",
              )
              .trim() || rawMessage;
        }
      } else if (typeof rawMessage === "object") {
        errorMessage = JSON.stringify(rawMessage);
      }

      setGeneralError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-[500px] max-w-full overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-in fade-in slide-in-from-bottom-10 duration-300">
        <div className="sticky top-0 z-30 flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="flex flex-col">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Add New User
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Create a new account for the system
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-all group active:scale-95"
            aria-label="Close modal"
          >
            <IoClose
              size={28}
              className="text-slate-400 group-hover:text-slate-900 transition-colors"
            />
          </button>
        </div>

        {generalError && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <FormInput
              label="Full Name"
              required
              value={state.fullName}
              error={errors.fullName}
              onChange={(e) => handleFieldChange("fullName", e.target.value)}
              onBlur={() =>
                checkField(
                  "fullName",
                  state.fullName,
                  userSchema.shape.fullName,
                )
              }
              placeholder="John Doe"
            />
          </div>

          <div>
            <FormInput
              label="Email"
              type="email"
              required
              value={state.email}
              error={errors.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              onBlur={() =>
                checkField("email", state.email, userSchema.shape.email)
              }
              placeholder="john@example.com"
            />
          </div>

          <div>
            <FormInput
              label="Phone Number"
              type="tel"
              required
              value={state.phoneNumber}
              error={errors.phoneNumber}
              onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
              onBlur={() =>
                checkField(
                  "phoneNumber",
                  state.phoneNumber,
                  userSchema.shape.phoneNumber,
                )
              }
              placeholder="+1234567890"
            />
          </div>

          <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm">
                {state.profilePicture ? (
                  <img
                    src={URL.createObjectURL(state.profilePicture)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BiUser size={48} className="text-gray-300" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              >
                <BiPlus size={18} />
              </button>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profile Photo
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "profilePicture",
                  value: e.target.files?.[0] || null,
                })
              }
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={state.userType}
                onChange={(e) => handleFieldChange("userType", e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value={USER_TYPE.USER}>User</option>
                <option value={USER_TYPE.ADMIN}>Admin</option>
                <option value={USER_TYPE.CAMPHOST}>Camp Host</option>
                <option value={USER_TYPE.SUPERADMIN}>Super Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={state.userStatus}
                onChange={(e) =>
                  handleFieldChange("userStatus", e.target.value)
                }
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value={USER_STATUS.ENABLED}>Enabled</option>
                <option value={USER_STATUS.DISABLED}>Disabled</option>
              </select>
            </div>
          </div>

          {state.userType === USER_TYPE.CAMPHOST && (
            <>
              <div className="col-span-2 border-t border-gray-100 pt-4 mt-2">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Camp Host Details
                </h4>
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.isFeatured}
                    onChange={(e) =>
                      handleFieldChange("isFeatured", e.target.checked)
                    }
                    className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Featured (Show on Homepage)
                  </span>
                </label>
              </div>

              <div>
                <FormInput
                  label="Host Tagline"
                  value={state.hostTagline}
                  error={errors.hostTagline}
                  onChange={(e) =>
                    handleFieldChange("hostTagline", e.target.value)
                  }
                  onBlur={() =>
                    checkField(
                      "hostTagline",
                      state.hostTagline,
                      userSchema.shape.hostTagline,
                    )
                  }
                  placeholder="e.g. Mountain Guide"
                />
              </div>

              <div>
                <FormInput
                  label="Years of Experience"
                  type="number"
                  value={state.yearsOfExperience}
                  error={errors.yearsOfExperience}
                  onChange={(e) =>
                    handleFieldChange(
                      "yearsOfExperience",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  onBlur={() =>
                    checkField(
                      "yearsOfExperience",
                      state.yearsOfExperience,
                      userSchema.shape.yearsOfExperience,
                    )
                  }
                  min={0}
                />
              </div>
            </>
          )}
        </form>

        <div className="p-5 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 bg-slate-50/50">
          <div className="hidden sm:block">
            <SecondaryButton text="Cancel" onClick={onClose} />
          </div>
          <div className="w-full sm:w-auto">
            <PrimaryFilledButton
              text={isSubmitting ? "Creating..." : "Create User"}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
