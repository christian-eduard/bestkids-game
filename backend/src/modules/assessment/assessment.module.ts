import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { RtiService } from './rti.service';
import { AdaptiveAlgorithmService } from './adaptive-algorithm.service';
import { RtiClassificationService } from './services/rti-classification.service';
import { InitialAssessment } from './entities/initial-assessment.entity';
import { AdaptiveProgress } from './entities/adaptive-progress.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { SubjectArea } from '../exercises/entities/subject-area.entity';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InitialAssessment,
            AdaptiveProgress,
            Exercise,
            SubjectArea,
            User,
        ]),
    ],
    controllers: [AssessmentController],
    providers: [AssessmentService, RtiService, AdaptiveAlgorithmService, RtiClassificationService],
    exports: [AssessmentService, RtiService, AdaptiveAlgorithmService, RtiClassificationService],
})
export class AssessmentModule { }

