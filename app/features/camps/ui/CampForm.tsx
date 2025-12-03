"use client";
import { useReducer, useRef, useState } from "react";
import { BiPlus, BiMap } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import PrimaryFilledButton from "@/components/PrimaryFilledButton";
import SecondaryButton from "@/components/SecondaryButton";
import { CampSchema, CampFormValues, Facility } from "../types/campTypes";
import { motion } from "framer-motion";
import { getAllFacilities } from "../../facilities/services/facilityService";
import { User, USER_TYPE } from "../../users/types/UserTypes";
import { useEffect } from "react";
import { getCampHosts } from "../services/campService";

import LocationSelectorModal, { Coordinates } from "./LocationSelectorModal";
import { apiGetAllAdventures } from "../../adventures/api/adventureApi";
import { Adventure } from "../../adventures/types/adventureTypes";

const MAX_CAMP_IMAGES = 10;

type State = {
  name: string;
  description: string;
  pricePerNight: string;
  images: string[];
  newImages: File[];
  facilities: Facility[];
  hostId: number | null;
  newFacilities: { name: string; icon: string }[];
  location: string;
  latitude: number | null;
  longitude: number | null;
  selectedAdventures: Adventure[];
};

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: any }
  | { type: "ADD_IMAGE"; image: string }
  | { type: "REMOVE_IMAGE"; image: string }
  | { type: "ADD_NEW_IMAGE"; image: File }
  | { type: "RESET"; state: State }
  | { type: "ADD_NEW_FACILITIES"; newFacility: { name: string; icon: string } }
  | {
      type: "ADD_FACILITY";
      facility: Facility;
    }
  | { type: "REMOVE_FACILITY"; index: number }
  | { type: "REMOVE_NEW_FACILITY"; index: number }
  | { type: "SET_HOST"; hostId: number | null }
  | { type: "SET_HOST"; hostId: number | null }
  | { type: "SET_COORDINATES"; data: Coordinates }
  | { type: "TOGGLE_ADVENTURE"; adventure: Adventure }
  | { type: "REMOVE_ADVENTURE"; adventure: Adventure };

function formReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "ADD_IMAGE":
      return { ...state, images: [...state.images, action.image] };
    case "ADD_NEW_IMAGE":
      return {
        ...state,
        newImages: [...state.newImages, action.image],
      };
    case "REMOVE_IMAGE":
      return {
        ...state,
        images: state.images.filter((img) => img !== action.image),
      };
    case "ADD_FACILITY":
      return { ...state, facilities: [...state.facilities, action.facility] };
    case "REMOVE_FACILITY":
      return {
        ...state,
        facilities: state.facilities.filter((_, i) => i !== action.index),
      };
    case "ADD_NEW_FACILITIES":
      return {
        ...state,
        newFacilities: [...state.newFacilities, action.newFacility],
      };
    case "REMOVE_NEW_FACILITY":
      return {
        ...state,
        newFacilities: state.newFacilities.filter((_, i) => i !== action.index),
      };
    case "SET_HOST":
      return { ...state, hostId: action.hostId };
    case "SET_COORDINATES":
      return {
        ...state,
        latitude: action.data.latitude,
        longitude: action.data.longitude,
      };
    case "TOGGLE_ADVENTURE":
      const exists = state.selectedAdventures.find(
        (a) => a.id === action.adventure.id
      );
      return {
        ...state,
        selectedAdventures: exists
          ? state.selectedAdventures.filter((a) => a.id !== action.adventure.id)
          : [...state.selectedAdventures, action.adventure],
      };

    case "REMOVE_ADVENTURE":
      return {
        ...state,
        selectedAdventures: state.selectedAdventures.filter(
          (a) => a.id !== action.adventure.id
        ),
      };
    default:
      return state;
  }
}

