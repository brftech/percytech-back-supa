"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const supabase_service_1 = require("./services/supabase.service");
const tcr_api_service_1 = require("./services/tcr-api.service");
const user_service_1 = require("./services/user.service");
const brand_service_1 = require("./services/brand.service");
const campaign_service_1 = require("./services/campaign.service");
const hubspot_service_1 = require("./services/hubspot.service");
const lead_service_1 = require("./services/lead.service");
const auth_service_1 = require("./services/auth.service");
const user_controller_1 = require("./controllers/user.controller");
const brand_controller_1 = require("./controllers/brand.controller");
const campaign_controller_1 = require("./controllers/campaign.controller");
const lead_controller_1 = require("./controllers/lead.controller");
const auth_controller_1 = require("./controllers/auth.controller");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
            }),
        ],
        controllers: [
            app_controller_1.AppController,
            user_controller_1.UserController,
            brand_controller_1.BrandController,
            campaign_controller_1.CampaignController,
            lead_controller_1.LeadController,
            auth_controller_1.AuthController,
        ],
        providers: [
            app_service_1.AppService,
            supabase_service_1.SupabaseService,
            tcr_api_service_1.TCRApiService,
            user_service_1.UserService,
            brand_service_1.BrandService,
            campaign_service_1.CampaignService,
            hubspot_service_1.HubSpotService,
            lead_service_1.LeadService,
            auth_service_1.AuthService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map