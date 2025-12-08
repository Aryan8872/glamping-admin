"use client";

import { useReducer, useState } from "react";
import { IoClose } from "react-icons/io5";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { createUser } from "../services/userService";
import { USER_STATUS, USER_TYPE } from "../types/UserTypes";

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
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
            state.yearsOfExperience.toString()
          );
      }

      await createUser(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[500px] max-w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Add New User</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoClose size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={state.fullName}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "fullName",
                  value: e.target.value,
                })
              }
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={state.email}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "email",
                  value: e.target.value,
                })
              }
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={state.phoneNumber}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "phoneNumber",
                  value: e.target.value,
                })
              }
              required
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "profilePicture",
                  value: e.target.files?.[0] || null,
                })
              }
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={state.userType}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "userType",
                    value: e.target.value,
                  })
                }
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
                  dispatch({
                    type: "SET_FIELD",
                    field: "userStatus",
                    value: e.target.value,
                  })
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
                      dispatch({
                        type: "SET_FIELD",
                        field: "isFeatured",
                        value: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Featured (Show on Homepage)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Host Tagline
                </label>
                <input
                  type="text"
                  value={state.hostTagline}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "hostTagline",
                      value: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Mountain Guide"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={state.yearsOfExperience}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "yearsOfExperience",
                      value: parseInt(e.target.value) || 0,
                    })
                  }
                  min={0}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </>
          )}
        </form>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <SecondaryButton text="Cancel" onClick={onClose} />
          <PrimaryFilledButton
            text={isSubmitting ? "Creating..." : "Create User"}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
