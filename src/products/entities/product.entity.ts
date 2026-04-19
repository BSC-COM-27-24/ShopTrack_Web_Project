import {Entity,PrimaryGeneratedColumn,Column,CreatedDateColumn,} from 'typerorm';

@Entity("products")
export class product{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({length: 226})
    name?: string;

    @Column({length: 30})
    price?: number;

    @Column({length: 226})
    category?: string;

    @Column({length: 226})
    quantity?: string;

    @Column({length: 226})
    createdAt?: Date;

    @Column({length: 226})
    updatedAt?: Date;

    
    


}

