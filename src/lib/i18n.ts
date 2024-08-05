import {
  I18nContext,
  I18n as Translator,
  I18nService as TranslatorService,
} from "nestjs-i18n"
import { I18nTranslations as I18nTranslationsPrimitive } from "@/types/i18n"

type TranslatorContext = I18nContext<I18nTranslationsPrimitive>

type Translations = I18nTranslationsPrimitive

export { Translator, TranslatorService, Translations, TranslatorContext }
