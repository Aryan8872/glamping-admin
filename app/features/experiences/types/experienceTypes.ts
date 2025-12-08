export interface Experience {
    id: number;
    title: string;
    slug: string;
    description: string;
    icon?: File | string; // Keeping 'icon' here might be confusing if backend sent 'imageUrl'. 
    // Wait, the API returns 'imageUrl'. The Component state likely needs adjustment too.
    // Let's stick to the Schema change:
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    campSites?: any[];
}

export interface CreateExperienceValues {
    title: string;
    slug: string;
    description: string;
    imageUrl: File;
    isActive: boolean;
}

export interface UpdateExperienceValues {
    title?: string;
    slug?: string;
    description?: string;
    imageUrl?: File;
    isActive?: boolean;
}
