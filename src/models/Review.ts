import { uuid } from "./User";

export default interface Review {
    id: uuid | null;
    user_id: uuid | null;
    full_name: string;
    username: string;
    profilepic_url?: string | null;
    title: string;
    score: number;
    content: string;
    like_count?: number;
    liked_by_current_user?: boolean;
    saved_count?: number;
    saved_by_current_user?: boolean;
    comments_count?: number;
    reviews?: Review[];
}