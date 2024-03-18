import {UserInstitutionRole} from "./index";

export type UserDto = {
    id: number;

    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;

    createdAt: Date;
}

export type PublicUserDto = {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
}

export function userToPublicUserDto(user: UserDto): PublicUserDto {
    return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    }
}

export type InstitutionDto = {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    usersAmount: number;
    ownerId: number;
}
export type UserInstitutionDto = {
    id: number;
    user?: UserDto;
    institution?: InstitutionDto;
    userId?: number;
    institutionId?: number;
    role: UserInstitutionRole;
    createdAt: Date;
}
export type PackageDto = {
    id: string;
    name: string;
    description?: string;

    newClassroomsAmount: number;
    newUsersAmount: number;
}