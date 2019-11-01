import {IsNotEmpty} from "class-validator";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Code {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    public code: string;

    @Column("varchar", {nullable: false, unique: true})
    public email: string;

    @Column("varchar", {nullable: false, default: ""})
    @IsNotEmpty()
    public name: string;

    @Column("varchar", {nullable: false, default: ""})
    @IsNotEmpty()
    public contactName: string;

    @Column("varchar", {nullable: false, default: ""})
    @IsNotEmpty()
    public contactPhone: string;

    @Column("varchar", {nullable: false, default: ""})
    @IsNotEmpty()
    public contactMail: string;

    @Column("timestamp")
    @IsNotEmpty()
    public expirationTimestamp: Date;

    constructor(options: any = {}) {
        this.code = options.code;
        this.name = options.name;
        this.email = options.email;
        this.contactName = options.contactName;
        this.contactMail = options.contactMail;
        this.contactPhone = options.contactPhone;
        this.expirationTimestamp = options.expirationTimestamp;
    }
}
