# COMPLETE E-COMMERCE PROMPT (FINAL)

## INSTRUCTIONS FOR AI

Act as an **Elite Full-Stack Next.js 15 Architect**, **E-commerce Specialist** and **Design System Expert**. Generate a complete, production-ready e-commerce website for fashion retail/D2C purposes that is **FULLY INTEGRATED with the Blueprint System**.

CRITICAL REQUIREMENTS:

- NO `.data.ts` files - Do not create any `.data.ts` files anywhere in the project
- SINGLE PAGE JSON - Each page has its own JSON configuration file
- ALL PAGES RENDER FROM JSON - Every page (Home, Shop, Product, Cart, Checkout, Wishlist, About, Contact, FAQ) renders its content from its dedicated JSON file
- NO CMS DATABASE COLLECTION - Page content is NOT stored in MongoDB, only in local JSON files
- LOCALE SUPPORT - Routes use `[locale]` folder structure. Default language (en) has NO locale prefix in URLs (e.g., `/`, `/about`). Other languages include prefix (e.g., `/hi`, `/[locale]/about`)
- TRANSLATION SUPPORT - Translated text (for other locales) must be written in the target language's native script.
- EDITABLE TEXT - All text content must be wrapped in `EditableText` component for inline editing capability
- CLEAN TEXT STORAGE - JSON stores clean text WITHOUT HTML tags (no `<span>`, `<div>`, etc.)
- STYLING VIA CSS CLASSES - All visual styling (gradients, colors, fonts) applied via CSS classes, not inline HTML
- BLUEPRINT INTEGRATION - All theme values come from Blueprint system via CSS variables - NO hardcoded colors/fonts/spacing
- NO LANGUAGE TOGGLE BUTTON - Language switching is handled via URL locale prefixes, not a UI toggle
- NO DARK MODE TOGGLE - Dark mode is controlled by Blueprint system, not a UI toggle button

===

## VARIABLE CONFIGURATION (INPUT JIG)

```yaml
# COMPANY IDENTITY
COMPANY_NAME: { { COMPANY_NAME } }
PROJECT_SLUG: { { PROJECT_SLUG } }
BUSINESS_TYPE: { { BUSINESS_TYPE } }
VERTICAL: { { VERTICAL } }
INDUSTRY: { { INDUSTRY } }
BUSINESS_GOAL: { { BUSINESS_GOAL } }
CURRENT_TENANT_DB_HEADER: { { CURRENT_TENANT_DB_HEADER } }

# LOCALIZATION PRIMITIVES
ACTIVE_LANGUAGES: { { ACTIVE_LANGUAGES } }
DEFAULT_LANGUAGE: { { DEFAULT_LANGUAGE } }

ACTIVE_CURRENCIES: { { ACTIVE_CURRENCIES } }
DEFAULT_CURRENCY: { { DEFAULT_CURRENCY } }

# LOCALIZATION RULES (FROM CMS)
# - URLs for default language have NO locale prefix
# - URLs for other languages include locale prefix
# - Translated text content uses actual native script of the target language

# CONTACT INFORMATION
COMPANY_ADDRESS: { { COMPANY_ADDRESS } }
COMPANY_PHONE: { { COMPANY_PHONE } }
COMPANY_EMAIL: { { COMPANY_EMAIL } }
COMPANY_WHATSAPP: { { COMPANY_WHATSAPP } }
```

===

## WEBSITE STRATEGY

Purpose:
E-commerce / D2C Fashion Retail Website

Business Goals:

- Product discovery
- Conversion optimization
- Customer retention
- Mobile-first shopping experience
- SEO-driven traffic growth
- Scalable architecture

Page Types:

| Page | Purpose | Editable |
|------|---------|----------|
| Home | Marketing and hero showcase | Yes |
| Shop | Product listing and filters | Yes (config) |
| Product | Dynamic product details | No |
| Cart | Cart management | Yes (config) |
| Checkout | Multi-step checkout flow | Yes (config) |
| Wishlist | Saved products | Yes (config) |
| About | Company story and mission | Yes |
| Contact | Contact information and forms | Yes |
| FAQ | Accordion Q&A sections | Yes |
| Account | User profile and orders | No |

===

# PAGE STRUCTURE

## Route Structure with Clean URLs

```
src/app/
├── [locale]/                     # Internal folder for all locales
│   ├── layout.tsx                # Locale-aware root layout
│   ├── page.tsx                  # Serves / (default) and /[locale]
│   ├── [...slug]/
│   │   └── page.tsx              # Catch-all dynamic permalink resolver
│   ├── shop/
│   │   ├── page.tsx              # Serves /shop (default) and /[locale]/shop
│   │   └── [slug]/
│   │       └── page.tsx          # Product details (Server Component)
│   ├── cart/
│   │   └── page.tsx              # Serves /cart (default) and /[locale]/cart
│   ├── checkout/
│   │   └── page.tsx              # Serves /checkout (default) and /[locale]/checkout
│   ├── wishlist/
│   │   └── page.tsx              # Serves /wishlist (default) and /[locale]/wishlist
│   ├── about/
│   │   └── page.tsx              # Serves /about (default) and /[locale]/about
│   ├── contact/
│   │   └── page.tsx              # Serves /contact (default) and /[locale]/contact
│   ├── faq/
│   │   └── page.tsx              # Serves /faq (default) and /[locale]/faq
│   ├── orders/
│   │   ├── page.tsx              # Order history list
│   │   └── [id]/
│   │       └── page.tsx          # Order details page
│   ├── account/
│   │   ├── page.tsx              # My Account
│   │   └── profile/
│   │       └── page.tsx          # Profile settings
│   └── search/
│       └── page.tsx              # Search results
├── api/
│   ├── [[...slug]]/              # CATCH-ALL PROXY for Blueprint API
│   │   └── route.ts
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── wishlist/
│   └── payment/
└── admin/                        # Admin dashboard
    └── layout.tsx
```

URL Structure Examples:
| Page | Default Language (en) | Target Locale (e.g., de) |
|------|----------------------|------------|
| Home | `https://domain.com/` | `https://domain.com/[locale]` |
| Shop | `https://domain.com/shop` | `https://domain.com/[locale]/shop` |
| Cart | `https://domain.com/cart` | `https://domain.com/[locale]/cart` |
| About | `https://domain.com/about` | `https://domain.com/[locale]/about` |
| Contact | `https://domain.com/contact` | `https://domain.com/[locale]/contact` |

===

# BLUEPRINT SYSTEM INTEGRATION

## Architecture Overview

```
fetchBlueprintThunk (GET /api/platform/business-blueprint)
        │
        ▼  (via Next.js catch-all proxy)
FastAPI Backend ──→ BlueprintApiResponse
        │
        ▼
blueprintThunk.ts — returns json.data (the API wrapper)
        │
        ▼
blueprintSlice.ts — fulfilled handler stores action.payload.payload into state.blueprint.payload
        │
        ▼
BlueprintProvider.tsx — reads selectActiveTheme, calls applyTheme()
        │
        ▼
applyTheme.ts — injects CSS custom properties onto document.documentElement
        │
        ▼
Components use var(--primary), var(--background), etc. in CSS/className
```

## CSS Variable Naming Convention (Blueprint)

| Group      | Example Variables                                           |
| ---------- | ----------------------------------------------------------- |
| Colors     | `--primary`, `--text-secondary`, `--border-hover`           |
| Typography | `--font-body`, `--text-lg`, `--fw-bold`, `--leading-normal` |
| Spacing    | `--space-4`, `--space-8`, `--space-16`                      |
| Radius     | `--radius-md`, `--radius-lg`, `--radius-full`               |
| Shadows    | `--shadow-sm`, `--shadow-md`, `--shadow-lg`                 |
| Layout     | `--container`, `--navbar-height`, `--section-padding`       |
| Buttons    | `--btn-height`, `--btn-padding-x`, `--btn-primary-bg`       |
| Forms      | `--input-height`, `--input-bg`, `--input-border`            |

===

## JSON FILE ARCHITECTURE

```
src/lib/data/pages/
├── homePage.json           # Homepage content
├── shopPage.json           # Shop listing page config
├── productPage.json        # Product detail page template
├── cartPage.json           # Shopping cart page config
├── checkoutPage.json       # Checkout page config
├── wishlistPage.json       # Wishlist page config
├── aboutPage.json          # About page content
├── contactPage.json        # Contact page content
├── faqPage.json            # FAQ page content
├── termsPage.json          # Terms & Conditions page
├── privacyPage.json        # Privacy Policy page
├── returnsPage.json        # Returns Policy page
├── footerData.json         # Footer configuration (global)
└── headerData.json         # Header configuration (global)
```

## JSON File Structure Contract

IMPORTANT: Store clean text WITHOUT HTML tags. Translated text in target language script. (Note: To add translations for other languages, simply add the corresponding language key, e.g., 'en' for English, 'hi' for Hindi, etc., and provide the value in that language.)

```json
{
  "title": "home",
  "slug": "home",
  "isPublished": true,
  "seo": {
    "title": {
      "en": "{{COMPANY_NAME}} - Fashion for the Bold"
    },
    "description": {
      "en": "Discover bold fashion at {{COMPANY_NAME}}. Free shipping on orders over {{CURRENCY_SYMBOL}}{{FREE_SHIPPING_THRESHOLD}}."
    }
  },
  "content": [
    {
      "id": "hero-section-1",
      "type": "hero",
      "adminTitle": "Hero",
      "props": {
        "heading": {
          "en": "Define Your Edge"
        },
        "subheading": {
          "en": "Bold designs. Premium materials. Made for the fearless."
        },
        "primaryButtonText": {
          "en": "Shop Now"
        },
        "primaryButtonLink": "/shop"
      }
    }
  ]
}
```

===

## BLUEPRINT TYPES (FULL IMPLEMENTATION)

TARGET 1: src/redux/slices/blueprint/blueprintType.ts

```typescript
// ============================================================
// BLUEPRINT TYPE DEFINITIONS
// Full TypeScript interfaces mirroring the backend API shape
// ============================================================

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  accentHover: string;
  accentSoft: string;

  background: string;
  surface: string;
  card: string;

  text: string;
  textSecondary: string;
  textMuted: string;

  border: string;
  borderHover: string;

  success: string;
  warning: string;
  error: string;
  info: string;
  overlay: string;

  successLight: string;
  warningLight: string;
  errorLight: string;
  infoLight: string;

  brandBlue: string;
  brandDarkBlue: string;
  brandTeal: string;
  brandPurple: string;

  cardHoverBorder: string;
  badgeBg: string;
  badgeText: string;
  tagBg: string;
  tagText: string;
  testimonialBg: string;
  testimonialBorder: string;
  statNumber: string;
  marketplaceCardBg: string;
  integrationIconBg: string;
  momentumAccent: string;
  salesBadgeBg: string;
  salesBadgeText: string;
}

export interface ThemeTypographyText {
  xs: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
  "5xl": string;
}

export interface ThemeTypographyFw {
  light: string;
  normal: string;
  medium: string;
  semibold: string;
  bold: string;
  extrabold: string;
}

export interface ThemeTypographyLineHeight {
  tight: string;
  normal: string;
  relaxed: string;
}

export interface ThemeTypography {
  bodyFont: string;
  headingFont: string;
  monoFont: string;
  text: ThemeTypographyText;
  fw: ThemeTypographyFw;
  lineHeight: ThemeTypographyLineHeight;
}

export interface ThemeSpacing {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
  "6": string;
  "8": string;
  "10": string;
  "12": string;
  "16": string;
  "20": string;
  "24": string;
}

export interface ThemeRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  full: string;
}

export interface ThemeShadow {
  sm: string;
  md: string;
  lg: string;
  hover: string;
}

export interface ThemeLayout {
  container: string;
  navbarHeight: string;
  sectionPadding: string;
}

export interface ThemeButtons {
  height: string;
  paddingX: string;
  radius: string;
  primaryBackground: string;
  primaryText: string;
  primaryHover: string;
  secondaryBackground: string;
  secondaryText: string;
  secondaryHover: string;
  outlineBorder: string;
  outlineText: string;
  outlineHoverBg: string;
  outlineHoverText: string;
}

export interface ThemeForms {
  inputHeight: string;
  inputPaddingX: string;
  inputPaddingY: string;
  inputRadius: string;
  inputBackground: string;
  inputText: string;
  inputBorder: string;
  inputBorderHover: string;
  inputPlaceholder: string;
  inputFocusBorder: string;
  inputFocusShadow: string;
  inputDisabledBackground: string;
  inputDisabledText: string;
  textareaMinHeight: string;
}

export interface ThemeModal {
  sm: string;
  md: string;
  lg: string;
}

export interface ThemeDarkMode {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  inputBackground: string;
  inputText: string;
  inputBorder: string;
  inputPlaceholder: string;
  inputDisabledBackground: string;
}

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  shadow: ThemeShadow;
  layout: ThemeLayout;
  buttons: ThemeButtons;
  forms: ThemeForms;
  modal: ThemeModal;
  darkMode: ThemeDarkMode;
}

export interface NavItem {
  label: LocalizedString;
  href: string;
  dropdownItems?: NavItem[];
}

export type LocalizedString = {
  en: string;
  [locale: string]: string;
};

export interface RouteDefinition {
  path: string;
  component: string;
  isProtected: boolean;
  roles?: string[];
}

export interface BrandValue {
  title: LocalizedString;
  description: LocalizedString;
  icon?: string;
}

export interface BrandTaglines {
  primary: LocalizedString;
  secondary?: LocalizedString;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface BusinessProfile {
  name: LocalizedString;
  tagline: BrandTaglines;
  logo?: string;
  favicon?: string;
  description?: LocalizedString;
  foundedYear?: number;
  headquarters?: string;
  values: BrandValue[];
  socialLinks: SocialLink[];
}

export interface BusinessInfo {
  legalName: string;
  registrationNumber?: string;
  taxId?: string;
  gst?: string;
}

export interface BusinessCommunications {
  phone: string;
  email: string;
  whatsapp?: string;
  supportEmail?: string;
}

export interface BusinessContactInfo {
  address: LocalizedString;
  phone: string;
  email: string;
  whatsapp?: string;
  mapLocation?: {
    lat: number;
    lng: number;
  };
}

export interface BusinessLegalRegulatory {
  termsUrl: string;
  privacyUrl: string;
  returnsUrl: string;
  shippingPolicyUrl?: string;
}

export interface Commerce {
  currencyCode: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  taxRate: number;
  shippingCost: number;
  enabledPaymentMethods: string[];
  enabledShippingMethods: Array<{
    id: string;
    name: LocalizedString;
    cost: number;
    minOrderValue?: number;
  }>;
}

export interface Localization {
  activeLanguages: string[];
  defaultLanguage: string;
  activeCurrencies: Array<{
    code: string;
    symbol: string;
  }>;
  defaultCurrency: string;
}

export interface MediaConfiguration {
  maxFileSize: number;
  allowedImageTypes: string[];
  imageQuality: number;
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: LocalizedString;
  config: Record<string, any>;
}

export interface Vocabulary {
  [key: string]: LocalizedString;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  sections: any[];
}

export interface ToneTag {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface PrimaryGoal {
  id: string;
  name: string;
  description?: string;
  metrics: string[];
}

export interface Navigation {
  public: NavItem[];
  admin?: NavItem[];
}

export interface Routes {
  public: RouteDefinition[];
  protected: RouteDefinition[];
  admin?: RouteDefinition[];
}

export interface EnabledModules {
  ecommerce: boolean;
  blog: boolean;
  portfolio: boolean;
  team: boolean;
  careers: boolean;
}

export interface BlueprintPayload {
  id: string;
  document_key: string;
  business_profile: BusinessProfile;
  business_info: BusinessInfo;
  business_communications: BusinessCommunications;
  business_contact_info: BusinessContactInfo;
  business_legal_regulatory: BusinessLegalRegulatory;
  public_theme: Theme;
  admin_theme: Theme;
  public_navigation: Navigation;
  admin_navigation: Navigation;
  routes: Routes;
  commerce: Commerce;
  localization: Localization;
  media_configuration: MediaConfiguration;
  dashboard_widgets: DashboardWidget[];
  vocabulary: Vocabulary;
  templates: Template[];
  tone_tags: ToneTag[];
  primary_goals: PrimaryGoal[];
  enabled_modules: EnabledModules;
  created_at: string;
  updated_at: string;
}

export interface BlueprintApiResponse {
  message: string;
  success: boolean;
  data: {
    id: string;
    document_key: string;
    payload: BlueprintPayload;
  };
}

export type ThemeContext = "public" | "admin";

export interface BlueprintState {
  payload: BlueprintPayload | null;
  activeThemeContext: ThemeContext;
  loading: boolean;
  updating: boolean;
  error: string | null;
  lastFetched: string | null;
}
```


