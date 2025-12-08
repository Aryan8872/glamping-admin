import z from "zod";
import { MdPersonAddDisabled } from "react-icons/md";
import { MdPersonAdd } from "react-icons/md";
import { ReactElement } from "react";
import { EnumDropdownIconType } from "@/components/EnumDropdown";
import { GrUserAdmin } from "react-icons/gr";
import { RiAdminLine } from "react-icons/ri";
import { FaCampground } from "react-icons/fa";

export enum USER_TYPE {
  ADMIN = "ADMIN",
  USER = "USER",
  CAMPHOST = "CAMPHOST",
  SUPERADMIN = "SUPERADMIN",
}

export enum USER_STATUS {
  DISABLED = "DISABLED",
  ENABLED = "ENABLED",
}
export interface User {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  userType: USER_TYPE;
  userStatus: USER_STATUS;
  isFeatured?: boolean;
  hostTagline?: string;
  yearsOfExperience?: number;
}

export const UserSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  phoneNumber: z.string(),
  email: z.email(),
  userType: z.nativeEnum(USER_TYPE),
  userStatus: z.nativeEnum(USER_STATUS),
  campBookings: z.any().optional(),
  isFeatured: z.boolean().optional(),
  hostTagline: z.string().nullable().optional(),
  yearsOfExperience: z.number().nullable().optional(),
});

export const userStatusIconMap: EnumDropdownIconType[] = [
  {
    value: USER_STATUS.DISABLED,
    icon: <MdPersonAdd color="blue" className="text-lg" />,
  },
  {
    value: USER_STATUS.ENABLED,
    icon: <MdPersonAddDisabled color="blue" className="text-lg" />,
  },
];

export const userTypeIconMap: EnumDropdownIconType[] = [
  {
    value: USER_TYPE.ADMIN,
    icon: <RiAdminLine color="blue" className="text-lg" />,
  },
  {
    value: USER_TYPE.CAMPHOST,
    icon: <FaCampground color="blue" className="text-lg" />,
  },
  {
    value: USER_TYPE.SUPERADMIN,
    icon: <GrUserAdmin color="blue" className="text-lg" />,
  },
  {
    value: USER_TYPE.USER,
    icon: <MdPersonAddDisabled color="blue" className="text-lg" />,
  },
];
