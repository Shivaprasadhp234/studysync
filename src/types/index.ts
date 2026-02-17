export type Resource = {
    id: string;
    title: string;
    resource_type: string;
    subject: string;
    semester: string;
    branch: string;
    file_url: string;
    privacy: "public" | "private";
    created_at: string;
    description?: string;
    avg_rating?: number;
    total_reviews?: number;
    uploader: {
        full_name: string;
        college_name?: string;
    } | null;
};

export interface GetResourcesParams {
    search?: string;
    semester?: string;
    branch?: string;
    resource_type?: string;
    sortBy?: string;
}