TARGET 2: src/redux/slices/blueprint/blueprintThunk.ts

```typescript
// ============================================================
// BLUEPRINT ASYNC THUNKS
// Handles API calls to fetch and update blueprint data
// ============================================================

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import type {
  BlueprintPayload,
  Theme,
  BrandValue,
  BusinessProfile,
  Navigation,
} from "./blueprintType";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getTenantHeader = () => ({
  "x-tenant-db": process.env.NEXT_PUBLIC_TENANT_DB || "",
});

async function fetchWithTenant(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getTenantHeader(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const fetchBlueprintThunk = createAsyncThunk(
  "blueprint/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchWithTenant(
        "/api/platform/business-blueprint",
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateBlueprintThunk = createAsyncThunk(
  "blueprint/update",
  async (payload: BlueprintPayload, { rejectWithValue }) => {
    try {
      const response = await fetchWithTenant(
        "/api/platform/business-blueprint",
        {
          method: "PUT",
          body: JSON.stringify({ payload }),
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateThemeThunk = createAsyncThunk(
  "blueprint/updateTheme",
  async (
    { context, theme }: { context: "public" | "admin"; theme: Partial<Theme> },
    { getState, rejectWithValue },
  ) => {
    const state = getState() as RootState;
    const currentPayload = state.blueprint.payload;

    if (!currentPayload) {
      return rejectWithValue("No blueprint payload found");
    }

    const updatedPayload = {
      ...currentPayload,
      [context === "public" ? "public_theme" : "admin_theme"]: {
        ...(context === "public"
          ? currentPayload.public_theme
          : currentPayload.admin_theme),
        ...theme,
      },
    };

    try {
      const response = await fetchWithTenant(
        "/api/platform/business-blueprint",
        {
          method: "PUT",
          body: JSON.stringify({ payload: updatedPayload }),
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateBrandValueThunk = createAsyncThunk(
  "blueprint/updateBrandValue",
  async (brandValue: BrandValue, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const currentPayload = state.blueprint.payload;

    if (!currentPayload) {
      return rejectWithValue("No blueprint payload found");
    }

    const updatedPayload = {
      ...currentPayload,
      business_profile: {
        ...currentPayload.business_profile,
        values: [...currentPayload.business_profile.values, brandValue],
      },
    };

    try {
      const response = await fetchWithTenant(
        "/api/platform/business-blueprint",
        {
          method: "PUT",
          body: JSON.stringify({ payload: updatedPayload }),
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateBusinessProfileThunk = createAsyncThunk(
  "blueprint/updateBusinessProfile",
  async (profile: Partial<BusinessProfile>, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const currentPayload = state.blueprint.payload;

    if (!currentPayload) {
      return rejectWithValue("No blueprint payload found");
    }

    const updatedPayload = {
      ...currentPayload,
      business_profile: {
        ...currentPayload.business_profile,
        ...profile,
      },
    };

    try {
      const response = await fetchWithTenant(
        "/api/platform/business-blueprint",
        {
          method: "PUT",
          body: JSON.stringify({ payload: updatedPayload }),
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateNavigationThunk = createAsyncThunk(
  "blueprint/updateNavigation",
  async (
    {
      context,
      navigation,
    }: { context: "public" | "admin"; navigation: Partial<Navigation> },
    { getState, rejectWithValue },
  ) => {
    const state = getState() as RootState;
    const currentPayload = state.blueprint.payload;

    if (!currentPayload) {
      return rejectWithValue("No blueprint payload found");
    }

    const updatedPayload = {
      ...currentPayload,
      [context === "public" ? "public_navigation" : "admin_navigation"]: {
        ...(context === "public"
          ? currentPayload.public_navigation
          : currentPayload.admin_navigation),
        ...navigation,
      },
    };

    try {
      const response = await fetchWithTenant(
        "/api/platform/business-blueprint",
        {
          method: "PUT",
          body: JSON.stringify({ payload: updatedPayload }),
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
```

TARGET 3: src/redux/slices/blueprint/blueprintSlice.ts

```typescript
// ============================================================
// BLUEPRINT REDUX SLICE
// Manages blueprint state with selectors for theme access
// ============================================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  BlueprintState,
  BlueprintPayload,
  ThemeContext,
  Theme,
} from "./blueprintType";
import {
  fetchBlueprintThunk,
  updateBlueprintThunk,
  updateThemeThunk,
  updateBrandValueThunk,
  updateBusinessProfileThunk,
  updateNavigationThunk,
} from "./blueprintThunk";

const initialState: BlueprintState = {
  payload: null,
  activeThemeContext: "public",
  loading: false,
  updating: false,
  error: null,
  lastFetched: null,
};

const blueprintSlice = createSlice({
  name: "blueprint",
  initialState,
  reducers: {
    setThemeContext: (state, action: PayloadAction<ThemeContext>) => {
      state.activeThemeContext = action.payload;
    },
    applyColorOverride: (
      state,
      action: PayloadAction<{
        context: ThemeContext;
        colors: Record<string, string>;
      }>,
    ) => {
      const { context, colors } = action.payload;
      const themeKey = context === "public" ? "public_theme" : "admin_theme";
      if (state.payload) {
        const currentTheme = state.payload[themeKey] as Theme;
        state.payload[themeKey] = {
          ...currentTheme,
          colors: {
            ...currentTheme.colors,
            ...colors,
          },
        };
      }
    },
    clearBlueprintError: (state) => {
      state.error = null;
    },
    resetBlueprint: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBlueprintThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBlueprintThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.payload = action.payload.payload;
      state.lastFetched = new Date().toISOString();
    });
    builder.addCase(fetchBlueprintThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateBlueprintThunk.pending, (state) => {
      state.updating = true;
      state.error = null;
    });
    builder.addCase(updateBlueprintThunk.fulfilled, (state, action) => {
      state.updating = false;
      state.payload = action.payload.payload;
      state.lastFetched = new Date().toISOString();
    });
    builder.addCase(updateBlueprintThunk.rejected, (state, action) => {
      state.updating = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateThemeThunk.fulfilled, (state, action) => {
      state.payload = action.payload.payload;
      state.lastFetched = new Date().toISOString();
    });

    builder.addCase(updateBrandValueThunk.fulfilled, (state, action) => {
      state.payload = action.payload.payload;
      state.lastFetched = new Date().toISOString();
    });

    builder.addCase(updateBusinessProfileThunk.fulfilled, (state, action) => {
      state.payload = action.payload.payload;
      state.lastFetched = new Date().toISOString();
    });

    builder.addCase(updateNavigationThunk.fulfilled, (state, action) => {
      state.payload = action.payload.payload;
      state.lastFetched = new Date().toISOString();
    });
  },
});

// ============================================================
// SELECTORS
// ============================================================

export const selectBlueprint = (state: { blueprint: BlueprintState }) =>
  state.blueprint.payload;
export const selectThemeContext = (state: { blueprint: BlueprintState }) =>
  state.blueprint.activeThemeContext;
export const selectPublicTheme = (state: { blueprint: BlueprintState }) =>
  state.blueprint.payload?.public_theme;
export const selectAdminTheme = (state: { blueprint: BlueprintState }) =>
  state.blueprint.payload?.admin_theme;
export const selectActiveTheme = (state: {
  blueprint: BlueprintState;
}): Theme | null => {
  const payload = state.blueprint.payload;
  const context = state.blueprint.activeThemeContext;
  if (!payload) return null;
  return context === "public" ? payload.public_theme : payload.admin_theme;
};
export const selectBusinessProfile = (state: { blueprint: BlueprintState }) =>
  state.blueprint.payload?.business_profile;
export const selectPublicNavigation = (state: { blueprint: BlueprintState }) =>
  state.blueprint.payload?.public_navigation;
export const selectAdminNavigation = (state: { blueprint: BlueprintState }) =>
  state.blueprint.payload?.admin_navigation;
export const selectRoutes = (state: { blueprint: BlueprintState }) =>
  state.blueprint.payload?.routes;
export const selectEnabledModules = (state: { blueprint: BlueprintState }) =>
  state.blueprint.payload?.enabled_modules;
export const selectVocabulary = (state: { blueprint: BlueprintState }) =>
  state.blueprint.payload?.vocabulary;
export const selectLocalization = (state: { blueprint: BlueprintState }) =>
  state.blueprint.payload?.localization;
export const selectCommerce = (state: { blueprint: BlueprintState }) =>
  state.blueprint.payload?.commerce;
export const selectBlueprintLoading = (state: { blueprint: BlueprintState }) =>
  state.blueprint.loading;
export const selectBlueprintUpdating = (state: { blueprint: BlueprintState }) =>
  state.blueprint.updating;
export const selectBlueprintError = (state: { blueprint: BlueprintState }) =>
  state.blueprint.error;

export const {
  setThemeContext,
  applyColorOverride,
  clearBlueprintError,
  resetBlueprint,
} = blueprintSlice.actions;
export default blueprintSlice.reducer;
```

TARGET 4: src/lib/applyTheme.ts

```typescript
// ============================================================
// APPLY THEME UTILITY
// Injects Blueprint CSS variables onto document.documentElement
// ============================================================

import type { Theme } from "@/redux/slices/blueprint/blueprintType";

const injectGoogleFont = (family: string, id: string) => {
  if (typeof document === "undefined") return;

  const cleanFamily = family.split(",")[0].trim().replace(/['"]/g, "");

  const existingLink = document.getElementById(id);
  if (existingLink) {
    if (!existingLink.getAttribute("href")?.includes(cleanFamily)) {
      existingLink.setAttribute(
        "href",
        `https://fonts.googleapis.com/css2?family=${cleanFamily.replace(/ /g, "+")}:wght@300;400;500;600;700;800&display=swap`,
      );
    }
    return;
  }

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${cleanFamily.replace(/ /g, "+")}:wght@300;400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
};

