import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

// Controllers
import { AppController } from "./app.controller";
import { UserController } from "./controllers/user.controller";
import { BrandController } from "./controllers/brand.controller";
import { CampaignController } from "./controllers/campaign.controller";
import { LeadController } from "./controllers/lead.controller";
import { AuthController } from "./controllers/auth.controller";

// Services
import { AppService } from "./app.service";
import { UserService } from "./services/user.service";
import { BrandService } from "./services/brand.service";
import { CampaignService } from "./services/campaign.service";
import { LeadService } from "./services/lead.service";
import { AuthService } from "./services/auth.service";

import { SupabaseService } from "./services/supabase.service";
import { TCRApiService } from "./services/tcr-api.service";
import { HubSpotService } from "./services/hubspot.service";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
  ],
  controllers: [
    AppController,
    UserController,
    BrandController,
    CampaignController,
    LeadController,
    AuthController,
  ],
  providers: [
    AppService,
    SupabaseService,
    TCRApiService,
    UserService,
    BrandService,
    CampaignService,
    HubSpotService,
    LeadService,
    AuthService,
  ],
})
export class AppModule {}
