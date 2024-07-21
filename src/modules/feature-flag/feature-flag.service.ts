import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { config } from "dotenv"
import { FeatureFlagScope } from "./feature-flag.enum"

config({})

@Injectable()
export class FeatureFlagService {
  @Inject()
  private readonly configService: ConfigService

  get features() {
    return {
      [FeatureFlagScope.Session]: this.configService.get("SESSION_ENABLED"),
    }
  }

  isEnabled(feature: FeatureFlagScope): boolean {
    /* eslint-disable eqeqeq */
    return this.features[feature] == "true"
  }
}
