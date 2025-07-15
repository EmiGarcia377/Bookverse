export type uuid = `${string}-${string}-${string}-${string}` | `${string}-${string}-${string}-${string}-${string}`;
export default interface User {
    message?: string | undefined;
    userId: uuid | null;
    email?: string;
    biography?: string;
    username: string | null;
    fullName: string | null;
    followers?: number;
    following?: number;
}