interface CampFormProps {
  initialData?: {
    name: string;
    description: string;
    pricePerNight: number;
    images: string[];
    campSiteFacilities?: { facility: Facility }[];
    campHost?: { id: number };
    hostId?: number | null;
    location?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    adventures?: { adventure: Adventure }[];
  };
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export default function CampForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: CampFormProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableFacilities, setAvailableFacilities] = useState<Facility[]>(
    []
  );
  const [availableHosts, setAvailableHosts] = useState<User[]>([]);
  const [availableAdventures, setAvailableAdventures] = useState<Adventure[]>(
    []
  );
  const [newFacility, setNewFacility] = useState({
    name: "",
    icon: "",
  });
  const [showNewFacilityForm, setShowNewFacilityForm] = useState(false);

  const [state, dispatch] = useReducer(formReducer, {
    name: initialData?.name || "",
    description: initialData?.description || "",
    pricePerNight: initialData?.pricePerNight.toString() || "",
    images: initialData?.images || [],
    newImages: [],
    facilities: initialData?.campSiteFacilities?.map((f) => f.facility) || [],
    hostId: initialData?.hostId || initialData?.campHost?.id || null,
    newFacilities: [],
    location: initialData?.location || "",
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
    selectedAdventures: initialData?.adventures?.map((a) => a.adventure) || [],
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facilities, users, adventures] = await Promise.all([
          getAllFacilities(),
          getCampHosts(),
          apiGetAllAdventures(),
        ]);
        setAvailableFacilities(facilities || []);
        setAvailableHosts(users || []);
        setAvailableAdventures(adventures || []);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = MAX_CAMP_IMAGES - state.images.length;
    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    selectedFiles.forEach((file) => {
      dispatch({ type: "ADD_NEW_IMAGE", image: file });
      const url = URL.createObjectURL(file);
      dispatch({ type: "ADD_IMAGE", image: url });
    });
  };

  const handleSubmit = async () => {
    // Validation
    const result = CampSchema.safeParse({
      name: state.name,
      description: state.description,
      pricePerNight: state.pricePerNight,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err: any) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", state.name);
      formData.append("description", state.description);
      formData.append("pricePerNight", state.pricePerNight);

      // Append new images
      state.images.forEach((img) => {
        if (img) {
          formData.append("campImages", img);
        }
      });
      const pureExistingImages = state.images.filter(
        (img) => typeof img === "string" && !img.startsWith("blob:")
      );
      const removedImages = initialData?.images.filter(
        (img) => !pureExistingImages.includes(img)
      );
      if (removedImages) {
        formData.append("removedImages", JSON.stringify(removedImages));
      }
      formData.append("images", JSON.stringify(pureExistingImages));
      if (Array.isArray(state.newImages)) {
        state.newImages.forEach((image) => {
          if (image instanceof File) {
            formData.append("campImages", image);
          }
        });
      }

      // Append Facilities
      formData.append("facilities", JSON.stringify(state.facilities));
      formData.append("newFacilities", JSON.stringify(state.newFacilities));

      // Append Host
      if (state.hostId) {
        formData.append("hostId", state.hostId.toString());
      }

      // Append Adventures
      formData.append(
        "adventureIds",
        JSON.stringify(state.selectedAdventures.map((a) => a.id))
      );
      // Append Location Data
      if (state.location) {
        formData.append("location", state.location);
      }
      if (state.latitude !== null) {
        formData.append("latitude", state.latitude.toString());
      }
      if (state.longitude !== null) {
        formData.append("longitude", state.longitude.toString());
      }

      await onSubmit(formData);
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Camp Details Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Camp Details
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Camp Name
              </label>
              <input
                value={state.name}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "name",
                    value: e.target.value,
                  })
                }
                className={`focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg p-2.5 text-gray-700`}
                placeholder="Enter camp name"
              />
              {errors.name && (
                <span className="text-xs text-red-500">{errors.name}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Price Per Night
              </label>
              <input
                type="number"
                value={state.pricePerNight}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "pricePerNight",
                    value: e.target.value,
                  })
                }
                className={`focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                  errors.pricePerNight ? "border-red-500" : "border-gray-300"
                } rounded-lg p-2.5 text-gray-700`}
                placeholder="Enter price"
              />
              {errors.pricePerNight && (
                <span className="text-xs text-red-500">
                  {errors.pricePerNight}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={4}
                value={state.description}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "description",
                    value: e.target.value,
                  })
                }
                className={`resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-lg p-2.5 text-gray-700`}
                placeholder="Enter description"
              />
              {errors.description && (
                <span className="text-xs text-red-500">
                  {errors.description}
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="border-t border-gray-200"></div>

        {/* Location Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
          <div className="space-y-4">
            {/* Location Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Location Name / Address
              </label>
              <input
                type="text"
                value={state.location}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "location",
                    value: e.target.value,
                  })
                }
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700"
                placeholder="Enter location name (e.g. Pokhara, Nepal)"
              />
            </div>

            {/* Coordinates Section */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Map Coordinates
              </label>
              <div className="flex gap-3 items-start">
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Latitude
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={state.latitude?.toFixed(6) || ""}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-500 cursor-not-allowed"
                      placeholder="Select on map"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Longitude
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={state.longitude?.toFixed(6) || ""}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-500 cursor-not-allowed"
                      placeholder="Select on map"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="mt-6 flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                >
                  <BiMap className="w-5 h-5" />
                  Select on Map
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-gray-200"></div>

        {/* Adventures Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Adventures
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableAdventures.map((adventure) => {
              const isSelected = state.selectedAdventures.some(
                (a) => a.id === adventure.id
              );
              return (
                <div
                  key={adventure.id}
                  onClick={() =>
                    isSelected
                      ? dispatch({ type: "REMOVE_ADVENTURE", adventure })
                      : dispatch({ type: "TOGGLE_ADVENTURE", adventure })
                  }
                  className={`cursor-pointer rounded-lg border p-3 flex items-center gap-3 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-md bg-gray-200 overflow-hidden flex-shrink-0">
                    {adventure.coverImage ? (
                      <img
                        src={adventure.coverImage}
                        alt={adventure.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {adventure.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <div className="border-t border-gray-200"></div>

        {/* Facilities Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Facilities
          </h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {state.facilities.map((facility, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100"
                >
                  <span>{facility.name}</span>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FACILITY", index: idx })
                    }
                    className="hover:text-blue-900"
                  >
                    <IoClose />
                  </button>
                </div>
              ))}
              {state.newFacilities.map((facility, idx) => (
                <div
                  key={`new-${idx}`}
                  className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100"
                >
                  <span>{facility.name}</span>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_NEW_FACILITY", index: idx })
                    }
                    className="hover:text-green-900"
                  >
                    <IoClose />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <select
                  className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700 bg-white"
                  onChange={(e) => {
                    const facility = availableFacilities.find(
                      (f) => f.id === Number(e.target.value)
                    );
                    if (facility) {
                      dispatch({ type: "ADD_FACILITY", facility });
                      e.target.value = "";
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select existing facility...
                  </option>
                  {availableFacilities
                    .filter(
                      (f) =>
                        !state.facilities.some(
                          (sf) => "id" in sf && sf.id === f.id
                        )
                    )
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                </select>
              </div>
              <button
                onClick={() => setShowNewFacilityForm(!showNewFacilityForm)}
                className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <BiPlus />
                <span>Create New</span>
              </button>
            </div>

            {showNewFacilityForm && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-3 gap-4">
                <input
                  placeholder="Facility Name"
                  value={newFacility.name}
                  onChange={(e) =>
                    setNewFacility({ ...newFacility, name: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2"
                />
                <input
                  placeholder="Icon (e.g. FaWifi)"
                  value={newFacility.icon}
                  onChange={(e) =>
                    setNewFacility({ ...newFacility, icon: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (newFacility.name && newFacility.icon) {
                        dispatch({
                          type: "ADD_NEW_FACILITIES",
                          newFacility: newFacility,
                        });
                        setNewFacility({ name: "", icon: "" });
                        setShowNewFacilityForm(false);
                      }
                    }}
                    className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="border-t border-gray-200"></div>

        {/* Camp Host Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Camp Host
          </h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Assign Host
            </label>
            <select
              value={state.hostId || ""}
              onChange={(e) =>
                dispatch({
                  type: "SET_HOST",
                  hostId: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg p-2.5 text-gray-700 bg-white"
            >
              <option value="">No Host Assigned</option>
              {availableHosts.map((host) => (
                <option key={host.id} value={host.id}>
                  {host.fullName} ({host.email})
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className="border-t border-gray-200"></div>

        {/* Camp Images Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Camp Images
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {state.images.map((img, idx) => (
              <div
                key={img}
                className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
              >
                <motion.img
                  src={`${process.env.NEXT_PUBLIC_RESOLVED_API_BASE_URL}${img}`}
                  alt={`Camp ${idx}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => dispatch({ type: "REMOVE_IMAGE", image: img })}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <IoClose />
                </button>
              </div>
            ))}

            {state.images.length < MAX_CAMP_IMAGES && (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="cursor-pointer group border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg aspect-square flex flex-col justify-center items-center transition-colors"
              >
                <BiPlus
                  className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2"
                  size={32}
                />
                <span className="text-xs font-medium text-gray-500 group-hover:text-blue-500 transition-colors text-center px-2">
                  Upload Images
                </span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </section>

        {/* Footer Actions */}
        <div className="flex flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <div>
            <SecondaryButton text="Cancel" onClick={onCancel} />
          </div>
          <div>
            <PrimaryFilledButton
              text={isSubmitting ? "Saving..." : submitLabel}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onConfirm={(data) => {
          dispatch({ type: "SET_COORDINATES", data });
          setIsLocationModalOpen(false);
        }}
        initialLocation={
          state.latitude && state.longitude
            ? {
                latitude: state.latitude,
                longitude: state.longitude,
              }
            : undefined
        }
      />
    </>
  );
}
