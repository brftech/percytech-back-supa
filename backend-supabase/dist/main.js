"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3001",
    ];
    if (process.env.CORS_ORIGIN) {
        const envOrigins = process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim());
        allowedOrigins.push(...envOrigins);
    }
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix("api");
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 TCR NestJS Backend running on port ${port}`);
    console.log(`🌐 CORS enabled for: ${allowedOrigins.join(", ")}`);
}
bootstrap();
//# sourceMappingURL=main.js.map