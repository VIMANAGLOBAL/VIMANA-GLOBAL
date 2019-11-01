import {Column, Entity, OneToOne, PrimaryGeneratedColumn, ObjectType, ManyToOne, JoinColumn} from "typeorm";
import {IsNotEmpty} from "class-validator";
import {User} from "./User";
import {Verification} from "./Verification";

@Entity()
export class Kyc {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar", {unique: true})
    @IsNotEmpty()
    public applicantId: string;

    @Column("varchar")
    public checkId: string;

    @Column("simple-array")
    public documentIds: string[];

    @Column("boolean", {default: false})
    @IsNotEmpty()
    public inProgress: boolean;

    @Column("boolean", {default: false})
    public passed: boolean;

    @OneToOne((type): ObjectType<User> => User, (user: User): Kyc => user.kyc)
    @JoinColumn()
    public user: User;

    constructor(options: any = {}) {
        this.applicantId = options.applicantId;
        this.checkId = options.checkId;
        this.inProgress = options.inProgress;
        this.passed = false;
        this.documentIds = options.documentIds || [];
        this.user = options.user;
    }
}