export const applyTheme = (
  theme: Theme | null,
  context: "public" | "admin" = "public",
) => {
  if (typeof document === "undefined" || !theme) return;

  const root = document.documentElement;

  if (theme.colors) {
    root.style.setProperty("--primary", theme.colors.primary);
    root.style.setProperty("--primary-light", theme.colors.primaryLight);
    root.style.setProperty("--primary-dark", theme.colors.primaryDark);
    root.style.setProperty("--primary-hover", theme.colors.primaryHover);
    root.style.setProperty("--secondary", theme.colors.secondary);
    root.style.setProperty("--accent", theme.colors.accent);
    root.style.setProperty("--accent-hover", theme.colors.accentHover);
    root.style.setProperty("--accent-soft", theme.colors.accentSoft);
    root.style.setProperty("--background", theme.colors.background);
    root.style.setProperty("--surface", theme.colors.surface);
    root.style.setProperty("--card", theme.colors.card);
    root.style.setProperty("--text", theme.colors.text);
    root.style.setProperty("--text-secondary", theme.colors.textSecondary);
    root.style.setProperty("--text-muted", theme.colors.textMuted);
    root.style.setProperty("--border", theme.colors.border);
    root.style.setProperty("--border-hover", theme.colors.borderHover);
    root.style.setProperty("--success", theme.colors.success);
    root.style.setProperty("--warning", theme.colors.warning);
    root.style.setProperty("--error", theme.colors.error);
    root.style.setProperty("--info", theme.colors.info);
    root.style.setProperty("--overlay", theme.colors.overlay);
  }

  if (theme.typography) {
    if (theme.typography.bodyFont) {
      injectGoogleFont(theme.typography.bodyFont, "google-font-body");
      root.style.setProperty("--font-body", theme.typography.bodyFont);
    }
    if (theme.typography.headingFont) {
      injectGoogleFont(theme.typography.headingFont, "google-font-heading");
      root.style.setProperty("--font-heading", theme.typography.headingFont);
    }
    if (theme.typography.monoFont) {
      injectGoogleFont(theme.typography.monoFont, "google-font-mono");
      root.style.setProperty("--font-mono", theme.typography.monoFont);
    }

    if (theme.typography.text) {
      root.style.setProperty("--text-xs", theme.typography.text.xs);
      root.style.setProperty("--text-sm", theme.typography.text.sm);
      root.style.setProperty("--text-base", theme.typography.text.base);
      root.style.setProperty("--text-md", theme.typography.text.md);
      root.style.setProperty("--text-lg", theme.typography.text.lg);
      root.style.setProperty("--text-xl", theme.typography.text.xl);
      root.style.setProperty("--text-2xl", theme.typography.text["2xl"]);
      root.style.setProperty("--text-3xl", theme.typography.text["3xl"]);
      root.style.setProperty("--text-4xl", theme.typography.text["4xl"]);
      root.style.setProperty("--text-5xl", theme.typography.text["5xl"]);
    }

    if (theme.typography.fw) {
      root.style.setProperty("--fw-light", theme.typography.fw.light);
      root.style.setProperty("--fw-normal", theme.typography.fw.normal);
      root.style.setProperty("--fw-medium", theme.typography.fw.medium);
      root.style.setProperty("--fw-semibold", theme.typography.fw.semibold);
      root.style.setProperty("--fw-bold", theme.typography.fw.bold);
      root.style.setProperty("--fw-extrabold", theme.typography.fw.extrabold);
    }

    if (theme.typography.lineHeight) {
      root.style.setProperty(
        "--leading-tight",
        theme.typography.lineHeight.tight,
      );
      root.style.setProperty(
        "--leading-normal",
        theme.typography.lineHeight.normal,
      );
      root.style.setProperty(
        "--leading-relaxed",
        theme.typography.lineHeight.relaxed,
      );
    }
  }

  if (theme.spacing) {
    root.style.setProperty("--space-1", theme.spacing["1"]);
    root.style.setProperty("--space-2", theme.spacing["2"]);
    root.style.setProperty("--space-3", theme.spacing["3"]);
    root.style.setProperty("--space-4", theme.spacing["4"]);
    root.style.setProperty("--space-5", theme.spacing["5"]);
    root.style.setProperty("--space-6", theme.spacing["6"]);
    root.style.setProperty("--space-8", theme.spacing["8"]);
    root.style.setProperty("--space-10", theme.spacing["10"]);
    root.style.setProperty("--space-12", theme.spacing["12"]);
    root.style.setProperty("--space-16", theme.spacing["16"]);
    root.style.setProperty("--space-20", theme.spacing["20"]);
    root.style.setProperty("--space-24", theme.spacing["24"]);
  }

  if (theme.radius) {
    root.style.setProperty("--radius-sm", theme.radius.sm);
    root.style.setProperty("--radius-md", theme.radius.md);
    root.style.setProperty("--radius-lg", theme.radius.lg);
    root.style.setProperty("--radius-xl", theme.radius.xl);
    root.style.setProperty("--radius-2xl", theme.radius["2xl"]);
    root.style.setProperty("--radius-full", theme.radius.full);
  }

  if (theme.shadow) {
    root.style.setProperty("--shadow-sm", theme.shadow.sm);
    root.style.setProperty("--shadow-md", theme.shadow.md);
    root.style.setProperty("--shadow-lg", theme.shadow.lg);
    root.style.setProperty("--shadow-hover", theme.shadow.hover);
  }

  if (theme.layout) {
    root.style.setProperty("--container", theme.layout.container);
    root.style.setProperty("--navbar-height", theme.layout.navbarHeight);
    root.style.setProperty("--section-padding", theme.layout.sectionPadding);
  }

  if (theme.buttons) {
    root.style.setProperty("--btn-height", theme.buttons.height);
    root.style.setProperty("--btn-padding-x", theme.buttons.paddingX);
    root.style.setProperty("--btn-radius", theme.buttons.radius);
    root.style.setProperty("--btn-primary-bg", theme.buttons.primaryBackground);
    root.style.setProperty("--btn-primary-text", theme.buttons.primaryText);
    root.style.setProperty("--btn-primary-hover", theme.buttons.primaryHover);
    root.style.setProperty(
      "--btn-secondary-bg",
      theme.buttons.secondaryBackground,
    );
    root.style.setProperty("--btn-secondary-text", theme.buttons.secondaryText);
    root.style.setProperty(
      "--btn-secondary-hover",
      theme.buttons.secondaryHover,
    );
    root.style.setProperty("--btn-outline-border", theme.buttons.outlineBorder);
    root.style.setProperty("--btn-outline-text", theme.buttons.outlineText);
    root.style.setProperty(
      "--btn-outline-hover-bg",
      theme.buttons.outlineHoverBg,
    );
    root.style.setProperty(
      "--btn-outline-hover-text",
      theme.buttons.outlineHoverText,
    );
  }

  if (theme.forms) {
    root.style.setProperty("--input-height", theme.forms.inputHeight);
    root.style.setProperty("--input-padding-x", theme.forms.inputPaddingX);
    root.style.setProperty("--input-padding-y", theme.forms.inputPaddingY);
    root.style.setProperty("--input-radius", theme.forms.inputRadius);
    root.style.setProperty("--input-bg", theme.forms.inputBackground);
    root.style.setProperty("--input-text", theme.forms.inputText);
    root.style.setProperty("--input-border", theme.forms.inputBorder);
    root.style.setProperty(
      "--input-border-hover",
      theme.forms.inputBorderHover,
    );
    root.style.setProperty("--input-placeholder", theme.forms.inputPlaceholder);
    root.style.setProperty(
      "--input-focus-border",
      theme.forms.inputFocusBorder,
    );
    root.style.setProperty(
      "--input-focus-shadow",
      theme.forms.inputFocusShadow,
    );
    root.style.setProperty(
      "--input-disabled-bg",
      theme.forms.inputDisabledBackground,
    );
    root.style.setProperty(
      "--input-disabled-text",
      theme.forms.inputDisabledText,
    );
    root.style.setProperty(
      "--textarea-min-height",
      theme.forms.textareaMinHeight,
    );
  }

  if (theme.modal) {
    root.style.setProperty("--modal-sm", theme.modal.sm);
    root.style.setProperty("--modal-md", theme.modal.md);
    root.style.setProperty("--modal-lg", theme.modal.lg);
  }

  if (theme.darkMode) {
    const darkModeStyles = `
      .dark {
        --background: ${theme.darkMode.background};
        --surface: ${theme.darkMode.surface};
        --card: ${theme.darkMode.card};
        --text: ${theme.darkMode.text};
        --text-secondary: ${theme.darkMode.textSecondary};
        --text-muted: ${theme.darkMode.textMuted};
        --border: ${theme.darkMode.border};
        --input-bg: ${theme.darkMode.inputBackground};
        --input-text: ${theme.darkMode.inputText};
        --input-border: ${theme.darkMode.inputBorder};
        --input-placeholder: ${theme.darkMode.inputPlaceholder};
        --input-disabled-bg: ${theme.darkMode.inputDisabledBackground};
      }
    `;

    const existingStyle = document.getElementById("blueprint-dark-vars");
    if (existingStyle) {
      existingStyle.innerHTML = darkModeStyles;
    } else {
      const style = document.createElement("style");
      style.id = "blueprint-dark-vars";
      style.textContent = darkModeStyles;
      document.head.appendChild(style);
    }
  }
};

export default applyTheme;
```

TARGET 5: src/components/providers/BlueprintProvider.tsx

```typescript
// ============================================================
// BLUEPRINT PROVIDER
// Fetches blueprint data and applies theme to document
// ============================================================

'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import {
  fetchBlueprintThunk,
  selectActiveTheme,
  selectThemeContext,
  selectBlueprintLastFetched,
  selectBlueprintLoading,
} from '@/redux/slices/blueprint/blueprintSlice';
import { setThemeContext } from '@/redux/slices/blueprint/blueprintSlice';
import applyTheme from '@/lib/applyTheme';

interface BlueprintProviderProps {
  children: ReactNode;
  context?: 'public' | 'admin';
}

const STALE_THRESHOLD = 5 * 60 * 1000;

export default function BlueprintProvider({ children, context = 'public' }: BlueprintProviderProps) {
  const dispatch = useAppDispatch();
  const activeTheme = useAppSelector(selectActiveTheme);
  const themeContext = useAppSelector(selectThemeContext);
  const lastFetched = useAppSelector(selectBlueprintLastFetched);
  const isLoading = useAppSelector(selectBlueprintLoading);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (themeContext !== context) {
      dispatch(setThemeContext(context));
    }
  }, [dispatch, themeContext, context]);

  useEffect(() => {
    if (hasFetched.current) return;

    const shouldFetch = !lastFetched || (Date.now() - new Date(lastFetched).getTime()) > STALE_THRESHOLD;

    if (shouldFetch && !isLoading) {
      hasFetched.current = true;
      dispatch(fetchBlueprintThunk());
    }
  }, [dispatch, lastFetched, isLoading]);

  useEffect(() => {
    if (activeTheme) {
      applyTheme(activeTheme, themeContext);
    }
  }, [activeTheme, themeContext]);

  return <>{children}</>;
}
```

TARGET 6: src/redux/slices/blueprint/index.ts

```typescript
// ============================================================
// BLUEPRINT BARREL EXPORT
// ============================================================

export { default as blueprintReducer } from "./blueprintSlice";
export * from "./blueprintType";
export * from "./blueprintThunk";
export * from "./blueprintSlice";
```

TARGET 7: src/app/api/[[...slug]]/route.ts

```typescript
// ============================================================
// CATCH-ALL API PROXY
// Forwards requests to backend API with tenant header
// ============================================================

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL;

if (!BACKEND_URL) {
  throw new Error(
    "BACKEND_API_URL is not defined. Please configure it in environment variables."
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  const slug = params.slug?.join("/") || "";
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const url = `${BACKEND_URL}/${slug}${queryString ? `?${queryString}` : ""}`;

  const headers = new Headers();
  const tenantId =
    request.headers.get("x-tenant-db") || process.env.NEXT_PUBLIC_TENANT_DB;
  if (tenantId) {
    headers.set("x-tenant-db", tenantId);
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Proxy request failed", error: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  const slug = params.slug?.join("/") || "";
  const body = await request.json();
  const url = `${BACKEND_URL}/${slug}`;

  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  const tenantId =
    request.headers.get("x-tenant-db") || process.env.NEXT_PUBLIC_TENANT_DB;
  if (tenantId) {
    headers.set("x-tenant-db", tenantId);
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Proxy request failed", error: String(error) },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  const slug = params.slug?.join("/") || "";
  const body = await request.json();
  const url = `${BACKEND_URL}/${slug}`;

  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  const tenantId =
    request.headers.get("x-tenant-db") || process.env.NEXT_PUBLIC_TENANT_DB;
  if (tenantId) {
    headers.set("x-tenant-db", tenantId);
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Proxy request failed", error: String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  const slug = params.slug?.join("/") || "";
  const url = `${BACKEND_URL}/${slug}`;

  const headers = new Headers();
  const tenantId =
    request.headers.get("x-tenant-db") || process.env.NEXT_PUBLIC_TENANT_DB;
  if (tenantId) {
    headers.set("x-tenant-db", tenantId);
  }

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Proxy request failed", error: String(error) },
      { status: 500 },
    );
  }
}
```

TARGET 8: src/styles/globals.template.css

```css
/* ==========================================================
   GLOBAL STYLES WITH BLUEPRINT CSS VARIABLES
   All values use var(--*) which are injected at runtime
   NO HARDCODED COLORS, FONTS, OR SPACING VALUES
========================================================== */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --brand-blue: {{PRIMARY_COLOR}};
    --brand-dark-blue: {{PRIMARY_DARK_COLOR}};
    --brand-teal: {{ACCENT_COLOR}};
    --brand-purple: {{SECONDARY_COLOR}};

    --primary: {{PRIMARY_COLOR}};
    --primary-light: {{PRIMARY_LIGHT_COLOR}};
    --primary-dark: {{PRIMARY_DARK_COLOR}};
    --primary-hover: {{PRIMARY_HOVER_COLOR}};
    --secondary: {{SECONDARY_COLOR}};
    --accent: {{ACCENT_COLOR}};
    --accent-hover: {{ACCENT_HOVER_COLOR}};
    --accent-soft: {{ACCENT_SOFT_COLOR}};

    --background: {{BACKGROUND_COLOR}};
    --surface: {{SURFACE_COLOR}};
    --card: {{CARD_COLOR}};

    --text: {{TEXT_COLOR}};
    --text-secondary: {{TEXT_SECONDARY_COLOR}};
    --text-muted: {{TEXT_MUTED_COLOR}};

    --border: {{BORDER_COLOR}};
    --border-hover: {{BORDER_HOVER_COLOR}};

    --success: {{SUCCESS_COLOR}};
    --warning: {{WARNING_COLOR}};
    --error: {{ERROR_COLOR}};
    --info: {{INFO_COLOR}};

    --success-light: {{SUCCESS_LIGHT_COLOR}};
    --warning-light: {{WARNING_LIGHT_COLOR}};
    --error-light: {{ERROR_LIGHT_COLOR}};
    --info-light: {{INFO_LIGHT_COLOR}};

    --card-hover-border: {{PRIMARY_COLOR}};
    --badge-bg: {{BADGE_BG_COLOR}};
    --badge-text: {{TEXT_COLOR}};
    --tag-bg: {{TAG_BG_COLOR}};
    --tag-text: {{PRIMARY_COLOR}};
    --testimonial-bg: {{TESTIMONIAL_BG_COLOR}};
    --testimonial-border: {{BORDER_COLOR}};
    --stat-number: {{PRIMARY_COLOR}};
    --marketplace-card-bg: {{CARD_COLOR}};
    --integration-icon-bg: {{BADGE_BG_COLOR}};
    --momentum-accent: {{PRIMARY_COLOR}};
    --sales-badge-bg: {{ERROR_COLOR}};
    --sales-badge-text: {{SALES_BADGE_TEXT_COLOR}};
    --font-body:
      system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      sans-serif;
    --font-heading:
      system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    font-family: var(--font-body);
    background: var(--background);
    color: var(--text);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    font-family: var(--font-heading);
  }

  .skip-to-content {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary);
    color: white;
    padding: 8px;
    z-index: 100;
    text-decoration: none;
  }

  .skip-to-content:focus {
    top: 0;
  }

  :focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--surface);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 999px;
  }
}

