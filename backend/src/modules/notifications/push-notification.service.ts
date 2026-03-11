import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PushNotificationService {
    private readonly logger = new Logger(PushNotificationService.name);

    async sendPushToUser(userId: number, title: string, body: string, data?: any) {
        // In a real app, we would look up the user's registered FCM tokens here.
        // const tokens = await this.userTokensRepo.find({ userId });

        // Simulation:
        this.logger.log(`[PUSH SIMULATION] Sending to User #${userId}: "${title}" - ${body}`);

        // Return simulated success
        return { success: true, simulaton: true };
    }

    async sendPushToTopic(topic: string, title: string, body: string) {
        this.logger.log(`[PUSH SIMULATION] Sending to Topic #${topic}: "${title}" - ${body}`);
        return { success: true, simulaton: true };
    }
}
