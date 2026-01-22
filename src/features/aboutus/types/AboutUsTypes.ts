import z from "zod";

export const ABOUT_US_TAG = "aboutus"
export interface CoreValue {
    id: number;
    title: string
    description: string
    icon: string
}
export interface Stat {
    id: number;
    value: string;
    icon: string;
    heading: string;
}
export interface AboutUs {
    id: number,
    aboutUs: string,
    textbox_1: string,
    textbox_2: string,
    mission: string,
    vision: string,
    coreValues: CoreValue[],
    stats: Stat[]
};

const StatSchema = z.object({
    id: z.number(),
    value: z.string(),
    icon: z.string(),
    heading: z.string()
});

const CoreValueSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    icon: z.string()
});

export const AboutUsSchema = z.object({
    id: z.number(),
    aboutUs: z.string(),
    textbox_1: z.string(),
    textbox_2: z.string(),
    mission: z.string(),
    vision: z.string(),
    coreValues: z.array(CoreValueSchema),
    stats: z.array(StatSchema)
});


