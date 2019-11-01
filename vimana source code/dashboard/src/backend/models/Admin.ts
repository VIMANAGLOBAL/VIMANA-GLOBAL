import {IsNotEmpty} from "class-validator";
import {
    Column,
    Entity,
    getRepository,
    PrimaryGeneratedColumn,
    Repository,
} from "typeorm";
import {ServiceLocator} from "../util/ServiceLocator";
import {HashingUtil} from "../util/HashingUtil";

@Entity()
export class Admin {
    public static async seedDefaultAdmin(): Promise<void> {
        const hashingUtil: HashingUtil = ServiceLocator.getInstance().getHashingUtil();
        const adminRepo: Repository<Admin> = getRepository(Admin);
        const admin: Admin = new Admin({
            username: hashingUtil.saltAdminUsername("", "admin"),
            password: hashingUtil.saltAdminPassword("", "qn2pv83d58iy"),
            verified: true,
        });

        if (await adminRepo.count({where: {username: admin.username}}) !== 1) {
            await adminRepo.save(admin);
        }
    }

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar", {unique: true})
    @IsNotEmpty()
    public username: string;

    @Column("varchar")
    @IsNotEmpty()
    public password: string;

    @Column("bool", {default: false})
    @IsNotEmpty()
    public verified: boolean;

    constructor(options: any = {}) {
        this.username = options.username;
        this.password = options.password;
        this.verified = options.verified || false;
    }
}
