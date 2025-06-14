export default interface User {
    email: string;
    username: string;
    password?: string; // Optional for security reasons
    createdAt?: Date; // Optional, can be set by the server
}