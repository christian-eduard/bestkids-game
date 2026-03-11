import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Health & Routing (E2E)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200);
    });

    // Verify Critical Routes Exist (should return 401 Unauthorized, not 404)

    it('/api/users/profile (GET) should exist', () => {
        return request(app.getHttpServer())
            .get('/users/profile')
            .expect(401);
    });

    it('/api/notifications/unread-count (GET) should exist', () => {
        return request(app.getHttpServer())
            .get('/notifications/unread-count')
            .expect(401);
    });

    it('/api/worlds/levels/1 (GET via worlds/levels/:id) should exist', () => {
        return request(app.getHttpServer())
            .get('/worlds/levels/1')
            .expect(401);
    });

    afterAll(async () => {
        await app.close();
    });
});
