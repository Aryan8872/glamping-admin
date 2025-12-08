export interface Destination {
    id: number;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    isFeatured: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    campSites?: any[];
}

export interface CreateDestinationValues {
    name: string;
    slug: string;
    description: string;
    imageUrl: File;
    isFeatured: boolean;
    isActive: boolean;
}

export interface UpdateDestinationValues {
    name?: string;
    slug?: string;
    description?: string;
    imageUrl?: File;
    isFeatured?: boolean;
    isActive?: boolean;
}
