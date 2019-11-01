import {IsNotEmpty} from "class-validator";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class ResendMap {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    @IsNotEmpty()
    public target: string;

    @Column("varchar")
    @IsNotEmpty()
    public email: string;

    @Column("timestamp")
    @IsNotEmpty()
    public sentTimestamp: Date;

    constructor(options: any = {}) {
        this.email = options.email;
        this.target = options.target;
        this.sentTimestamp = options.sentTimestamp;
    }
}