@layer components {
  .container-custom {
    max-width: var(--container);
    margin-inline: auto;
    padding-inline: 16px;
  }

  .section-padding {
    padding-block: var(--section-padding);
  }

  .card-theme {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
  }

  .card-theme:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-2px);
  }

  .card-product {
    background: var(--card);
    border-radius: var(--product-card-radius, var(--radius-lg));
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid var(--border);
  }

  .card-product:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .btn-primary {
    background: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    min-height: var(--btn-height);
    padding-inline: var(--btn-padding-x);
    border-radius: var(--btn-radius);
    font-weight: var(--fw-medium);
    transition: all 0.3s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-primary:hover {
    background: var(--btn-primary-hover);
    transform: translateY(-2px);
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  .btn-secondary {
    background: var(--btn-secondary-bg);
    color: var(--btn-secondary-text);
    min-height: var(--btn-height);
    padding-inline: var(--btn-padding-x);
    border-radius: var(--btn-radius);
    font-weight: var(--fw-medium);
    transition: all 0.3s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid var(--border);
  }

  .btn-secondary:hover {
    background: var(--btn-secondary-hover);
    transform: translateY(-2px);
  }

  .btn-outline {
    background: transparent;
    border: 1px solid var(--btn-outline-border);
    color: var(--btn-outline-text);
    min-height: var(--btn-height);
    padding-inline: var(--btn-padding-x);
    border-radius: var(--btn-radius);
    font-weight: var(--fw-medium);
    transition: all 0.3s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-outline:hover {
    background: var(--btn-outline-hover-bg);
    color: var(--btn-outline-hover-text);
    transform: translateY(-2px);
  }

  .btn-ghost {
    background: transparent;
    color: var(--text);
    min-height: var(--btn-height);
    padding-inline: var(--btn-padding-x);
    border-radius: var(--btn-radius);
    font-weight: var(--fw-medium);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .btn-ghost:hover {
    background: var(--surface);
  }

  .form-input {
    background: var(--input-bg);
    color: var(--input-text);
    border: 1px solid var(--input-border);
    border-radius: var(--input-radius);
    padding: var(--input-padding-y) var(--input-padding-x);
    min-height: var(--input-height);
    width: 100%;
    transition: all 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--input-focus-border);
    box-shadow: var(--input-focus-shadow);
  }

  .form-input::placeholder {
    color: var(--input-placeholder);
  }

  .form-input:disabled {
    background: var(--input-disabled-bg);
    color: var(--input-disabled-text);
    cursor: not-allowed;
  }

  textarea.form-input {
    min-height: var(--textarea-min-height);
  }

  .gradient-text {
    background: linear-gradient(
      135deg,
      var(--primary) 0%,
      var(--secondary) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .gradient-bg {
    background: linear-gradient(
      135deg,
      var(--primary) 0%,
      var(--secondary) 100%
    );
  }
}
```

TARGET 9: src/middleware.ts

```typescript
// ============================================================
// MIDDLEWARE FOR CLEAN URLS
// Default language (en) has NO prefix in URLs
// Other languages (hi) have prefix
// ============================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "de"];
const DEFAULT_LOCALE = "en";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/admin")
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const firstSegment = segments[1];

 const hasLocale = LOCALES.includes(
  firstSegment as (typeof LOCALES)[number]
);

  if (hasLocale) {
    if (firstSegment === DEFAULT_LOCALE) {
      const newPathname = pathname.replace(`/${DEFAULT_LOCALE}`, "") || "/";
      return NextResponse.redirect(new URL(newPathname, request.url));
    }
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|admin).*)"],
};
```

TARGET 10: src/lib/i18n/locale.ts

```typescript
// ============================================================
// LOCALIZATION UTILITIES
// Handles localized string extraction with type safety
// ============================================================

import { LocalizedString } from "@/redux/slices/blueprint/blueprintType";

export type Locale = "en" | string;

export const DEFAULT_LOCALE: Locale = "en";
export const SUPPORTED_LOCALES: string[] = ["en", "de"];

export function getLocalizedString(
  text: LocalizedString | string | undefined,
  locale: Locale = DEFAULT_LOCALE,
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.en || "";
}
```

TARGET 11: src/redux/store/hooks.ts

```typescript
// ============================================================
// TYPED REDUX HOOKS
// ============================================================

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

TARGET 12: src/redux/store/index.ts

```typescript
// ============================================================
// REDUX STORE CONFIGURATION
// ============================================================

import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV !== "production",
  });
};

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

TARGET 13: src/redux/store/rootReducer.ts

```typescript
// ============================================================
// ROOT REDUCER
// Combines all Redux slices
// ============================================================

import { combineReducers } from "@reduxjs/toolkit";
import { blueprintReducer } from "../slices/blueprint";
import pagesReducer from "../slices/pages/pagesSlice";
import cartReducer from "../slices/ecommerce/cartSlice";
import authReducer from "../slices/ecommerce/authSlice";
import ordersReducer from "../slices/ecommerce/ordersSlice";

const rootReducer = combineReducers({
  blueprint: blueprintReducer,
  pages: pagesReducer,
  cart: cartReducer,
  auth: authReducer,
  orders: ordersReducer,
});

export default rootReducer;
```

TARGET 14: src/redux/provider.tsx

```typescript
// ============================================================
// REDUX PROVIDER
// ============================================================

'use client';

import { Provider } from 'react-redux';
import { store } from './store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
```

TARGET 15: src/redux/slices/ecommerce/cartSlice.ts

```typescript
// ============================================================
// CART SLICE
// Manages shopping cart state
// ============================================================

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantId?: string;
  variantName?: string;
  maxQuantity: number;
}

export interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  couponCode: null,
  discount: 0,
  loading: false,
  error: null,
};

