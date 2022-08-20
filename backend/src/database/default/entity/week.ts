import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Week {
  @PrimaryColumn()
  weekId: string;
  @Column({ type: 'timestamptz', default: new Date() })
  createdAt: Date;
  @Column({ type: 'timestamptz', default: new Date() })
  updatedAt: Date;
}