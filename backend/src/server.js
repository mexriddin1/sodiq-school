import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { openapiSpec } from './docs/openapi.js';
import { errorHandler } from './middleware/errors.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import uploadRouter from './routes/upload.js';
import settingsRouter from './routes/settings.js';
import teachersRouter from './routes/teachers.js';
import topStudentsRouter from './routes/top-students.js';
import alumniRouter from './routes/alumni.js';
import examResultsRouter from './routes/exam-results.js';
import awardsRouter from './routes/awards.js';
import universitiesRouter from './routes/universities.js';
import blogRouter from './routes/blog.js';
import examCoursesRouter from './routes/exam-courses.js';
import lessonSubjectsRouter from './routes/lesson-subjects.js';
import lessonExtrasRouter from './routes/lesson-extras.js';
import pricingPlansRouter from './routes/pricing-plans.js';
import advantagesRouter from './routes/advantages.js';
import aboutStatsRouter from './routes/about-stats.js';
import galleryRouter from './routes/gallery.js';
import faqsRouter from './routes/faqs.js';
import applicationsRouter from './routes/applications.js';
import testimonialVideosRouter from './routes/testimonial-videos.js';
import publicSiteRouter from './routes/public-site.js';
import mediaRouter from './routes/media.js';
import carouselRouter from './routes/carousel.js';
import examCourseSectionsRouter from './routes/exam-course-sections.js';
import webhooksRouter from './routes/webhooks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Behind nginx/PM2 — needed so req.ip and X-Forwarded-For surface the real client IP for Meta CAPI.
app.set('trust proxy', true);

app.use(cors({
  origin: [env.clientOrigin, env.adminOrigin],
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));

// Serve uploaded files
const uploadsAbs = path.resolve(__dirname, '..', env.uploadDir);
app.use('/uploads', express.static(uploadsAbs));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Swagger / OpenAPI docs
app.get('/api/docs.json', (_req, res) => res.json(openapiSpec));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, {
  customSiteTitle: 'Sodiq School API',
  swaggerOptions: { persistAuthorization: true },
}));

// Auth & users (admin)
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// Uploads & media
app.use('/api/upload', uploadRouter);
app.use('/api/media', mediaRouter);

// Resources (each router handles both public GET and admin write)
app.use('/api/settings', settingsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/testimonial-videos', testimonialVideosRouter);
app.use('/api/top-students', topStudentsRouter);
app.use('/api/alumni', alumniRouter);
app.use('/api/exam-results', examResultsRouter);
app.use('/api/awards', awardsRouter);
app.use('/api/universities', universitiesRouter);
app.use('/api/blog', blogRouter);
app.use('/api/exam-courses', examCoursesRouter);
app.use('/api/lesson-subjects', lessonSubjectsRouter);
app.use('/api/lesson-extras', lessonExtrasRouter);
app.use('/api/pricing-plans', pricingPlansRouter);
app.use('/api/advantages', advantagesRouter);
app.use('/api/about-stats', aboutStatsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/carousel', carouselRouter);
app.use('/api/exam-course-sections', examCourseSectionsRouter);
app.use('/api/webhooks', webhooksRouter);

// Convenience aggregator endpoint that returns the entire site bundle for one locale.
app.use('/api/public-site', publicSiteRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`[server] http://localhost:${env.port}  (env=${env.nodeEnv})`);
  console.log(`[server] CORS allowed: ${env.clientOrigin}, ${env.adminOrigin}`);
});
