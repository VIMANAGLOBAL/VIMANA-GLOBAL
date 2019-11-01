import {IsNotEmpty} from "class-validator";
import {
    Column,
    Entity,
    ManyToOne, ObjectType,
    PrimaryGeneratedColumn,
} from "typeorm";
import {User} from "./User";

@Entity()
export class Verification {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    @IsNotEmpty()
    public target: string;

    @Column("varchar")
    public code: string;

    @Column("timestamp")
    @IsNotEmpty()
    public expirationTimestamp: Date;

    @ManyToOne((type): ObjectType<User> => User, (user: User): Verification[] => user.verifications)
    public user: User;

    constructor(options: any = {}) {
        this.code = options.code;
        this.target = options.target;
        this.expirationTimestamp = options.expirationTimestamp;
        this.user = options.user;
    }
}
