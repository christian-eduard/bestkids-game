import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Exercises (e2e)', () => {
    let app: INestApplication;
    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        // Login to get token
        const loginRes = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({
                username: 'student1',
                password: 'admin123',
            });

        token = loginRes.body.access_token;
    }, 60000);

    afterAll(async () => {
        await app.close();
    });

    it('should fetch exercises for the demo unit and submit a correct answer', async () => {
        const fetchRes = await request(app.getHttpServer())
            .get('/api/exercises/unit/3')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(fetchRes.body.exercises).toHaveLength(10);
        const exerciseId = fetchRes.body.exercises[0].id; // Get the ID from the first exercise

        // Submit correct answer for the first exercise (SEÑALAR_IMAGEN)
        const submitRes = await request(app.getHttpServer())
            .post('/api/exercises/submit')
            .set('Authorization', `Bearer ${token}`)
            .send({
                exerciseId: exerciseId,
                answer: "1",
                responseTimeMs: 1200
            })
            .expect(201);

        expect(submitRes.body.isCorrect).toBe(true);
        expect(submitRes.body.xpEarned).toBeGreaterThan(0);
    });

    it('should submit an incorrect answer for a valid ID', async () => {
        const fetchRes = await request(app.getHttpServer())
            .get('/api/exercises/unit/3')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const exerciseId = fetchRes.body.exercises[0].id;

        const res = await request(app.getHttpServer())
            .post('/api/exercises/submit')
            .set('Authorization', `Bearer ${token}`)
            .send({
                exerciseId: exerciseId,
                answer: "wrong_answer",
                responseTimeMs: 1000
            })
            .expect(201);

        expect(res.body.isCorrect).toBe(false);
        expect(res.body.xpEarned).toBe(0);
    });
});