export const fetchCartThunk = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const addToCartThunk = createAsyncThunk(
  "cart/add",
  async (item: Omit<CartItem, "id">, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateCartItemThunk = createAsyncThunk(
  "cart/update",
  async (
    { id, quantity }: { id: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const removeCartItemThunk = createAsyncThunk(
  "cart/remove",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const applyCouponThunk = createAsyncThunk(
  "cart/coupon",
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.couponCode = null;
      state.discount = 0;
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && quantity <= item.maxQuantity && quantity > 0) {
        item.quantity = quantity;
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartThunk.fulfilled, (state, action) => {
      state.items = action.payload.items;
      state.couponCode = action.payload.couponCode;
      state.discount = action.payload.discount;
    });
    builder.addCase(addToCartThunk.fulfilled, (state, action) => {
      state.items = action.payload.items;
    });
    builder.addCase(updateCartItemThunk.fulfilled, (state, action) => {
      state.items = action.payload.items;
    });
    builder.addCase(removeCartItemThunk.fulfilled, (state, action) => {
      state.items = action.payload.items;
    });
    builder.addCase(applyCouponThunk.fulfilled, (state, action) => {
      state.couponCode = action.payload.code;
      state.discount = action.payload.discount;
    });
  },
});

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartItemCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartDiscount = (state: RootState) => state.cart.discount;
export const selectCartLoading = (state: RootState) => state.cart.loading;

export const { clearCart, updateQuantity, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
```

TARGET 16: src/redux/slices/ecommerce/authSlice.ts

```typescript
// ============================================================
// AUTH SLICE WITH WISHLIST INTEGRATION
// Manages user authentication and wishlist (stored in user profile)
// ============================================================

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export interface ProductFormState {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  [key: string]: any;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "user" | "admin";
  wishlist?: ProductFormState[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchMeThunk = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async ({ userData }: { userData: any }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as any;
      const response = await fetch(`/api/auth/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-db": process.env.NEXT_PUBLIC_TENANT_DB || "",
        },
        credentials: "include",
        body: JSON.stringify({ ...userData, id: auth.user.id }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Profile update failed");
      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    toggleWishlist: (state, action: PayloadAction<ProductFormState>) => {
      if (!state.user) return;
      const product = action.payload;
      const wishlist = state.user.wishlist || [];
      const exists = wishlist.find((item) => item.id === product.id);
      if (exists) {
        state.user.wishlist = wishlist.filter((item) => item.id !== product.id);
      } else {
        state.user.wishlist = [...wishlist, product];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(registerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchMeThunk.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    });
    builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectWishlist = (state: RootState) =>
  state.auth.user?.wishlist || [];
export const selectIsInWishlist = (state: RootState, productId: string) => {
  const wishlist = state.auth.user?.wishlist || [];
  return wishlist.some((item) => item.id === productId);
};

export const { logout, clearAuthError, toggleWishlist } = authSlice.actions;
export default authSlice.reducer;
```

TARGET 17: src/redux/slices/pages/pageType.ts

```typescript
// ============================================================
// PAGE TYPES (FROM JSON)
// Data flows: JSON → Redux → Component
// ============================================================

export type LocalizedString = {
  en: string;
  [locale: string]: string;
};

export type PageType =
  | "home"
  | "shop"
  | "product"
  | "cart"
  | "checkout"
  | "wishlist"
  | "about"
  | "contact"
  | "faq"
  | "terms"
  | "privacy"
  | "returns";

export type SectionType =
  | "hero"
  | "grid"
  | "product-grid"
  | "featured-collections"
  | "testimonials"
  | "cart-items"
  | "checkout-form"
  | "faq-accordion"
  | "cta"
  | "text"
  | "image"
  | "metrics"
  | "accordion";

export interface ContentItem {
  id: string;
  type: string;
  props: Record<string, any>;
}

export interface PageBlock {
  id: string;
  type: SectionType;
  adminTitle: string;
  props?: Record<string, any>;
  content?: ContentItem[];
}

export interface Page {
  pageType: PageType;
  slug: string;
  isPublished: boolean;
  seo?: {
    title: LocalizedString;
    description: LocalizedString;
    keywords?: LocalizedString;
    ogImage?: string;
  };
  sections: PageBlock[];
}

export interface PagesState {
  allPages: Page[];
  currentPages: Page | null;
  isAllPageFetched: boolean;
  isError: boolean;
  isLoading: boolean;
  isEditablePage: boolean;
}
```

TARGET 18: src/redux/slices/pages/pagesSlice.ts

```typescript
// ============================================================
// PAGES SLICE
// Manages page content from JSON files
// Data flow: JSON → Redux → Component
// ============================================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PagesState, Page, PageBlock, ContentItem } from "./pageType";
import homePageData from "@/lib/data/pages/homePage.json";
import shopPageData from "@/lib/data/pages/shopPage.json";
import cartPageData from "@/lib/data/pages/cartPage.json";
import checkoutPageData from "@/lib/data/pages/checkoutPage.json";
import wishlistPageData from "@/lib/data/pages/wishlistPage.json";
import aboutPageData from "@/lib/data/pages/aboutPage.json";
import contactPageData from "@/lib/data/pages/contactPage.json";
import faqPageData from "@/lib/data/pages/faqPage.json";
import termsPageData from "@/lib/data/pages/termsPage.json";
import privacyPageData from "@/lib/data/pages/privacyPage.json";
import returnsPageData from "@/lib/data/pages/returnsPage.json";

const initialState: PagesState = {
  allPages: [
    homePageData,
    shopPageData,
    cartPageData,
    checkoutPageData,
    wishlistPageData,
    aboutPageData,
    contactPageData,
    faqPageData,
    termsPageData,
    privacyPageData,
    returnsPageData,
  ] as Page[],
  currentPages: null,
  isAllPageFetched: false,
  isError: false,
  isLoading: false,
  isEditablePage: false,
};

const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

const deepSetValue = (obj: any, path: string[], value: any): boolean => {
  if (path.length === 0) return false;

  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (!current[path[i]]) {
      current[path[i]] = {};
    }
    current = current[path[i]];
    if (typeof current !== "object") return false;
  }

  const lastKey = path[path.length - 1];
  current[lastKey] = value;
  return true;
};

const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    setCurrentPageBySlug: (state, action: PayloadAction<string>) => {
      const slug = action.payload;
      const foundPage = state.allPages.find((page) => page.slug === slug);
      state.currentPages = foundPage ? deepClone(foundPage) : null;
    },
    setEditableMode: (state, action: PayloadAction<boolean>) => {
      state.isEditablePage = action.payload;
    },
    updatePageField: (
      state,
      action: PayloadAction<{
        sectionId: string;
        fieldPath: string;
        value: string;
        locale?: string;
      }>,
    ) => {
      const { sectionId, fieldPath, value, locale = "en" } = action.payload;

      if (!state.currentPages || !state.currentPages.sections) return;

      const sectionIndex = state.currentPages.sections.findIndex(
        (s) => s.id === sectionId,
      );
      if (sectionIndex === -1) return;

      const pathParts = fieldPath.split(".");

      const updatedCurrentPages = deepClone(state.currentPages);
      const sectionToUpdate = updatedCurrentPages.sections[sectionIndex];

      const success = deepSetValue(sectionToUpdate, pathParts, value);

      if (success) {
        state.currentPages = updatedCurrentPages;

        const pageIndex = state.allPages.findIndex(
          (p) => p.slug === updatedCurrentPages.slug,
        );
        if (pageIndex !== -1) {
          const updatedAllPages = deepClone(state.allPages);
          const allPageSection = updatedAllPages[pageIndex].sections.find(
            (s) => s.id === sectionId,
          );
          if (allPageSection) {
            deepSetValue(allPageSection, pathParts, value);
          }
          state.allPages = updatedAllPages;
        }
      }
    },
    refreshCurrentPage: (state) => {
      if (state.currentPages) {
        const refreshed = state.allPages.find(
          (p) => p.slug === state.currentPages?.slug,
        );
        if (refreshed) {
          state.currentPages = deepClone(refreshed);
        }
      }
    },
  },
});

export const {
  setCurrentPageBySlug,
  setEditableMode,
  updatePageField,
  refreshCurrentPage,
} = pagesSlice.actions;
export default pagesSlice.reducer;
```

TARGET 19: src/redux/slices/pages/saveField.ts

```typescript
// ============================================================
// SAVE FIELD UTILITY
// Returns Promise for EditableText component
// ============================================================

import { Dispatch } from "@reduxjs/toolkit";
import { updatePageField } from "./pagesSlice";
import { Page } from "./pageType";

export const saveField = (
  dispatch: Dispatch,
  currentPages: Page | null,
  sectionId: string,
  fieldPath: string,
  value: string,
  locale: string = "en",
): Promise<void> => {
  return new Promise((resolve) => {
    if (!currentPages) {
      resolve();
      return;
    }

    dispatch(
      updatePageField({
        sectionId,
        fieldPath,
        value,
        locale,
      }),
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
};
```

TARGET 20: src/components/shared/EditableText.tsx

```typescript
// ============================================================
// EDITABLE TEXT COMPONENT
// Supports inline editing with HTML stripping and style preservation
// ============================================================

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface EditableTextProps {
  value: string;
  onSave: (value: string) => Promise<void> | void;
  isEditable?: boolean;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

export default function EditableText({
  value,
  onSave,
  isEditable = false,
  tag: Tag = 'span',
  className = '',
  placeholder = 'Click to edit...',
  multiline = false,
  rows = 3,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [inputStyles, setInputStyles] = useState<Record<string, string>>({});
  const displayRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const originalValueRef = useRef(value);

  useEffect(() => {
    if (!isEditing || (isEditing && value !== editValue)) {
      setEditValue(value);
      originalValueRef.current = value;
    }
  }, [value, isEditing, editValue, isSaving]);

  const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  const getCleanText = (htmlText: string): string => {
    return stripHtmlTags(htmlText);
  };

  const startEditing = useCallback(() => {
    if (!isEditable || isSaving) return;

    if (displayRef.current) {
      const computedStyle = window.getComputedStyle(displayRef.current);
      const stylesToCopy = [
        'fontFamily', 'fontSize', 'fontWeight', 'lineHeight',
        'letterSpacing', 'textAlign', 'color', 'backgroundColor',
        'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'
      ];

      const copiedStyles: Record<string, string> = {};
      stylesToCopy.forEach(style => {
        const styleValue = computedStyle.getPropertyValue(style);
        if (styleValue && styleValue !== 'none') {
          copiedStyles[style] = styleValue;
        }
      });
      setInputStyles(copiedStyles);
    }

    setEditValue(getCleanText(value));
    originalValueRef.current = value;
    setIsEditing(true);
  }, [isEditable, value, isSaving]);

  const saveEdit = useCallback(async () => {
    if (!isEditing || isSaving) return;

    const cleanValue = editValue.trim();
    const originalClean = getCleanText(originalValueRef.current);

    if (cleanValue !== originalClean) {
      setIsSaving(true);
      try {
        await onSave(cleanValue);
      } catch (error) {
        console.error('Failed to save:', error);
        setEditValue(originalClean);
        setIsSaving(false);
      }
    } else {
      setIsEditing(false);
      setIsSaving(false);
    }
  }, [isEditing, editValue, onSave, isSaving]);

  useEffect(() => {
    if (isSaving && value === editValue && value !== originalValueRef.current) {
      setIsSaving(false);
      setIsEditing(false);
    }
  }, [isSaving, value, editValue]);

  const cancelEdit = useCallback(() => {
    if (isSaving) return;
    setEditValue(getCleanText(originalValueRef.current));
    setIsEditing(false);
  }, [isSaving]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  }, [saveEdit, cancelEdit, multiline]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (!multiline && inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing, multiline]);

  if (!isEditing) {
    const displayValue = getCleanText(value) || placeholder;

    return (
      <Tag
        ref={displayRef}
        onClick={startEditing}
        className={`${className} ${isEditable ? 'cursor-pointer hover:bg-[var(--surface)] transition-colors rounded px-1 -mx-1' : ''}`}
        style={isEditable ? { minHeight: '1.5em' } : undefined}
      >
        {displayValue === placeholder && isEditable ? (
          <span className="text-[var(--text-muted)] italic">{placeholder}</span>
        ) : (
          displayValue
        )}
      </Tag>
    );
  }

  const commonInputProps = {
    value: editValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEditValue(e.target.value),
    onBlur: saveEdit,
    onKeyDown: handleKeyDown,
    className: `${className} w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${isSaving ? 'opacity-50' : ''}`,
    placeholder: placeholder,
    disabled: isSaving,
    style: inputStyles,
  };

  if (multiline) {
    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        rows={rows}
        {...commonInputProps}
      />
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type="text"
      {...commonInputProps}
    />
  );
}
```

TARGET 21: src/components/shared/EditModeToggle.tsx

```typescript
// ============================================================
// EDIT MODE TOGGLE COMPONENT
// Only visible in development mode
// ============================================================

'use client';

import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { setEditableMode } from '@/redux/slices/pages/pagesSlice';

export default function EditModeToggle() {
  const dispatch = useAppDispatch();
  const isEditable = useAppSelector((state) => state.pages.isEditablePage);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <button
      onClick={() => dispatch(setEditableMode(!isEditable))}
      className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full shadow-lg transition-colors ${
        isEditable
          ? 'bg-[var(--success)] text-white hover:bg-[var(--success)]/80'
          : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]'
      }`}
    >
      {isEditable ? '✓ Edit Mode ON' : '✎ Edit Mode OFF'}
    </button>
  );
}
```

TARGET 22: src/components/layout/Header.tsx

```typescript
// ============================================================
// HEADER COMPONENT
// Reads from headerData.json and Blueprint navigation
// NO LANGUAGE TOGGLE BUTTON
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { selectPublicNavigation } from '@/redux/slices/blueprint';
import { selectCartItemCount } from '@/redux/slices/ecommerce/cartSlice';
import { selectIsAuthenticated, logout, selectWishlist } from '@/redux/slices/ecommerce/authSlice';
import { getLocalizedString } from '@/lib/i18n/locale';
import headerData from '@/lib/data/pages/headerData.json';

export default function Header() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const dispatch = useAppDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const blueprintNav = useAppSelector(selectPublicNavigation);
  const cartCount = useAppSelector(selectCartItemCount);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const wishlist = useAppSelector(selectWishlist);
  const wishlistCount = wishlist.length;

  const navigationItems = blueprintNav?.public || headerData.navigation;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getLocalizedHref = (href: string) => {
    if (href === '/') return locale === 'en' ? '/' : `/${locale}`;
    return locale === 'en' ? href : `/${locale}${href}`;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-[var(--surface)] shadow-md' : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-[var(--navbar-height)]">
          <Link href={getLocalizedHref('/')} className="text-2xl font-bold">
            <span className="gradient-text">{getLocalizedString(headerData.logo.text, locale)}</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <div key={index} className="relative group">
                <Link
                  href={getLocalizedHref(item.href === '/' ? '/' : item.href)}
                  className={`py-2 transition-colors hover:text-[var(--primary)] ${
                    pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                      ? 'text-[var(--primary)]'
                      : 'text-[var(--text)]'
                  }`}
                >
                  {getLocalizedString(item.label, locale)}
                </Link>
                {item.dropdownItems && item.dropdownItems.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {item.dropdownItems.map((dropdownItem, idx) => (
                      <Link
                        key={idx}
                        href={getLocalizedHref(dropdownItem.href)}
                        className="block px-4 py-2 hover:bg-[var(--surface)] transition-colors"
                      >
                        {getLocalizedString(dropdownItem.label, locale)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link href={getLocalizedHref('/search')} className="p-2 hover:text-[var(--primary)] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            <Link href={getLocalizedHref('/wishlist')} className="relative p-2 hover:text-[var(--primary)] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--primary)] text-white text-xs rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href={getLocalizedHref('/cart')} className="relative p-2 hover:text-[var(--primary)] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--primary)] text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 hover:text-[var(--primary)] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href={getLocalizedHref('/account')} className="block px-4 py-2 hover:bg-[var(--surface)] transition-colors">
                    My Account
                  </Link>
                  <Link href={getLocalizedHref('/account/orders')} className="block px-4 py-2 hover:bg-[var(--surface)] transition-colors">
                    Orders
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-[var(--surface)] transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href={getLocalizedHref('/account')} className="p-2 hover:text-[var(--primary)] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:text-[var(--primary)] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--surface)] border-t border-[var(--border)]">
          <div className="container-custom py-4">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={getLocalizedHref(item.href === '/' ? '/' : item.href)}
                className="block py-3 hover:text-[var(--primary)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {getLocalizedString(item.label, locale)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
```

TARGET 23: src/components/layout/Footer.tsx

```typescript
// ============================================================
// FOOTER COMPONENT
// Reads from footerData.json and Blueprint navigation
// ============================================================

'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getLocalizedString } from '@/lib/i18n/locale';
import footerData from '@/lib/data/pages/footerData.json';

export default function Footer() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const currentYear = new Date().getFullYear();

  const getLocalizedHref = (href: string) => {
    if (href === '/') return locale === 'en' ? '/' : `/${locale}`;
    return locale === 'en' ? href : `/${locale}${href}`;
  };

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 gradient-text">
              {getLocalizedString(footerData.brand.name, locale)}
            </h3>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              {getLocalizedString(footerData.brand.description, locale)}
            </p>
            <div className="flex space-x-4">
              {footerData.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={getLocalizedHref(link.href === '/' ? '/' : link.href)}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors text-sm"
                  >
                    {getLocalizedString(link.label, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerData.bottomBar.links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={getLocalizedHref(link.href)}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors text-sm"
                  >
                    {getLocalizedString(link.label, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>{getLocalizedString(footerData.contact.address, locale)}</li>
              <li>{footerData.contact.phone}</li>
              <li>{footerData.contact.email}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--border)] text-center text-sm text-[var(--text-muted)]">
          {getLocalizedString(footerData.bottomBar.copyright, locale).replace('{year}', currentYear.toString())}
        </div>
      </div>
    </footer>
  );
}
```

TARGET 24: src/app/[locale]/layout.tsx

```typescript
// ============================================================
// ROOT LAYOUT WITH BLUEPRINT PROVIDER
// NO LANGUAGE TOGGLE BUTTON - uses clean URLs
// ============================================================

import type { Metadata } from 'next';
import { ReduxProvider } from '@/redux/provider';
import BlueprintProvider from '@/components/providers/BlueprintProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EditModeToggle from '@/components/shared/EditModeToggle';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: '{{COMPANY_NAME}} - Fashion for the Bold',
  description: 'Discover bold fashion at {{COMPANY_NAME}}. Free shipping on orders over {{CURRENCY_SYMBOL}}{{FREE_SHIPPING_THRESHOLD}}.',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ReduxProvider>
          <BlueprintProvider context="public">
            <a href="#main-content" className="skip-to-content">
              Skip to content
            </a>
            <Header />
            <main id="main-content" className="flex-grow pt-[var(--navbar-height)]">
              {children}
            </main>
            <Footer />
            <EditModeToggle />
          </BlueprintProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
```

TARGET 25: src/app/[locale]/page.tsx (Homepage)

```typescript
// ============================================================
// HOMEPAGE
// Client component with EditableText integration
// Data flow: JSON → Redux → Component
// ============================================================

'use client';

import { useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { setCurrentPageBySlug } from '@/redux/slices/pages/pagesSlice';
import { saveField } from '@/redux/slices/pages/saveField';
import EditableText from '@/components/shared/EditableText';
import { getLocalizedString } from '@/lib/i18n/locale';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const dispatch = useAppDispatch();

  const currentPages = useAppSelector((state) => state.pages.currentPages);
  const isEditable = useAppSelector((state) => state.pages.isEditablePage);

  useEffect(() => {
    if (!currentPages || currentPages.slug !== 'home') {
      dispatch(setCurrentPageBySlug('home'));
    }
  }, [dispatch, currentPages]);

  const createSaveHandler = useCallback((sectionId: string, fieldPath: string) => {
    return async (value: string) => {
      await saveField(dispatch, currentPages, sectionId, fieldPath, value, locale);
    };
  }, [dispatch, currentPages, locale]);

  if (!currentPages || !currentPages.sections) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const heroSection = currentPages.sections.find(s => s.adminTitle === 'Hero');
  const featuresSection = currentPages.sections.find(s => s.adminTitle === 'Features');
  const ctaSection = currentPages.sections.find(s => s.adminTitle === 'Call to Action');

  return (
    <main>
      {heroSection && (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-bg.jpg"
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="container-custom relative z-10 text-center text-white">
            <EditableText
              value={getLocalizedString(heroSection.props?.heading, locale)}
              onSave={createSaveHandler(heroSection.id, 'props.heading')}
              isEditable={isEditable}
              tag="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              placeholder="Enter hero heading..."
            />
            <EditableText
              value={getLocalizedString(heroSection.props?.subheading, locale)}
              onSave={createSaveHandler(heroSection.id, 'props.subheading')}
              isEditable={isEditable}
              tag="p"
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
              placeholder="Enter hero subheading..."
              multiline
              rows={2}
            />
            <div className="flex gap-4 justify-center">
              <Link href={`/${locale === 'en' ? '' : locale}${heroSection.props?.primaryButtonLink || '/shop'}`}>
                <EditableText
                  value={getLocalizedString(heroSection.props?.primaryButtonText, locale)}
                  onSave={createSaveHandler(heroSection.id, 'props.primaryButtonText')}
                  isEditable={isEditable}
                  tag="span"
                  className="btn-primary inline-flex items-center"
                  placeholder="Button text"
                />
              </Link>
            </div>
          </div>
        </section>
      )}

      {featuresSection && featuresSection.content && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <EditableText
                value={getLocalizedString(featuresSection.props?.sectionTitle, locale)}
                onSave={createSaveHandler(featuresSection.id, 'props.sectionTitle')}
                isEditable={isEditable}
                tag="h2"
                className="text-3xl md:text-4xl font-bold mb-4"
                placeholder="Section title..."
              />
              <EditableText
                value={getLocalizedString(featuresSection.props?.sectionSubtitle, locale)}
                onSave={createSaveHandler(featuresSection.id, 'props.sectionSubtitle')}
                isEditable={isEditable}
                tag="p"
                className="text-[var(--text-secondary)] max-w-2xl mx-auto"
                placeholder="Section subtitle..."
                multiline
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuresSection.content.map((feature, idx) => (
                <div key={feature.id} className="card-theme p-6 text-center">
                  <div className="text-4xl mb-4">{feature.props?.icon}</div>
                  <EditableText
                    value={getLocalizedString(feature.props?.title, locale)}
                    onSave={createSaveHandler(featuresSection.id, `content.${idx}.props.title`)}
                    isEditable={isEditable}
                    tag="h3"
                    className="text-xl font-semibold mb-2"
                    placeholder="Feature title..."
                  />
                  <EditableText
                    value={getLocalizedString(feature.props?.description, locale)}
                    onSave={createSaveHandler(featuresSection.id, `content.${idx}.props.description`)}
                    isEditable={isEditable}
                    tag="p"
                    className="text-[var(--text-secondary)]"
                    placeholder="Feature description..."
                    multiline
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {ctaSection && (
        <section className="section-padding bg-[var(--primary)] text-white">
          <div className="container-custom text-center">
            <EditableText
              value={getLocalizedString(ctaSection.props?.title, locale)}
              onSave={createSaveHandler(ctaSection.id, 'props.title')}
              isEditable={isEditable}
              tag="h2"
              className="text-3xl md:text-4xl font-bold mb-4"
              placeholder="CTA title..."
            />
            <EditableText
              value={getLocalizedString(ctaSection.props?.subtitle, locale)}
              onSave={createSaveHandler(ctaSection.id, 'props.subtitle')}
              isEditable={isEditable}
              tag="p"
              className="text-lg mb-8 max-w-2xl mx-auto"
              placeholder="CTA subtitle..."
              multiline
              rows={2}
            />
            <Link href={`/${locale === 'en' ? '' : locale}${ctaSection.props?.buttonLink || '/shop'}`}>
              <EditableText
                value={getLocalizedString(ctaSection.props?.buttonText, locale)}
                onSave={createSaveHandler(ctaSection.id, 'props.buttonText')}
                isEditable={isEditable}
                tag="span"
                className="btn-secondary inline-flex items-center"
                placeholder="Button text..."
              />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
```

TARGET 26: src/lib/paymentgateway/base.ts

```typescript
// ============================================================
// PAYMENT GATEWAY BASE CLASS
// Abstract base class and common interfaces/types for payments
// ============================================================

export type PaymentMethod = "cod" | "razorpay" | "stripe" | "paypal";

export type ShippingMethod = "standard" | "express" | "same_day";

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  quantity: number;
  price: number;
  compareAtPrice: number;
  variantId: string | null;
  variantTitle: string | null;
  selectedOptions: Record<string, any>;
  image: string;
}

export interface OrderPricing {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface Address {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  email?: string;
}

export interface PaymentGatewayResponse {
  status: string;
  amount: number;
  currency: string;
}

export interface OrderPayment {
  method: PaymentMethod;
  transactionId?: string;
  paymentGatewayResponse?: {
    status: "captured" | "authorized" | "failed" | "pending";
    amount: number;
    currency: string;
  };
  paidAt?: string;
  extra?: Record<string, any>;
}

export interface OrderShipping {
  method: ShippingMethod;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  pricing: OrderPricing;
  shippingAddress: Address;
  billingAddress: Address;
  payment: OrderPayment;
  shipping: OrderShipping;
  currency: string;
  fulfillmentStatus: string;
  orderNumber: string;
  statusHistory?: any[];
}

export interface OrderPayload {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
}

export abstract class PaymentGateway {
  abstract id: string;
  abstract name: string;

  abstract loadscript(): Promise<void>;

  abstract initiatePayment(
    payload: OrderPayload,
    key?: string,
    address?: string,
  ): Promise<OrderPayment>;

  buildOrderPaymentBlock(result: OrderPayment) {
    return {
      method: result.method,
      transactionId: result.transactionId,
      paymentGatewayResponse: {
        status: result.paymentGatewayResponse?.status,
        amount: result.paymentGatewayResponse?.amount,
        currency: result.paymentGatewayResponse?.currency,
      },
      paidAt: result.paidAt,
    };
  }
}
```

TARGET 27: src/lib/paymentgateway/razorpay.ts

```typescript
// ============================================================
// RAZORPAY GATEWAY IMPLEMENTATION
// Class for loading Razorpay script and initiating payment flow
// ============================================================

import { OrderPayload, OrderPayment, PaymentGateway } from "./base";

export class RazorpayGateway extends PaymentGateway {
  id = "razorpay";
  name = "Razorpay";

  async loadscript(): Promise<void> {
    if (document.getElementById("razorpay-script")) return;
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay"));
      document.body.appendChild(script);
    });
  }

  async initiatePayment(
    payload: OrderPayload,
    key: string,
    address: string,
  ): Promise<OrderPayment> {
    await this.loadscript();

    return new Promise((resolve, reject) => {
      const options = {
        key,
        amount: payload.amount,
        currency: payload.currency,
        name: payload.customerName,
        description: "{{COMPANY_NAME}} Order Payment",
        image: "{{COMPANY_LOGO_URL}}",
        order_id: payload.orderId,
        prefill: {
          name: payload.customerName,
          email: payload.customerEmail,
        },
        notes: {
          address: address,
        },
        handler: (response: any) => {
          resolve({
            transactionId: response.razorpay_payment_id,
            method: "razorpay",
            paymentGatewayResponse: {
              status: "captured",
              amount: payload.amount,
              currency: payload.currency,
            },
            paidAt: new Date().toISOString(),
            extra: {
              razorpaySignature: response.razorpay_signature,
            },
          });
        },
        modal: {
          ondismiss: () => {
            reject(new Error("Payment cancelled"));
          },
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    });
  }
}
```

TARGET 28: src/lib/paymentgateway/registry.ts

```typescript
// ============================================================
// GATEWAY REGISTRY
// Maps gateway ID to instance and resolves active payment handler
// ============================================================

import { PaymentGateway } from "./base";
import { RazorpayGateway } from "./razorpay";

const gatewayRegistry: Record<string, PaymentGateway> = {
  razorpay: new RazorpayGateway(),
};

export function getGateway(id: string): PaymentGateway {
  const gw = gatewayRegistry[id];
  if (!gw) {
    throw new Error(`Payment gateway ${id} not found`);
  }
  return gw;
}
```

---

## JSON DATA FILES

TARGET 29: src/lib/data/pages/homePage.json

```json
{
  "pageType": "home",
  "slug": "home",
  "isPublished": true,
  "seo": {
    "title": {
      "en": "{{COMPANY_NAME}} - {{COMPANY_TAGLINE}}"
    },
    "description": {
      "en": "Discover premium products at {{COMPANY_NAME}}. Free shipping on orders over {{CURRENCY_SYMBOL}}{{FREE_SHIPPING_THRESHOLD}}."
    }
  },
  "sections": [
    {
      "id": "hero-section-1",
      "type": "hero",
      "adminTitle": "Hero",
      "props": {
        "heading": {
          "en": "Define Your Brand"
        },
        "subheading": {
          "en": "Bold designs. Premium products. Built for you."
        },
        "primaryButtonText": {
          "en": "Shop Now"
        },
        "primaryButtonLink": "/shop",
        "backgroundColor": "primary",
        "alignment": "center"
      }
    },
    {
      "id": "features-section-1",
      "type": "grid",
      "adminTitle": "Features",
      "props": {
        "sectionTitle": {
          "en": "Why Choose Us"
        },
        "sectionSubtitle": {
          "en": "Experience the difference with premium quality and service"
        }
      },
      "content": [
        {
          "id": "feature-1",
          "type": "card",
          "props": {
            "title": {
              "en": "Premium Quality"
            },
            "description": {
              "en": "Carefully selected and meticulously crafted"
            },
            "icon": "✨"
          }
        },
        {
          "id": "feature-2",
          "type": "card",
          "props": {
            "title": {
              "en": "Free Shipping"
            },
            "description": {
              "en": "On orders above {{CURRENCY_SYMBOL}}{{FREE_SHIPPING_THRESHOLD}} across India"
            },
            "icon": "🚚"
          }
        },
        {
          "id": "feature-3",
          "type": "card",
          "props": {
            "title": {
              "en": "Easy Returns"
            },
            "description": {
              "en": "30-day return policy, no questions asked"
            },
            "icon": "🔄"
          }
        }
      ]
    },
    {
      "id": "cta-section-1",
      "type": "cta",
      "adminTitle": "Call to Action",
      "props": {
        "title": {
          "en": "Ready to Get Started?"
        },
        "subtitle": {
          "en": "Join thousands of satisfied customers who have found their perfect products."
        },
        "buttonText": {
          "en": "Shop Collection"
        },
        "buttonLink": "/shop"
      }
    }
  ]
}
```

TARGET 30: src/lib/data/pages/headerData.json

```json
{
  "logo": {
    "text": {
      "en": "{{COMPANY_NAME}}"
    }
  },
  "navigation": [
    {
      "label": {
        "en": "Home"
      },
      "href": "/"
    },
    {
      "label": {
        "en": "Shop"
      },
      "href": "/shop",
      "dropdownItems": [
        {
          "label": {
            "en": "All Products"
          },
          "href": "/shop"
        },
        {
          "label": {
            "en": "New Arrivals"
          },
          "href": "/shop?category=new"
        },
        {
          "label": {
            "en": "Best Sellers"
          },
          "href": "/shop?category=bestsellers"
        }
      ]
    },
    {
      "label": {
        "en": "About"
      },
      "href": "/about"
    },
    {
      "label": {
        "en": "Contact"
      },
      "href": "/contact"
    },
    {
      "label": {
        "en": "FAQ"
      },
      "href": "/faq"
    }
  ]
}
```

TARGET 31: src/lib/data/pages/footerData.json

```json
{
  "brand": {
    "name": {
      "en": "{{COMPANY_NAME}}"
    },
    "description": {
      "en": "{{COMPANY_NAME}} - Premium products and excellent service."
    }
  },
  "quickLinks": [
    {
      "label": {
        "en": "Shop"
      },
      "href": "/shop"
    },
    {
      "label": {
        "en": "About Us"
      },
      "href": "/about"
    },
    {
      "label": {
        "en": "Contact"
      },
      "href": "/contact"
    },
    {
      "label": {
        "en": "FAQ"
      },
      "href": "/faq"
    }
  ],
  "contact": {
    "address": {
      "en": "{{COMPANY_ADDRESS}}"
    },
    "phone": "{{COMPANY_PHONE}}",
    "email": "{{COMPANY_EMAIL}}"
  },
  "socialLinks": [
    {
      "platform": "instagram",
      "url": "https://instagram.com/{{PROJECT_SLUG}}"
    },
    {
      "platform": "twitter",
      "url": "https://twitter.com/{{PROJECT_SLUG}}"
    },
    {
      "platform": "facebook",
      "url": "https://facebook.com/{{PROJECT_SLUG}}"
    }
  ],
  "bottomBar": {
    "copyright": {
      "en": "© {year} {{COMPANY_NAME}}. All rights reserved."
    },
    "links": [
      {
        "label": {
          "en": "Privacy Policy"
        },
        "href": "/privacy"
      },
      {
        "label": {
          "en": "Terms of Service"
        },
        "href": "/terms"
      },
      {
        "label": {
          "en": "Returns Policy"
        },
        "href": "/returns"
      }
    ]
  }
}
```

TARGET 32: src/lib/data/pages/shopPage.json

```json
{
  "pageType": "shop",
  "slug": "shop",
  "isPublished": true,
  "seo": {
    "title": {
      "en": "Shop - {{COMPANY_NAME}}"
    },
    "description": {
      "en": "Explore our collection of premium products."
    }
  },
  "sections": [
    {
      "id": "shop-header",
      "type": "text",
      "adminTitle": "Shop Header",
      "props": {
        "heading": {
          "en": "Our Collection"
        },
        "subheading": {
          "en": "Discover our catalog of high-quality products"
        }
      }
    }
  ]
}
```

TARGET 33: src/lib/data/pages/aboutPage.json

```json
{
  "pageType": "about",
  "slug": "about",
  "isPublished": true,
  "seo": {
    "title": {
      "en": "About Us - {{COMPANY_NAME}}"
    },
    "description": {
      "en": "Learn about our story, mission, and values."
    }
  },
  "sections": [
    {
      "id": "about-hero",
      "type": "hero",
      "adminTitle": "About Hero",
      "props": {
        "heading": {
          "en": "Our Story"
        },
        "subheading": {
          "en": "Building premium solutions since 2020"
        }
      }
    }
  ]
}
```

TARGET 34: src/lib/data/pages/contactPage.json

```json
{
  "pageType": "contact",
  "slug": "contact",
  "isPublished": true,
  "seo": {
    "title": {
      "en": "Contact Us - {{COMPANY_NAME}}"
    },
    "description": {
      "en": "Get in touch with our support team."
    }
  },
  "sections": [
    {
      "id": "contact-hero",
      "type": "hero",
      "adminTitle": "Contact Hero",
      "props": {
        "heading": {
          "en": "Get In Touch"
        },
        "subheading": {
          "en": "We'd love to hear from you"
        }
      }
    }
  ]
}
```

TARGET 35: src/lib/data/pages/faqPage.json

```json
{
  "pageType": "faq",
  "slug": "faq",
  "isPublished": true,
  "seo": {
    "title": {
      "en": "FAQ - {{COMPANY_NAME}}"
    },
    "description": {
      "en": "Frequently asked questions about our products and services."
    }
  },
  "sections": [
    {
      "id": "faq-hero",
      "type": "text",
      "adminTitle": "FAQ Header",
      "props": {
        "heading": {
          "en": "Frequently Asked Questions"
        },
        "subheading": {
          "en": "Find answers to common questions"
        }
      }
    },
    {
      "id": "faq-accordion",
      "type": "faq-accordion",
      "adminTitle": "FAQ Accordion",
      "content": [
        {
          "id": "faq-1",
          "type": "faq-item",
          "props": {
            "question": {
              "en": "What is your return policy?"
            },
            "answer": {
              "en": "We offer a 30-day return policy on all unused items."
            }
          }
        },
        {
          "id": "faq-2",
          "type": "faq-item",
          "props": {
            "question": {
              "en": "How long does shipping take?"
            },
            "answer": {
              "en": "Standard shipping takes 3-5 business days."
            }
          }
        }
      ]
    }
  ]
}
```

TARGET 36: src/lib/data/pages/cartPage.json

```json
{
  "pageType": "cart",
  "slug": "cart",
  "isPublished": true,
  "seo": {
    "title": {
      "en": "Cart - {{COMPANY_NAME}}"
    },
    "description": {
      "en": "Review your shopping cart."
    }
  },
  "sections": [
    {
      "id": "cart-header",
      "type": "text",
      "adminTitle": "Cart Header",
      "props": {
        "heading": {
          "en": "Your Cart"
        }
      }
    }
  ]
}
```

TARGET 37: src/lib/data/pages/checkoutPage.json

```json
{
  "pageType": "checkout",
  "slug": "checkout",
  "isPublished": true,
  "seo": {
    "title": {
      "en": "Checkout - {{COMPANY_NAME}}"
    },
    "description": {
      "en": "Complete your purchase."
    }
  },
  "sections": [
    {
      "id": "checkout-header",
      "type": "text",
      "adminTitle": "Checkout Header",
      "props": {
        "heading": {
          "en": "Checkout"
        }
      }
    }
  ]
}
```

TARGET 38: src/lib/data/pages/wishlistPage.json

```json
{
  "pageType": "wishlist",
  "slug": "wishlist",
  "isPublished": true,
  "seo": {
    "title": {
      "en": "Wishlist - {{COMPANY_NAME}}"
    },
    "description": {
      "en": "Your saved items."
    }
  },
  "sections": [
    {
      "id": "wishlist-header",
      "type": "text",
      "adminTitle": "Wishlist Header",
      "props": {
        "heading": {
          "en": "My Wishlist"
        }
      }
    }
  ]
}
```

TARGET 39: src/lib/data/pages/termsPage.json

```json
{
  "pageType": "terms",
  "slug": "terms",
  "isPublished": true,
  "sections": [
    {
      "id": "terms-content",
      "type": "text",
      "adminTitle": "Terms Content",
      "props": {
        "heading": {
          "en": "Terms of Service"
        }
      }
    }
  ]
}
```

TARGET 40: src/lib/data/pages/privacyPage.json

```json
{
  "pageType": "privacy",
  "slug": "privacy",
  "isPublished": true,
  "sections": [
    {
      "id": "privacy-content",
      "type": "text",
      "adminTitle": "Privacy Content",
      "props": {
        "heading": {
          "en": "Privacy Policy"
        }
      }
    }
  ]
}
```

TARGET 41: src/lib/data/pages/returnsPage.json

```json
{
  "pageType": "returns",
  "slug": "returns",
  "isPublished": true,
  "sections": [
    {
      "id": "returns-content",
      "type": "text",
      "adminTitle": "Returns Content",
      "props": {
        "heading": {
          "en": "Returns Policy"
        }
      }
    }
  ]
}
```

===

## ENVIRONMENT VARIABLES

TARGET 42: .env.local template

```env
# ============================================================
# ENVIRONMENT VARIABLES
# ============================================================

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB={{PROJECT_SLUG}}_store

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Backend API (Blueprint)
BACKEND_API_URL=http://localhost:8000
NEXT_PUBLIC_TENANT_DB={{CURRENT_TENANT_DB_HEADER}}

# Payment Gateway (Razorpay)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Emails (comma separated)
ADMIN_EMAILS=admin@{{PROJECT_SLUG}}.com

# Free Shipping Threshold
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD={{FREE_SHIPPING_THRESHOLD}}

# Tax Rate (percentage)
NEXT_PUBLIC_TAX_RATE=18

# Google Maps API (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

===

## TARGET 43: src/lib/pkce.ts

```typescript
// ============================================================
// PKCE HELPERS FOR AUTHENTICATION FLOW
// Used for secure SSO auth exchange
//  ============================================================

export function generateCodeVerifier(length = 64): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  return Array.from(randomValues)
    .map((x) => charset[x % charset.length])
    .join("");
}

export async function generateCodeChallenge(
  codeVerifier: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);

  const digest = await crypto.subtle.digest("SHA-256", data);

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
```

TARGET 44: src/app/[locale]/login/page.tsx

```typescript
// ============================================================
// LOGIN PAGE WITH ADMIN SSO REDIRECT FLOW
// Handles redirection if user is admin / tenant_admin
// ============================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store/hooks";
import { loginThunk } from "@/redux/slices/ecommerce/authSlice";
import { toast } from "sonner";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { generateCodeChallenge, generateCodeVerifier } from "@/lib/pkce";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await dispatch(loginThunk({ email, password })).unwrap();
      if (response.user) {
        if (response.user.role === "customer" || response.user.role === "user") {
          router.push("/");
        } else if (response.user.role === "tenant_admin" || response.user.role === "admin") {
          const codeVerifier = generateCodeVerifier();
          const codeChallenge = await generateCodeChallenge(codeVerifier);
          const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || "prod";
          const redirectUri =
            environment === "dev"
              ? "http://localhost:3001/auth/callback"
              : "http://kalptree.xyz/auth/callback";
          const res = await fetch("/api/auth/sso/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-tenant-db": process.env.NEXT_PUBLIC_TENANT_ID || "",
            },
            body: JSON.stringify({
              codeChallenge,
              codeVerifier,
              redirectUri,
            }),
            credentials: "include",
          });

          const resData = await res.json();

          if (resData.success) {
            window.open(redirectUri + `?code=${resData.code}`, "_blank");
          }
        }
        toast.success("Welcome back!");
      }
    } catch (err: any) {
      setError(err || "Authentication failed");
      toast.error(err || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background font-sans pt-[var(--navbar-height)]">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 relative z-10">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-foreground mb-3 leading-tight">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm">
              Please enter your details to access your account.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-6 flex items-center gap-2 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-[var(--primary)] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full flex h-12 rounded-xl border border-border bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] shadow-sm"
                  placeholder="admin@{{PROJECT_SLUG}}.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground block">
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-[var(--primary)] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full flex h-12 rounded-xl border border-border bg-slate-50 pl-11 pr-12 text-sm font-medium text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-[var(--primary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex h-12 mt-6 items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-black text-white transition-all hover:bg-[var(--primary)]/90 hover:shadow-lg hover:shadow-[var(--primary)]/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-2"
            >
              {loading ? "Signing In..." : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[var(--surface)]">
        <div className="absolute inset-0 bg-[var(--primary)]/10 mix-blend-multiply"></div>
      </div>
    </div>
  );
}
```

TARGET 45: src/lib/permalink.ts

```typescript
// ============================================================
// PERMALINK RESOLVING UTILITIES
// Performs reverse route lookups for dynamic URLs
// ============================================================

export function resolvePermalink(
  pathname: string,
  permalinks: Record<string, string>,
) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  const base = "/" + segments[0];

  const entry = Object.entries(permalinks).find(([, path]) => path === base);

  if (!entry) return null;

  return {
    type: entry[0], // "shop" | "category" | "blog"
    slug: segments.slice(1), // e.g. ["red-shoes"]
  };
}
```

TARGET 46: src/app/[locale]/[...slug]/page.tsx

```typescript
// ============================================================
// CATCH-ALL DYNAMIC PERMALINK ROUTE
// Resolves database/blueprint permalinks to matching components
// ============================================================

import { notFound } from "next/navigation";
import CatPage from "../category/[id]/page";
import ProdPage from "../product/[id]/page";
import { resolvePermalink } from "@/lib/permalink";
import { fetchBlueprintThunk } from "@/redux/slices/blueprint/blueprintThunk";
import { store } from "@/redux/store";

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const pathname = "/" + slug.join("/");

  // Fetch latest blueprint
  await store.dispatch(fetchBlueprintThunk());
  const businessBluePrint = store.getState().blueprint.payload;
  const permalinks = businessBluePrint?.permalinkDetails || {};

  const resolved = resolvePermalink(pathname, permalinks);

  if (!resolved) notFound();

  switch (resolved.type) {
    case "permalinkStructure":
      if (resolved.slug.length !== 0) {
        return (
          <ProdPage
            params={Promise.resolve({
              id: resolved.slug[0],
            })}
          />
        );
      } else {
        notFound();
      }
    case "productCategoryBase":
      return <CatPage />;
    default:
      notFound();
  }
}
```

TARGET 47: src/lib/services/orders.ts

```typescript
// ============================================================
// ORDERS SERVICE ENDPOINTS
// Performs API requests to query user orders
// ============================================================

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  quantity: number;
  price: number;
  compareAtPrice?: number;
  variantId?: string;
  variantTitle?: string;
  selectedOptions?: Record<string, string>;
  image?: string;
}

export interface OrderPricing {
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderPayment {
  transactionId?: string;
  method: string;
  paymentGatewayResponse?: any;
  paidAt?: string;
  paymentStatus: string;
}

export interface OrderStatusHistory {
  status: string;
  timestamp: string;
}

export interface Order {
  _id?: string;
  items: OrderItem[];
  pricing: OrderPricing;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  payment: OrderPayment;
  shipping: {
    method: string;
  };
  currency: string;
  fulfillmentStatus: string;
  orderNumber: string;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
  id?: string;
}

const tenantHeader = process.env.NEXT_PUBLIC_TENANT_ID;

export const getOrderId = (order: Order): string => {
  if (!order) return "";
  return order.id || order._id || "";
};

export async function getOrders(): Promise<Order[]> {
  const response = await fetch("/api/commerce/orders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-db": tenantHeader || "",
    },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to fetch orders");
  }

  return Array.isArray(data) ? data : data.data || [];
}

export async function getOrderById(id: string): Promise<Order> {
  const response = await fetch(`/api/commerce/orders/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-db": tenantHeader || "",
    },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to fetch order");
  }

  return data.data || data;
}
```

TARGET 48: src/redux/slices/ecommerce/ordersThunk.ts

```typescript
// ============================================================
// ORDERS ASYNC THUNKS
// Handles Redux actions for loading user orders from the API
// ============================================================

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getOrders, getOrderById } from "@/lib/services/orders";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrders();
      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  },
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id: string, { rejectWithValue }) => {
    try {
      const order = await getOrderById(id);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch order details");
    }
  },
);
```

TARGET 49: src/redux/slices/ecommerce/ordersSlice.ts

```typescript
// ============================================================
// ORDERS REDUX STATE SLICE
// ============================================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "@/lib/services/orders";
import { fetchOrders, fetchOrderById } from "./ordersThunk";

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        },
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.selectedOrder = action.payload;
        },
      )
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
```

TARGET 50: src/app/[locale]/orders/page.tsx

```typescript
// ============================================================
// ORDERS HISTORY VIEW
// Displays standard listing of user orders
// ============================================================

"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { fetchOrders } from "@/redux/slices/ecommerce/ordersThunk";
import { getOrderId, Order } from "@/lib/services/orders";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  Calendar,
  CreditCard,
  AlertCircle,
} from "lucide-react";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user, isAuthenticated, loading: authLoading } = useAppSelector((state) => state.auth);
  const { orders, loading: ordersLoading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const getOrderStatus = (order: Order): string => {
    if ((order as any).status) return (order as any).status;
    if (order.statusHistory && order.statusHistory.length > 0) {
      return order.statusHistory[order.statusHistory.length - 1].status;
    }
    return "pending";
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { bg: string; text: string; border: string }
    > = {
      pending: {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        text: "text-amber-700",
        border: "border-amber-200",
      },
      processing: {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      shipped: {
        bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        text: "text-indigo-700",
        border: "border-indigo-200",
      },
      delivered: {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        text: "text-emerald-700",
        border: "border-emerald-200",
      },
      cancelled: {
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        text: "text-rose-700",
        border: "border-rose-200",
      },
      unfulfilled: {
        bg: "bg-slate-50 text-slate-700 border-slate-200",
        text: "text-slate-700",
        border: "border-slate-200",
      },
    };

    const s = status.toLowerCase();
    const config = statusMap[s] || {
      bg: "bg-slate-50 text-slate-700 border-slate-200",
      text: "text-slate-700",
      border: "border-slate-200",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${config.bg} ${config.text} ${config.border}`}
      >
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusMap: Record<
      string,
      { bg: string; text: string; border: string }
    > = {
      pending: {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        text: "text-amber-700",
        border: "border-amber-200",
      },
      captured: {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        text: "text-emerald-700",
        border: "border-emerald-200",
      },
      paid: {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        text: "text-emerald-700",
        border: "border-emerald-200",
      },
      failed: {
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        text: "text-rose-700",
        border: "border-rose-200",
      },
    };

    const s = paymentStatus.toLowerCase();
    const config = statusMap[s] || {
      bg: "bg-slate-50 text-slate-700 border-slate-200",
      text: "text-slate-700",
      border: "border-slate-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${config.bg} ${config.text} ${config.border}`}
      >
        Payment: {paymentStatus}
      </span>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="pb-24 pt-12 px-[5%] max-w-7xl mx-auto min-h-[80vh]">
      <div className="crumbs flex items-center gap-2 mb-8 text-sm font-bold text-muted">
        <Link href="/" className="hover:text-secondary transition-colors">
          Home
        </Link>
        <ChevronRight size={12} className="opacity-50" />
        <strong className="text-foreground">Orders</strong>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-[42px] md:text-[52px] font-bold tracking-tight leading-none">
            My Orders
          </h1>
          <p className="text-muted font-semibold mt-3 max-w-md">
            View history, track delivery status, and manage invoices for your purchases.
          </p>
        </div>

        {orders.length > 0 && (
          <div className="bg-surface border border-border px-5 py-2.5 rounded-full flex items-center gap-2 self-start md:self-auto">
            <span className="text-secondary font-black">{orders.length}</span>
            <span className="text-muted text-[11px] font-black uppercase tracking-wider">
              {orders.length === 1 ? "Order Placed" : "Orders Placed"}
            </span>
          </div>
        )}
      </div>

      {ordersLoading ? (
        <div className="space-y-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-surface border border-border rounded-2xl p-6 sm:p-8 h-40"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto text-rose-600">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-lg font-bold text-rose-900 mb-2">Failed to load orders</h3>
          <p className="text-sm font-semibold text-rose-700 mb-6">{error}</p>
          <button
            onClick={() => dispatch(fetchOrders())}
            className="inline-flex items-center justify-center bg-rose-600 text-white px-8 h-12 rounded-full text-[13px] font-bold uppercase tracking-wider hover:bg-rose-700 transition-all"
          >
            Try Again
          </button>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderId = getOrderId(order);
            const status = getOrderStatus(order);
            const itemsCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

            return (
              <div
                key={orderId}
                className="group bg-surface border border-border rounded-3xl p-6 sm:p-8 hover:border-secondary/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-border pb-5 mb-5 gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-muted uppercase tracking-wider">
                      Order Reference
                    </span>
                    <h3 className="text-lg font-extrabold text-foreground group-hover:text-secondary transition-colors">
                      {order.orderNumber}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {getPaymentStatusBadge(order.payment.paymentStatus)}
                    {getStatusBadge(status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-[11px] font-black text-muted uppercase tracking-wider">
                      <Calendar size={13} className="text-secondary" /> Date Placed
                    </span>
                    <p className="font-bold text-foreground text-sm sm:text-base">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-[11px] font-black text-muted uppercase tracking-wider">
                      <Package size={13} className="text-secondary" /> Total Items
                    </span>
                    <p className="font-bold text-foreground text-sm sm:text-base">
                      {itemsCount} {itemsCount === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-[11px] font-black text-muted uppercase tracking-wider">
                      <CreditCard size={13} className="text-secondary" /> Total Amount
                    </span>
                    <p className="font-black text-secondary text-base sm:text-lg">
                      {formatPrice(order.pricing.total)}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      href={`/orders/${orderId}`}
                      className="inline-flex items-center justify-center bg-primary text-white text-[11px] font-bold tracking-wider uppercase px-6 h-12 rounded-full hover:bg-primary/90 transition-all gap-2 group/btn"
                    >
                      View Details
                      <ArrowRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center text-center max-w-lg mx-auto bg-surface border border-border rounded-3xl p-8">
          <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-8 relative text-secondary">
            <ShoppingBag size={40} className="opacity-80" />
            <Package
              size={20}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-bounce"
            />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-3">No orders found</h2>
          <p className="text-muted font-semibold mb-10 leading-relaxed max-w-sm">
            Start shopping and place your first order.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-primary text-white text-[13px] font-bold tracking-wider uppercase px-12 h-14 rounded-full hover:bg-primary/90 transition-all shadow-md active:scale-95"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
```

TARGET 51: src/app/[locale]/orders/[id]/page.tsx

```typescript
// ============================================================
// ORDER DETAILS VIEW
// ============================================================

"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { fetchOrderById } from "@/redux/slices/ecommerce/ordersThunk";
import { clearSelectedOrder } from "@/redux/slices/ecommerce/ordersSlice";
import { getOrderId } from "@/lib/services/orders";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  User,
  MapPin,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user, isAuthenticated, loading: authLoading } = useAppSelector((state) => state.auth);
  const { selectedOrder, loading: orderLoading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      dispatch(fetchOrderById(id));
    }

    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, isAuthenticated, id]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const getOrderStatus = (): string => {
    if (!selectedOrder) return "";
    if ((selectedOrder as any).status) return (selectedOrder as any).status;
    if (selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0) {
      return selectedOrder.statusHistory[selectedOrder.statusHistory.length - 1].status;
    }
    return "pending";
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string }> = {
      pending: { bg: "bg-amber-50 text-amber-700 border-amber-200" },
      processing: { bg: "bg-blue-50 text-blue-700 border-blue-200" },
      shipped: { bg: "bg-indigo-50 text-indigo-700 border-indigo-200" },
      delivered: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      cancelled: { bg: "bg-rose-50 text-rose-700 border-rose-200" },
      unfulfilled: { bg: "bg-slate-50 text-slate-700 border-slate-200" },
    };

    const s = status.toLowerCase();
    const config = statusMap[s] || { bg: "bg-slate-50 text-slate-700 border-slate-200" };

    return (
      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${config.bg}`}>
        Status: {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusMap: Record<string, { bg: string }> = {
      pending: { bg: "bg-amber-50 text-amber-700 border-amber-200" },
      captured: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      paid: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      failed: { bg: "bg-rose-50 text-rose-700 border-rose-200" },
    };

    const s = paymentStatus.toLowerCase();
    const config = statusMap[s] || { bg: "bg-slate-50 text-slate-700 border-slate-200" };

    return (
      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${config.bg}`}>
        Payment: {paymentStatus}
      </span>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="pb-24 pt-12 px-[5%] max-w-5xl mx-auto min-h-[80vh]">
      <div className="crumbs flex items-center gap-2 mb-8 text-sm font-bold text-muted">
        <Link href="/" className="hover:text-secondary transition-colors">
          Home
        </Link>
        <ChevronRight size={12} className="opacity-50" />
        <Link href="/orders" className="hover:text-secondary transition-colors">
          Orders
        </Link>
        <ChevronRight size={12} className="opacity-50" />
        <strong className="text-foreground">Order Details</strong>
      </div>

      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors mb-6 uppercase tracking-wider"
      >
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      {orderLoading ? (
        <div className="space-y-8 animate-pulse">
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 h-40"></div>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto text-rose-600">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-lg font-bold text-rose-900 mb-2">Failed to load order</h3>
          <p className="text-sm font-semibold text-rose-700 mb-6">{error}</p>
          <button
            onClick={() => dispatch(fetchOrderById(id))}
            className="inline-flex items-center justify-center bg-rose-600 text-white px-8 h-12 rounded-full text-[13px] font-bold uppercase tracking-wider hover:bg-rose-700 transition-all"
          >
            Try Again
          </button>
        </div>
      ) : selectedOrder ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-5 mb-5">
              <div>
                <span className="text-[11px] font-black text-muted uppercase tracking-wider">Order Reference</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-0.5">
                  {selectedOrder.orderNumber}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {getPaymentStatusBadge(selectedOrder.payment.paymentStatus)}
                {getStatusBadge(getOrderStatus())}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted uppercase tracking-wider">Placed On</p>
                  <p className="font-bold text-foreground text-sm mt-0.5">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <Package size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted uppercase tracking-wider">Order ID</p>
                  <p className="font-bold text-foreground text-sm mt-0.5 truncate max-w-[200px]" title={getOrderId(selectedOrder)}>
                    {getOrderId(selectedOrder)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted uppercase tracking-wider">Payment Method</p>
                  <p className="font-bold text-foreground text-sm mt-0.5 uppercase">
                    {selectedOrder.payment.method}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-bold tracking-tight mb-5 flex items-center gap-2 border-b border-border pb-3">
                <User size={18} className="text-secondary" /> Customer Info
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-muted uppercase tracking-wider">Full Name</p>
                  <p className="font-bold text-foreground text-sm mt-0.5">
                    {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-secondary shrink-0" />
                  <span className="font-semibold text-muted text-sm truncate">{selectedOrder.shippingAddress.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={15} className="text-secondary shrink-0" />
                  <span className="font-bold text-foreground text-sm">{selectedOrder.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
              <h3 className="text-lg font-bold tracking-tight mb-5 flex items-center gap-2 border-b border-border pb-3">
                <MapPin size={18} className="text-secondary" /> Shipping Address
              </h3>
              <div className="text-sm font-semibold text-muted space-y-1">
                <p className="font-bold text-foreground mb-1">
                  {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                </p>
                <p>{selectedOrder.shippingAddress.addressLine1}</p>
                {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                <p>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zipCode}
                </p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold tracking-tight mb-6 flex items-center gap-2 border-b border-border pb-4">
              <Package size={18} className="text-secondary" /> Ordered Items
            </h3>

            <div className="space-y-5">
              {selectedOrder.items.map((item, index) => (
                <div
                  key={item.variantId || item.productId || index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-20 bg-background border border-border rounded-xl overflow-hidden shrink-0">
                      <img
                        src={item.image || "/assets/Image/Sofa.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/assets/Image/Sofa.jpg";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      {item.slug ? (
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-bold text-foreground hover:text-secondary transition-colors text-sm sm:text-base line-clamp-1"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <p className="font-bold text-foreground text-sm sm:text-base line-clamp-1">{item.name}</p>
                      )}
                      {item.variantTitle && (
                        <p className="text-xs font-semibold text-muted mt-0.5">
                          Variant: {item.variantTitle}
                        </p>
                      )}
                      <p className="text-[10px] font-black text-muted uppercase tracking-wider mt-1">
                        SKU: {item.sku}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-12 w-full sm:w-auto shrink-0 border-t border-border/50 sm:border-0 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider">Qty</p>
                      <p className="font-bold text-foreground text-sm sm:text-base mt-0.5">
                        {item.quantity}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider">Unit Price</p>
                      <p className="font-bold text-foreground text-sm sm:text-base mt-0.5">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider">Total</p>
                      <p className="font-black text-secondary text-sm sm:text-base mt-0.5">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 max-w-md ml-auto">
            <h3 className="text-lg font-bold tracking-tight mb-5 border-b border-border pb-3">Order Summary</h3>
            <div className="space-y-3 font-semibold text-sm">
              <div className="flex justify-between items-center text-muted">
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrder.pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-muted">
                <span>Shipping</span>
                <span>
                  {selectedOrder.pricing.shipping === 0
                    ? "Free"
                    : formatPrice(selectedOrder.pricing.shipping)}
                </span>
              </div>
              <div className="flex justify-between items-center text-muted">
                <span>Tax</span>
                <span>{formatPrice(selectedOrder.pricing.tax)}</span>
              </div>
              {selectedOrder.pricing.discount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{formatPrice(selectedOrder.pricing.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-border pt-4 text-base font-black">
                <span className="text-foreground">Total</span>
                <span className="text-secondary text-lg">
                  {formatPrice(selectedOrder.pricing.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-surface border border-border rounded-3xl max-w-lg mx-auto">
          <AlertCircle size={40} className="text-muted mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-1">Order not found</h3>
          <p className="text-sm font-semibold text-muted mb-6">
            The requested order details are not available.
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center justify-center bg-primary text-white px-8 h-12 rounded-full text-[13px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-all"
          >
            Back to Orders
          </Link>
        </div>
      )}
    </div>
  );
}
```

===

# OUTPUT CHECKLIST

## CRITICAL RULES

- [x] NO .data.ts files
- [x] SINGLE PAGE JSON architecture
- [x] Each page has its own JSON file
- [x] ALL PAGES RENDER FROM JSON
- [x] NO CMS DATABASE COLLECTION for page content
- [x] DATA FLOW: JSON → Redux → Components
- [x] EditableText-enabled inline editing
- [x] CLEAN TEXT STORAGE (No HTML inside JSON)
- [x] STYLING VIA CSS CLASSES
- [x] Blueprint integration for dynamic theming
- [x] NO LANGUAGE TOGGLE BUTTON
- [x] NO DARK MODE TOGGLE
- [x] Wishlist integrated with authentication
- [x] Payment gateway abstraction with Razorpay implementation
- [x] Permalink-based category and product resolution
- [x] PKCE / SSO redirect support
- [x] Type-safe architecture
- [x] Component-driven architecture
- [x] Responsive design
- [x] SEO-ready pages
- [x] Accessibility support
- [x] Server Components where appropriate

===
## Complete Target List (51 Files)

Blueprint System (7)

- 1. `src/redux/slices/blueprint/blueprintType.ts`
- 2. `src/redux/slices/blueprint/blueprintThunk.ts`
- 3. `src/redux/slices/blueprint/blueprintSlice.ts`
- 4. `src/lib/applyTheme.ts`
- 5. `src/components/providers/BlueprintProvider.tsx`
- 6. `src/redux/slices/blueprint/index.ts`
- 7. `src/app/api/[[...slug]]/route.ts`

Styles & Configuration (2)

- 8. `src/styles/globals.css`
- 9. `src/middleware.ts`

i18n Utilities (1)

- 10. `src/lib/i18n/locale.ts`

Redux Hooks & Store (8)

- 11. `src/redux/store/hooks.ts`
- 12. `src/redux/store/index.ts`
- 13. `src/redux/store/rootReducer.ts`
- 14. `src/redux/provider.tsx`
- 15. `src/redux/slices/ecommerce/cartSlice.ts`
- 16. `src/redux/slices/ecommerce/authSlice.ts` (includes wishlist)
- 48. `src/redux/slices/ecommerce/ordersThunk.ts`
- 49. `src/redux/slices/ecommerce/ordersSlice.ts`

Page Slice (3)

- 17. `src/redux/slices/pages/pageType.ts`
- 18. `src/redux/slices/pages/pagesSlice.ts`
- 19. `src/redux/slices/pages/saveField.ts`

Shared Components (2)

- 20. `src/components/shared/EditableText.tsx`
- 21. `src/components/shared/EditModeToggle.tsx`

Layout Components (2)

- 22. `src/components/layout/Header.tsx`
- 23. `src/components/layout/Footer.tsx`

Root Layout & Pages (6)

- 24. `src/app/[locale]/layout.tsx`
- 25. `src/app/[locale]/page.tsx`
- 44. `src/app/[locale]/login/page.tsx`
- 46. `src/app/[locale]/[...slug]/page.tsx`
- 50. `src/app/[locale]/orders/page.tsx`
- 51. `src/app/[locale]/orders/[id]/page.tsx`

Payment Gateways (3)

- 26. `src/lib/paymentgateway/base.ts`
- 27. `src/lib/paymentgateway/razorpay.ts`
- 28. `src/lib/paymentgateway/registry.ts`

Core Utilities (3)

- 43. `src/lib/pkce.ts`
- 45. `src/lib/permalink.ts`
- 47. `src/lib/services/orders.ts`

JSON Files (13)

- 29. `src/lib/data/pages/homePage.json`
- 30. `src/lib/data/pages/headerData.json`
- 31. `src/lib/data/pages/footerData.json`
- 32. `src/lib/data/pages/shopPage.json`
- 33. `src/lib/data/pages/aboutPage.json`
- 34. `src/lib/data/pages/contactPage.json`
- 35. `src/lib/data/pages/faqPage.json`
- 36. `src/lib/data/pages/cartPage.json`
- 37. `src/lib/data/pages/checkoutPage.json`
- 38. `src/lib/data/pages/wishlistPage.json`
- 39. `src/lib/data/pages/termsPage.json`
- 40. `src/lib/data/pages/privacyPage.json`
- 41. `src/lib/data/pages/returnsPage.json`

Environment (1)

- 42. `.env.local` template

===
