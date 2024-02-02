import { authenticate as generateAuthentiate } from "middleware";
import {UserDto} from "../utils/types";
import {prisma} from "../utils/objects";
import logger from "logger";

const authenticate = generateAuthentiate<UserDto>(prisma, logger);
export default authenticate;