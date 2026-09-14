import { cache } from "react";
import { connectTenantDB } from "./db";
import { ObjectId } from "mongodb";

function serialize(obj: any): any {
  if (obj === null || obj === undefined) return null;
  return JSON.parse(
    JSON.stringify(obj, (_, value) => {
      if (value instanceof ObjectId) {
        return value.toString();
      }
      return value;
    }),
  );
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function firstText(...values: unknown[]): string {
  for (const value of values) {
    const current = text(value);
    if (current) return current;
  }
  return "";
}

function buildBrandConfigFromBlueprint(payload: any, fallback: any) {
  const business = payload?.business || {};
  const brand = business?.brand || {};
  const brandKit = payload?.brandKit || fallback?.brandKit || {};
  const publicProfile = payload?.publicProfile || fallback?.publicProfile || {};
  const fallbackLogo = Array.isArray(fallback?.logos) ? fallback.logos[0]?.url : "";
  const logoUrl = firstText(
    brand.logoRef,
    brand.businessDna?.logoUrl,
    publicProfile.logoUrl,
    publicProfile.logo,
    brandKit.logo?.primary,
    brandKit.logo?.icon,
    fallbackLogo,
  );
  const faviconUrl = firstText(
    brand.faviconRef,
    brand.businessDna?.faviconUrl,
    brandKit.logo?.favicon,
    brandKit.faviconUrl,
    fallback?.faviconUrl,
  );
  return {
    ...(fallback || {}),
    ...payload,
    type: fallback?.type || "branding",
    logoUrl,
    faviconUrl,
    publicProfile: { ...publicProfile, logo: logoUrl, logoUrl },
    brandKit: {
      ...brandKit,
      logo: { ...(brandKit.logo || {}), primary: logoUrl, light: logoUrl, icon: logoUrl, favicon: faviconUrl },
      faviconUrl,
    },
    companyInfo: {
      ...(fallback?.companyInfo || {}),
      name: firstText(business.name, fallback?.companyInfo?.name, "NestCraft"),
      tagline: firstText(brand.tagline, brand.businessDna?.tagline, fallback?.companyInfo?.tagline),
    },
    logos: logoUrl
      ? [{ id: "primary", url: logoUrl, alt: `${firstText(business.name, fallback?.companyInfo?.name, "NestCraft")} logo`, width: 120, height: 40 }]
      : fallback?.logos || [],
  };
}

async function getRemoteBrandingConfig(fallback: any) {
  const configuredApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiCandidates = process.env.NODE_ENV === "production"
    ? [configuredApiUrl]
    : ["http://localhost:5177", configuredApiUrl];
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || "";
  const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || tenantId.replace(/^kalp_tenant_/, "") || "nestcraft";
  if (!tenantId) return null;
  for (const apiUrl of apiCandidates.filter(Boolean)) {
    try {
      const res = await fetch(`${apiUrl}/api/cms/business-blueprint`, {
        method: "GET",
        headers: { "x-tenant-db": tenantId, "tenant-slug": tenantSlug, "x-tenant-slug": tenantSlug },
        cache: "no-store",
      });
      if (!res.ok) continue;
      const json = await res.json();
      const payload = json?.data?.payload || json?.data || json;
      return buildBrandConfigFromBlueprint(payload, fallback);
    } catch (error) {
      console.error("Failed to load remote branding config", error);
    }
  }
  return null;
}

export const getPageData = cache(async (slug: string) => {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || "";
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${API_URL}/api/cms/pages?slug=${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-db": tenantId,
      },
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status !== 404) {
        console.error(
          `Failed to fetch page data for slug: ${slug}, status: ${res.status}`,
        );
      } else {
        console.warn(
          `Page data not found for slug: ${slug} (status: 404)`,
        );
      }
      return null;
    }

    const json = await res.json();
    // Support both wrapped { data: ... } and direct response formats
    const data = json.data !== undefined ? json.data : json;

    return serialize(data);
  } catch (error) {
    console.error(`Error in getPageData for slug: ${slug}`, error);
    return null;
  }
});

export const getSingleProduct = cache(async (id: string) => {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || "kp_nestcraft";

  try {
    const res = await fetch(`${API_URL}/api/commerce/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-db": tenantId,
      },
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status !== 404) {
        console.error(
          `Failed to fetch product data for id: ${id}, status: ${res.status}`,
        );
      } else {
        console.warn(
          `Product data not found for id: ${id} (status: 404)`,
        );
      }
      return null;
    }

    const json = await res.json();
    const data = json.data !== undefined ? json.data : json;

    return serialize(data);
  } catch (error) {
    console.error(`Error in getSingleProduct for id: ${id}`, error);
    return null;
  }
});

export const getTenantRegistry = cache(async () => {
  const db = await connectTenantDB();
  const tenantRegistry = db.collection("tenant_registry");

  const tenant = await tenantRegistry.findOne({ type: "branding" });

  const localConfig = serialize(tenant);
  const remoteConfig = await getRemoteBrandingConfig(localConfig);
  return serialize(remoteConfig || localConfig);
});

export const getBusinessBlueprint = cache(async () => {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;

  try {
    const response = await fetch(`${API_URL}/api/platform/business-blueprint`, {
      headers: {
        "Content-Type": "application/json",
        "x-tenant-db": tenantId!,
      },
      credentials: "include",
    });
    const json = await response.json();
    const data = json.data !== undefined ? json.data : json;
    console.log("get blueprint--->", data);
    return serialize(data);
  } catch (error) {
    console.error("Error fetching business blueprint:", error);
    return null;
  }
});
