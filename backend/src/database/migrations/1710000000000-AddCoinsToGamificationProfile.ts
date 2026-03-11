import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoinsToGamificationProfile1710000000000 implements MigrationInterface {
    name = 'AddCoinsToGamificationProfile1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gamification_profiles" ADD "coins" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gamification_profiles" DROP COLUMN "coins"`);
    }

}
