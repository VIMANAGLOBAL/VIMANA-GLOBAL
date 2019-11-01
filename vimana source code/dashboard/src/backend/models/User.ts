import {IsNotEmpty} from "class-validator";
import {
    Column,
    Entity,
    ObjectType,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import {Verification} from "./Verification";
import {Kyc} from "./Kyc";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    @IsNotEmpty()
    public firstName: string;

    @Column("varchar")
    @IsNotEmpty()
    public lastName: string;

    @Column("varchar", {unique: true})
    @IsNotEmpty()
    public email: string;

    @Column("varchar")
    @IsNotEmpty()
    public password: string;

    @Column("varchar")
    @IsNotEmpty()
    public country: string;

    @Column("varchar", {default: ""})
    public address: string;

    @Column("varchar", {default: ""})
    public city: string;

    @Column("varchar", {default: ""})
    public state: string;

    @Column("varchar", {default: ""})
    public zipCode: string;

    @Column("varchar", {default: ""})
    public phone: string;

    @Column("simple-array", {default: ["INDIVIDUAL"]})
    @IsNotEmpty()
    public description: string[];

    @Column("boolean", {default: false})
    @IsNotEmpty()
    public verified: boolean;

    @Column("boolean", {default: false})
    @IsNotEmpty()
    public confirmed: boolean;

    @Column("boolean", {default: false})
    @IsNotEmpty()
    public passedKyc: boolean;

    @Column("boolean", {default: false})
    @IsNotEmpty()
    public enabled2fa: boolean;

    @Column("varchar", {unique: true})
    public secret2fa: string;

    @Column("boolean", {default: false})
    public vipUser: boolean;

    @Column("varchar", {nullable: true, default: 0})
    public investmentAmount: string;

    @Column("varchar", {nullable: true, default: "ETH"})
    public investmentCurrency: string;

    @OneToOne((type): ObjectType<Kyc> => Kyc, (kyc: Kyc): User => kyc.user)
    public kyc: Kyc;

    @OneToMany((type): ObjectType<Verification> => Verification, (verification: Verification): User => verification.user)
    public verifications: Verification[];

    constructor(options: any = {}) {
        this.firstName = options.firstName;
        this.lastName = options.lastName;
        this.email = options.email;
        this.password = options.password;
        this.country = options.country;
        this.address = options.address;
        this.city = options.city;
        this.state = options.state;
        this.zipCode = options.zipCode;
        this.phone = options.phone;
        this.description = options.description;
        this.secret2fa = options.secret2fa;
        this.verified = false;
        this.confirmed = false;
        this.enabled2fa = false;
        this.passedKyc = false;
        this.vipUser = options.vipUser || false;
    }
}
