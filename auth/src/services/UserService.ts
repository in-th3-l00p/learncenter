import {ServiceError} from "types";
import {prisma} from "../utils/connections";
import bcrypt from "bcrypt";
import logger from "logger";
import Amqp from "streaming";
import {EventType} from "streaming/src/event";
import {User} from "@prisma/client";
import {UserDto} from "types/src/dtos";

interface IUserService {
    getUserById(id: number): Promise<UserDto>;
    getUserByEmail(email: string): Promise<UserDto>;
    createUser(
        username: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phone: string
    ): Promise<UserDto>;
    updateUser(
        id: number,
        username: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phone: string
    ): Promise<UserDto>;
    deleteUser(id: number): Promise<void>;
    searchUsers(query: string): Promise<UserDto[]>;
    userToUserDto(user: User): UserDto;
}

class UserService implements IUserService {
    async createUser(
        username: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        phone: string
    ): Promise<UserDto> {
        const user = await prisma.user.create({
            data: {
                username, email, phone, firstName, lastName,
                password: bcrypt.hashSync(password, 10)
            }
        })
        if (!user)
            throw new ServiceError(500, [{msg: "Failed to create user."}]);
        const userDto: UserDto = this.userToUserDto(user);
        (async () => {
            logger.info("Created user: " + JSON.stringify(userDto));

            Amqp.getInstance().publish({
                type: EventType.USER_CREATED,
                data: userDto
            });
        })()
            .catch(err => logger.error("Failed to publish user created event: " + err));

        return userDto;
    }

    async deleteUser(id: number): Promise<void> {
        if (await prisma.user.count({where: {id}}) === 0)
            throw new ServiceError(404, [{msg: "User not found"}]);
        await prisma.user.delete({where: {id}});
    }

    async getUserByEmail(email: string): Promise<UserDto> {
        const user = await prisma.user.findUnique(
            {where: {email}}
        );
        if (!user)
            throw new ServiceError(404, [{msg: "User not found"}]);
        return this.userToUserDto(user);
    }

    async getUserById(id: number): Promise<UserDto> {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user)
            throw new ServiceError(404, [{msg: "User not found"}]);
        return this.userToUserDto(user);
    }

    async searchUsers(query: string): Promise<UserDto[]> {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    {username: {contains: query, mode: "insensitive"}},
                    {firstName: {contains: query, mode: "insensitive"}},
                    {lastName: {contains: query, mode: "insensitive"}},
                ]
            }
        });
        return users.map(this.userToUserDto);
    }

    async updateUser(
        id: number,
        username: string,
        firstName: string,
        lastName: string,
        phone: string
    ): Promise<UserDto> {
        const currentUser = await prisma.user.findUnique({
            where: { id }
        });
        if (!currentUser)
            throw new ServiceError(404, [{msg: "User not found"}]);
        if (currentUser.username !== username) {
            if (await prisma.user.count({ where: { username } }))
                throw new ServiceError(400, [{
                    path: "username",
                    msg: "Username already exists."
                }]);
        }
        const user = await prisma.user.update({
            where: {id},
            data: {
                phone, firstName, lastName,
                username: currentUser.username === username ?
                    undefined : username
            }
        });
        if (!user)
            throw new ServiceError(404, [{msg: "User not found"}]);
        (async () => {
            logger.info("Updated user: " + JSON.stringify(user));

            Amqp.getInstance().publish({
                type: EventType.USER_UPDATED,
                data: this.userToUserDto(user)
            });
        })()
            .catch(err => logger.error("Failed to publish user created event: " + err));

        return this.userToUserDto(user);
    }

    async changePassword(
        id: number,
        currentPassword: string,
        password: string
    ) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { password: true }
        });
        if (!user)
            throw new ServiceError(404, [{msg: "User not found"}]);
        if (!bcrypt.compareSync(currentPassword, user.password))
            throw new ServiceError(400, [{
                path: "currentPassword",
                msg: "Incorrect current password"
            }]);

        logger.info("Changing password for user: " + id);
        await prisma.user.update({
            where: { id },
            data: {
                password: bcrypt.hashSync(password, 10)
            }
        });
    }

    userToUserDto(user: User): UserDto {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            createdAt: user.createdAt
        };
    }
}

const userService = new UserService();
export default userService;