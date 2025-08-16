import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with multiple origins
  const allowedOrigins = [
    "http://localhost:3000", // Marekting Sites
    "http://localhost:5173", // Admin Experience
    "http://localhost:5174", // User Experience
    "http://localhost:5175", // Texting UI

    "http://localhost:3001", // Backend (Nest/Vercel/Supabase)
    "http://localhost:3002", // Backend (Nest/AWS/RDS)
  ];
  // Add environment variable origins if specified
  if (process.env.CORS_ORIGIN) {
    const envOrigins = process.env.CORS_ORIGIN.split(",").map((origin) =>
      origin.trim()
    );
    allowedOrigins.push(...envOrigins);
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Global prefix
  app.setGlobalPrefix("api");

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 TCR NestJS Backend running on port ${port}`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(", ")}`);
}
bootstrap();
