# MODULE PROMPT: SHOP PAGE & CATEGORY ROUTING (FINAL)

## INSTRUCTIONS FOR AI

Act as an **Elite Full-Stack Next.js 15 Architect**, **E-commerce Specialist** and **Design System Expert**. Integrate the Shop and Category page module into the website ensuring it is **FULLY INTEGRATED with the Redux store, Blueprint dynamic theme variables, i18n locales, and EditableText cms inline editing capabilities**.

**CRITICAL MODULE REQUIREMENTS:**

- **NO `.data.ts` FILES** - All static configurations and initial fallback structures must live in JSON files or local schemas.
- **SINGLE PAGE JSON** - The Shop page uses `lib/data/pages/shopPage.json` for CMS configuration schema.
- **DATA FLOW: JSON → Redux → Component** - Page metadata and content flow from Redux `pages` store (`currentPages` state) to components.
- **EDITABLE TEXT** - Page headers, descriptions, and customizable static blocks on the Shop page must be editable inline via the `<EditableText />` component when `state.pages.isEditable` is active.
- **STYLING VIA CSS CLASSES** - Apply HSL dynamic theme values using Blueprint tokens (`var(--secondary)`, `var(--primary)`, `var(--border)`, etc.) rather than hardcoding style colors.
- **DYNAMIC FILTER SYNC** - Product attribute checkboxes (CMS attributes like size, color) and sorting selections must persist to and synchronize with search URL parameters (`?f_color=blue&sort=price_asc`).
- **ACCORDION CATEGORY TREE** - Support nested subcategory rendering using recursive category trees with smooth accordion expand/collapse transitions.
- **PAGINATION & PER-PAGE SELECTION** - Support seamless paginated product lists with customizable item counters (9, 12, 24, 48 items per page).

---

## WEBSITE STRATEGY: SHOP MODULE

| Route Parameter  | Render Behavior                                                                     | Editable                                         |
| ---------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------ |
| `/shop`          | Renders dynamic collection header + full catalog, fallback filters & listings       | Yes (Header / descriptions editable in CMS mode) |
| `/category/[id]` | Renders category-specific headers, custom subcategories lists & filtered items grid | Headings default to category name                |

---

## IMPLEMENTATION TARGETS (7 FILES)

### TARGET 1: app/[locale]/shop/page.tsx

```typescript
// ============================================================
// SHOP PAGE ROUTE ENTRY
// Entry point for the /shop route (default and locale-prefixed)
// Wraps categories/shop layout in Suspense boundary
// ============================================================

import { Suspense } from 'react';
import Component from '@/components/pages/CategoryPage';
import GetAllPages from '@/components/pages/GetAllPages';
import GetAllMenus from '@/components/cms/menus/GetAllMenus';
import GetProductCategoryWise from '@/lib/GetAllDetails/GetProductCategoryWise';
import PageLoader from '@/components/pages/PageLoader';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader text="Loading Shop" />}>
      <GetAllPages />
      <GetAllMenus />
      <GetProductCategoryWise />
      <Component />
    </Suspense>
  );
}
```

---

### TARGET 2: app/[locale]/category/[id]/page.tsx

```typescript
// ============================================================
// CATEGORY PAGE ROUTE ENTRY
// Entry point for category-specific listing pages
// Renders CategoryPage component with dynamic id parameter
// ============================================================

import { Suspense } from "react";
import Component from "@/components/pages/CategoryPage";
import GetProductCategoryWise from "@/lib/GetAllDetails/GetProductCategoryWise";
import PageLoader from "@/components/pages/PageLoader";

export default function CatPage() {
  return (
    <Suspense fallback={<PageLoader text="Loading Category" />}>
      <GetProductCategoryWise />
      <Component />
    </Suspense>
  );
}
```

---

### TARGET 3: components/pages/CategoryPage.tsx

```typescript
// ============================================================
// CATEGORY PAGE / SHOP MAIN VIEW
// Displays catalog items with search, filters (categories/attributes),
// and dynamic pagination.
// ============================================================

"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Star,
  Search,
  Filter,
  Heart,
  Eye,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";
import { AnnotatorPlugin } from "../annotationPlugin/AnnotatorPlugin";
import GetAllPages from "./GetAllPages";
import {
  useParams,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import Link from "next/link";
import AccordionSection from "../category/accordionSection/AccordionSection";
import Pagination from "../category/Pagination";
import PageHead from "../category/pageHead/PageHead";
import { CategoryRecord } from "@/lib/store/categories/categoriesSlices";
import { generateBreadcrumbs } from "@/lib/utils";
import { useAppDispatch } from "@/lib/store/hooks";
import { updateProfileThunk } from "@/lib/store/auth/authThunks";
import { toast } from "sonner";

const ProductCardSkeleton = () => (
  <div className="product-card animate-pulse">
    <div className="img-wrap bg-muted/20 aspect-square rounded-2xl mb-4"></div>
    <div className="card-body space-y-3">
      <div className="h-5 bg-muted/20 rounded w-3/4"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-muted/20 rounded w-20"></div>
        <div className="h-4 bg-muted/20 rounded w-16"></div>
      </div>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="mx-auto px-[5%] pb-20 pt-[50px]">
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-secondary mx-auto" />
        <p className="text-muted font-bold text-sm">Loading products...</p>
      </div>
    </div>
  </div>
);

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const breadCrump = generateBreadcrumbs(pathname);

  const handleFilterChange = (key: string, value: string) => {
    const currentKey = `f_${key}`;
    const allparams = Object.fromEntries(searchParams.entries());
    delete allparams.page;
    const params = allparams[currentKey];
    if (params) {
      const values = params.split(",");
      if (values.includes(value)) {
        values.splice(values.indexOf(value), 1);
      } else {
        values.push(value);
      }
      allparams[currentKey] = values.join(",");
      if (values.length == 0) {
        delete allparams[currentKey];
      }
      router.push(`?${new URLSearchParams(allparams).toString()}`);
    } else {
      allparams[currentKey] = value;
      router.push(`?${new URLSearchParams(allparams).toString()}`);
    }
  };

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    Number(searchParams.get("perPage")) || 9,
  );

  const { allCategories, categoryLoading } = useSelector(
    (state: RootState) => state.adminCategories,
  );

  const {
    allProducts,
    loading,
    cmsFilters,
    totalProducts,
    loadingMore,
    hasFetched,
  } = useSelector((state: RootState) => state.adminProducts);

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const getCatIdStr = (cat: any) => {
    if (!cat) return "";
    if (typeof cat === "string") return cat;
    return cat.id || cat._id || "";
  };

  const getParentIdStr = (cat: any) => {
    if (!cat || !cat.parentId) return null;
    if (typeof cat.parentId === "string") return cat.parentId;
    return cat.parentId.id || cat.parentId._id || cat.parentId || null;
  };

  // Trace up the tree to expand parent categories of the currently active category
  useEffect(() => {
    if (!id || allCategories.length === 0) return;

    const activeCat = allCategories.find((c: any) => c.slug === id);
    if (!activeCat) return;

    const newExpanded = { ...expandedCategories };
    let current = activeCat;

    while (current) {
      const pid = getParentIdStr(current);
      if (!pid) break;

      const parent = allCategories.find((c: any) => getCatIdStr(c) === pid);
      if (parent) {
        newExpanded[pid] = true;
        current = parent;
      } else {
        break;
      }
    }

    setExpandedCategories(newExpanded);
  }, [id, allCategories]);

  // Infinite recursive renderer for category trees utilizing AccordionSection
  const renderCategoryTree = (
    categories: any[],
    parentId: string | null = null,
    depth: number = 0,
  ) => {
    const levelCats = categories.filter((c: any) => {
      const pid = getParentIdStr(c);
      if (parentId === null) {
        return pid == null;
      }
      return pid === parentId;
    });

    if (levelCats.length === 0) return null;

    // Outer level categories
    if (depth === 0) {
      return (
        <div className="border-t border-border/70 -mx-4 mt-2.5">
          {levelCats.map((cat: any) => {
            const catIdVal = getCatIdStr(cat);
            const hasChildren = categories.some(
              (c: any) => getParentIdStr(c) === catIdVal,
            );
            const isActive = id === cat.slug;
            const fontClass = "text-xs font-bold uppercase tracking-[1.5px]";

            const titleNode = (
              <Link
                href={`/category/${cat.slug}`}
                onClick={(e) => e.stopPropagation()}
                className={`hover:text-secondary transition-colors ${fontClass} ${
                  isActive ? "text-secondary font-black" : "text-foreground/80"
                }`}
              >
                {cat.title ? cat.title : cat.name}
              </Link>
            );

            if (hasChildren) {
              const isExpanded = !!expandedCategories[catIdVal];
              return (
                <AccordionSection
                  key={catIdVal}
                  title={titleNode as any}
                  isLast={false}
                  initialOpen={isExpanded}
                >
                  <div className="pl-2.5 py-1">
                    {renderCategoryTree(categories, catIdVal, depth + 1)}
                  </div>
                </AccordionSection>
              );
            }

            return (
              <div
                key={catIdVal}
                className="px-4 py-3.5 border-b border-border/70"
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className={`hover:text-secondary transition-colors ${fontClass} ${
                    isActive ? "text-secondary font-black" : "text-foreground/80"
                  }`}
                >
                  {cat.title ? cat.title : cat.name}
                </Link>
              </div>
            );
          })}
        </div>
      );
    }

    // Nested child categories (recursive depth > 0)
    return (
      <div className="space-y-2 border-l border-border/40 pl-3.5 ml-1 my-1.5">
        {levelCats.map((cat: any) => {
          const catIdVal = getCatIdStr(cat);
          const hasChildren = categories.some(
            (c: any) => getParentIdStr(c) === catIdVal,
          );
          const isActive = id === cat.slug;

          const fontClass =
            depth === 1 ? "text-xs font-bold" : "text-[11px] font-semibold";

          const titleNode = (
            <Link
              href={`/category/${cat.slug}`}
              onClick={(e) => e.stopPropagation()}
              className={`hover:text-secondary transition-colors ${fontClass} ${
                isActive ? "text-secondary font-black" : "text-muted"
              }`}
            >
              {cat.title ? cat.title : cat.name}
            </Link>
          );

          if (hasChildren) {
            const isExpanded = !!expandedCategories[catIdVal];
            return (
              <div key={catIdVal} className="space-y-1">
                <AccordionSection
                  title={titleNode as any}
                  isLast={true}
                  initialOpen={isExpanded}
                >
                  <div className="pl-1">
                    {renderCategoryTree(categories, catIdVal, depth + 1)}
                  </div>
                </AccordionSection>
              </div>
            );
          }

          return (
            <div key={catIdVal} className="py-0.5">
              <Link
                href={`/category/${cat.slug}`}
                className={`hover:text-secondary transition-colors ${fontClass} ${
                  isActive ? "text-secondary font-black" : "text-muted"
                }`}
              >
                {cat.title ? cat.title : cat.name}
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  const currentCategory = useMemo(() => {
    if (!id) return null;
    return allCategories.find((c: any) => c.slug === id);
  }, [id, allCategories]);

  const filteredProducts = useMemo(() => {
    let result = allProducts;

    if (currentCategory && currentCategory.id) {
      result = result.filter((p) =>
        p.categoryIds.includes(currentCategory?.id ?? ""),
      );
    }

    return result;
  }, [currentCategory, allProducts]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const missingCount = loadingMore
    ? Math.min(itemsPerPage, Math.max(0, endIndex - filteredProducts.length))
    : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("perPage", items.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // Reset to page 1 when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const wishlistIds: string[] =
    isAuthenticated && user?.wishlist ? user.wishlist : [];

  const handleWishlist = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id || !product.id) {
      return;
    }
    let copiedList = [...wishlistIds];

    const exists = copiedList.includes(product.id);
    if (exists) {
      copiedList = copiedList.filter((id) => id !== product.id);
    } else {
      copiedList.push(product.id);
    }

    const res = await dispatch(
      updateProfileThunk({
        userData: { wishlist: copiedList },
      }),
    );

    if (res.payload.success) {
      toast.success("Wishlist updated successfully");
    } else {
      toast.error("Failed to update wishlist");
    }
  };

  useEffect(() => {
    setCurrentPage(Number(searchParams.get("page")) || 1);
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  if (categoryLoading) {
    return <LoadingState />;
  }

  return (
    <>
      {user?.role === "admin" && <AnnotatorPlugin />}
      <GetAllPages />
      <div className="mx-auto px-[5%] pb-20 pt-[50px]">
        {/* Breadcrumbs */}
        <div className="crumbs flex items-center gap-2">
          <Link href="/">Home</Link>{" "}
          <ChevronRight size={12} className="opacity-50" />
          {breadCrump.length > 0 &&
            breadCrump.map((d, index) => {
              return (
                <React.Fragment key={index}>
                  <Link href={d.href}>{d.label}</Link>{" "}
                  {index != breadCrump.length - 1 && (
                    <ChevronRight size={12} className="opacity-50" />
                  )}
                </React.Fragment>
              );
            })}
        </div>

        {/* Header */}
        <PageHead
          currentCategory={currentCategory as CategoryRecord}
          productCount={filteredProducts.length}
        />

        {/* Content Layout */}
        <section className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
            {/* LEFT FILTERS */}
            <aside className="lg:sticky lg:top-[128px] space-y-6">
              {/* Container 1: Category & Rating Filters */}
              <div className="border border-border bg-surface rounded-[20px] overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-secondary" />
                    <h3 className="text-[26px] font-black leading-none">
                      Filters
                    </h3>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[2px] text-muted border border-border rounded-full px-2.5 py-1.5 bg-background">
                    {currentCategory && currentCategory.title
                      ? currentCategory.title
                      : "All"}
                  </span>
                </div>

                <AccordionSection
                  adminTitle="Category"
                  title="Category"
                  initialOpen={true}
                  isPrimary={true}
                  colorVariant="category"
                  isLast={false}
                >
                  <div className="space-y-2.5">
                    <Link
                      href="/shop"
                      className={`flex justify-between items-center text-sm font-bold hover:text-secondary transition-colors ${
                        !id || id === "all" ? "text-secondary" : "text-muted"
                      }`}
                    >
                      All Products
                    </Link>
                    {allCategories.length > 0 &&
                      renderCategoryTree(allCategories)}
                  </div>
                </AccordionSection>

                <AccordionSection
                  adminTitle="Rating"
                  title="Rating"
                  isLast={true}
                  initialOpen={true}
                  isPrimary={true}
                  colorVariant="rating"
                >
                  <div className="space-y-2.5">
                    {[4, 3, 2, 1].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center gap-2.5 text-sm font-bold text-foreground/80 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-secondary"
                        />
                        <span className="flex items-center gap-1">
                          <Star
                            size={11}
                            className="text-amber-500 fill-amber-500"
                          />
                          {rating}+
                        </span>
                      </label>
                    ))}
                  </div>
                </AccordionSection>
              </div>

              {/* Container 2: CMS Attribute Filters */}
              {cmsFilters && cmsFilters.length > 0 && (
                <div className="border border-border bg-surface rounded-[20px] overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Filter size={18} className="text-foreground/60" />
                      <h3 className="text-[22px] font-black leading-none">
                        Product Filters
                      </h3>
                    </div>
                  </div>

                  {cmsFilters.map((filter: any, index: number) => {
                    const key = `f_${filter.key}`;
                    const values = searchParams.get(key);

                    const arrayofValues = values
                      ? values.split(",").map((d) => d.toLowerCase())
                      : [];

                    const isLastCms = index === cmsFilters.length - 1;

                    return (
                      <AccordionSection
                        key={filter._id || filter.key}
                        adminTitle={filter.label}
                        title={filter.label}
                        isLast={isLastCms}
                      >
                        <div className="space-y-2.5">
                          {filter.selectedValues?.map((value: string) => (
                            <label
                              key={value}
                              className="flex items-center gap-2.5 text-sm font-bold text-foreground/80 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={arrayofValues.includes(
                                  value.toLowerCase(),
                                )}
                                onChange={() =>
                                  handleFilterChange(filter.key, value)
                                }
                                className="w-4 h-4 accent-secondary"
                              />
                              {value}
                            </label>
                          ))}
                        </div>
                      </AccordionSection>
                    );
                  })}
                </div>
              )}
            </aside>

            {/* RIGHT GRID */}
            <div>
              {/* Search and Sort Bar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
                <div className="relative w-full sm:max-w-md">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search in this category..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full h-12 pl-12 pr-6 rounded-2xl border border-border bg-surface font-bold focus:border-secondary outline-none transition-all text-sm"
                  />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-[11px] font-black uppercase tracking-[1px] text-muted whitespace-nowrap">
                    Sort by:
                  </span>
                  <select className="h-12 px-4 rounded-2xl border border-border bg-surface font-bold text-sm outline-none focus:border-secondary cursor-pointer w-full sm:w-48">
                    <option>Newest First</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most Popular</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {loading || !hasFetched ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: itemsPerPage }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedProducts?.map((product) => {
                      const isWishList = product.id
                        ? wishlistIds.includes(product.id)
                        : false;

                      return (
                        <div key={product.id} className="product-card group">
                          <Link
                            href={`/product/${product.slug}`}
                            className="img-wrap block"
                          >
                            <img
                              src={
                                product?.gallery?.[0]?.url ||
                                "/assets/Image/Sofa.jpg"
                              }
                              alt={
                                product?.gallery?.[0]?.alt ||
                                product?.name ||
                                ""
                              }
                            />
                          </Link>
                          <div className="card-body">
                            <div className="flex justify-between items-start mb-2.5">
                              <Link
                                href={`/product/${product.slug}`}
                                className="font-heading text-[20px] font-black leading-[1.05] text-foreground/92 hover:text-secondary transition-colors"
                              >
                                {product.name}
                              </Link>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => handleWishlist(e, product)}
                                  className="flex h-10 w-10 items-center justify-center
                                         rounded-full border border-border bg-white shadow-lg
                                         opacity-0 transition-all duration-300 group-hover:opacity-100
                                          hover:scale-110 shrink-0"
                                  title="Wishlist"
                                >
                                  <Heart
                                    size={18}
                                    className={
                                      isWishList
                                        ? "text-red-500 fill-red-500"
                                        : "text-foreground"
                                    }
                                  />
                                </button>

                                <button
                                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:text-secondary shrink-0"
                                  title="Quick View"
                                >
                                  <Eye size={18} />
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center gap-2.5 flex-wrap font-black tracking-[1px] text-foreground/75">
                              <span className="text-black text-[13px] uppercase tracking-[2px]">
                                ₹{product.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {Array.from({ length: missingCount }).map((_, i) => (
                      <ProductCardSkeleton key={`loading-${i}`} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      itemsPerPage={itemsPerPage}
                      onItemsPerPageChange={handleItemsPerPageChange}
                    />
                  )}
                </>
              )}

              {/* Empty State */}
              {filteredProducts.length === 0 &&
                !loading &&
                !loadingMore &&
                hasFetched && (
                  <div className="py-20 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/10 mb-6">
                      <Search size={32} className="text-muted" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      No products found
                    </h3>
                    <p className="text-muted font-semibold mb-8">
                      We couldn&apos;t find any products matching your search.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        const params = new URLSearchParams(
                          searchParams.toString(),
                        );
                        params.delete("search");
                        params.set("page", "1");
                        router.push(`?${params.toString()}`);
                      }}
                      className="text-secondary font-black text-xs uppercase tracking-[2px] border-b border-secondary pb-1"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CategoryPage;
```

---

### TARGET 4: components/category/pageHead/PageHead.tsx

```typescript
// ============================================================
// PAGEHEAD COMPONENT
// Handles display of category badge, page title, description,
// active category breadcrumbs and pills showing product counts.
// Integrates with EditableText for inline CMS editing when slug is 'shop'.
// ============================================================

"use client";

import {
  CategoryRecord,
} from "@/lib/store/categories/categoriesSlices";
import React, { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { updatePageThunk } from "@/lib/store/pages/pageThunk";
import EditableText from "@/components/shared/EditableText";
import { defaultSubCategories, defaultPills } from "./pageHeadData";
import Link from "next/link";

interface PageHeadProps {
  currentCategory: CategoryRecord | null;
  productCount: number;
  section?: any;
}

interface TreeCategory extends CategoryRecord {
  children: TreeCategory[];
}

const PageHead = ({
  currentCategory,
  productCount,
  section: propSection,
}: PageHeadProps) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const currentPages = useAppSelector((state) => state.pages.currentPages);
  const isEditable = useAppSelector((state) => state.pages.isEditable);

  const category = useParams();
  const id = category.id;

  const { allCategories } = useAppSelector((state) => state.adminCategories);
  const parent = id !== "all" ? allCategories.find((d) => d.slug == id) : "all";

  const tree = useMemo(() => {
    const map = new Map<string, TreeCategory>();
    const roots: TreeCategory[] = [];

    allCategories.forEach((c) => {
      const id = c._id || c.id;
      if (id) map.set(id, { ...c, children: [] });
    });

    map.forEach((c) => {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.children.push(c);
      } else {
        roots.push(c);
      }
    });

    return roots;
  }, [allCategories]);

  const similar =
    parent != "all"
      ? parent?.parentId != null
        ? parent.parentId
        : parent?.id
      : null;

  const isShopPage = useMemo(() => {
    return pathname.split("/").filter(Boolean).includes("shop");
  }, [pathname]);

  const finalAllChildren = similar
    ? tree.find((d) => d.id == similar)
    : isShopPage
    ? { children: tree }
    : tree[0];

  const lang = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "hi") return "hi";
    return "en";
  }, [pathname]);

  const { totalProducts } = useAppSelector((state) => state.adminProducts);

  const getCurrentSection = useMemo(() => {
    if (!currentPages) return;
    return currentPages.content?.find(
      (page: any) => page?.adminTitle === "Category Page Head",
    );
  }, [currentPages]);

  const section = propSection || getCurrentSection;
  const p = section?.props || {};

  // Extract content with fallbacks
  const badge =
    p.badge?.[lang] ||
    p.badge?.en ||
    p.badge ||
    (currentCategory ? "Category" : "Collection");
  const heading =
    p.heading?.[lang] ||
    p.heading?.en ||
    p.heading ||
    (currentCategory ? currentCategory.name : "The Full Collection");
  const description =
    p.description?.[lang] ||
    p.description?.en ||
    p.description ||
    (currentCategory
      ? currentCategory.description
      : "Explore our entire range of design-led furniture and home essentials. Crafted with purpose, built for life.");

  const displayBadge = isShopPage ? "Collection" : badge;
  const displayTitle = isShopPage
    ? heading
    : parent && parent !== "all"
    ? parent.name
    : "All Products";
  const displayDescription = isShopPage
    ? description
    : parent && parent !== "all"
    ? parent.description
    : "Explore our entire range of design-led furniture and home essentials. Crafted with purpose, built for life.";

  const handleSaveField = async (fieldPath: string, newValue: string) => {
    if (!currentPages || !currentPages._id) return;

    // Deep clone the page content
    const updatedPage = JSON.parse(JSON.stringify(currentPages));

    // Find the section "Category Page Head"
    let sectionIndex = updatedPage.content?.findIndex(
      (s: any) => s.adminTitle === "Category Page Head"
    );

    if (sectionIndex === -1 && (!updatedPage.content || updatedPage.content.length === 0)) {
      // Initialize content if not existing
      updatedPage.content = [
        {
          id: "category-head-section",
          type: "text",
          adminTitle: "Category Page Head",
          props: {}
        }
      ];
      sectionIndex = 0;
    }

    if (sectionIndex !== -1) {
      if (!updatedPage.content[sectionIndex].props) {
        updatedPage.content[sectionIndex].props = {};
      }
      if (!updatedPage.content[sectionIndex].props[fieldPath]) {
        updatedPage.content[sectionIndex].props[fieldPath] = {};
      }
      updatedPage.content[sectionIndex].props[fieldPath][lang] = newValue;
      updatedPage.content[sectionIndex].props[fieldPath].en = newValue; // Sync default

      await dispatch(
        updatePageThunk({
          id: currentPages._id,
          pageData: { content: updatedPage.content },
        })
      );
    }
  };

  return (
    <section className="pagehead">
      <div className="pagehead-inner">
        <div className="pagehead-content">
          <small className="text-secondary tracking-[3px] uppercase text-[10px] font-black mb-2 block">
            {isShopPage && isEditable ? (
              <EditableText
                value={displayBadge}
                onSave={(val) => handleSaveField("badge", val)}
                isEditable={isEditable}
                tag="span"
                placeholder="Collection Badge..."
              />
            ) : (
              displayBadge
            )}
          </small>
          <h1 className="text-[46px] font-black leading-[1.05] tracking-tight">
            {isShopPage && isEditable ? (
              <EditableText
                value={displayTitle}
                onSave={(val) => handleSaveField("heading", val)}
                isEditable={isEditable}
                tag="span"
                placeholder="Shop Title..."
              />
            ) : (
              displayTitle
            )}
          </h1>
          <p className="text-muted font-bold mt-2.5 max-w-[70ch] leading-relaxed">
            {isShopPage && isEditable ? (
              <EditableText
                value={displayDescription}
                onSave={(val) => handleSaveField("description", val)}
                isEditable={isEditable}
                tag="span"
                placeholder="Shop Description..."
                multiline
                rows={2}
              />
            ) : (
              displayDescription
            )}
          </p>

          <div className="flex flex-wrap gap-2.5 mt-4">
            {finalAllChildren &&
              finalAllChildren.children &&
              finalAllChildren.children.length > 0 &&
              finalAllChildren.children.map((sub: any, idx: number) => {
                const subTitle =
                  typeof sub === "string"
                    ? sub
                    : sub.props?.label?.[lang] ||
                      sub.props?.label?.en ||
                      sub.props?.title?.[lang] ||
                      sub.props?.title?.en ||
                      sub.name ||
                      "";
                if (!subTitle) return null;
                return (
                  <Link
                    key={idx}
                    href={`/category/${sub.slug}`}
                    className="h-10 px-4 rounded-full
                    border border-border bg-white/65 dark:bg-surface/62 backdrop-blur-md text-[10px] font-black
                     uppercase tracking-[2px] hover:border-secondary hover:bg-secondary/10 transition-all flex items-center justify-center"
                  >
                    {subTitle}
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap justify-start lg:justify-end ml-auto">
          <div className="pill">
            {totalProducts} {totalProducts === 1 ? "Product" : "Products"}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHead;
```

---

### TARGET 5: components/category/accordionSection/AccordionSection.tsx

```typescript
// ============================================================
// ACCORDION SECTION
// Reusable wrapper to expand/collapse filters in the sidebar.
// Merges CMS configs with fallback defaults.
// ============================================================

"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";

interface AccordionSectionProps {
    title?: string | React.ReactNode;
    children: React.ReactNode;
    isLast?: boolean;
    adminTitle?: string;
    section?: any;
    initialOpen?: boolean;
    isPrimary?: boolean;
    colorVariant?: "category" | "rating" | "default";
}

const AccordionSection = ({
    title: propTitle,
    children,
    isLast: propIsLast = false,
    adminTitle,
    section: propSection,
    initialOpen = false,
    isPrimary = false,
    colorVariant = "default"
}: AccordionSectionProps) => {
    const [open, setOpen] = useState(initialOpen);

    useEffect(() => {
        setOpen(initialOpen);
    }, [initialOpen]);

    const pathname = usePathname();
    const currentPages = useAppSelector((state) => state.pages.currentPages);

    const lang = useMemo(() => {
        const segments = pathname.split("/").filter(Boolean);
        if (segments[0] === "hi") return "hi";
        return "en";
    }, [pathname]);

    const getCurrentSection = useMemo(() => {
        if (!currentPages || !adminTitle) return;
        return currentPages.content?.find((page: any) => page?.adminTitle === adminTitle);
    }, [currentPages, adminTitle]);

    const section = propSection || getCurrentSection;
    const p = section?.props || {};

    const title = p.title?.[lang] || p.title?.en || p.title || propTitle || "";
    const isLast = p.isLast ?? propIsLast;

    const isTitleString = typeof title === "string";

    const isCategory = colorVariant === "category" || (isPrimary && colorVariant === "default");
    const isRating = colorVariant === "rating";

    return (
        <div
            className={`transition-all duration-300 ${
                isPrimary
                    ? isCategory
                        ? "bg-secondary/[0.04] dark:bg-secondary/[0.015] border-l-4 border-l-secondary"
                        : "bg-amber-500/[0.04] dark:bg-amber-500/[0.015] border-l-4 border-l-amber-500"
                    : ""
            } ${isLast ? "" : "border-b border-border/70"}`}
        >
            <button
                onClick={() => setOpen((o) => !o)}
                className={`w-full flex justify-between items-center transition-all duration-300 ${
                    isPrimary
                        ? isCategory
                            ? "pl-3 pr-4 py-4 hover:bg-secondary/[0.08]"
                            : "pl-3 pr-4 py-4 hover:bg-amber-500/[0.08]"
                        : "px-4 py-3.5 hover:bg-border/20"
                }`}
            >
                {isPrimary && isTitleString ? (
                    <span className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                            isCategory
                                ? "bg-secondary shadow-[0_0_8px_rgba(152,196,95,0.6)]"
                                : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                        }`} />
                        <span className="text-[11.5px] font-black uppercase tracking-[2px] text-foreground">
                            {title}
                        </span>
                    </span>
                ) : isTitleString ? (
                    <span className="text-[11px] font-black uppercase tracking-[2px] text-foreground/80">
                        {title}
                    </span>
                ) : (
                    title
                )}
                <ChevronRight
                    size={15}
                    className={`${
                        isPrimary && isRating ? "text-amber-500" : "text-secondary"
                    } transition-transform duration-300 ${open ? "rotate-90" : ""}`}
                />
            </button>

            <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open ? "800px" : "0px", opacity: open ? 1 : 0 }}
            >
                <div className={isPrimary ? "pl-[30px] pr-4 pb-4" : "px-4 pb-4"}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AccordionSection;
```

---

### TARGET 6: components/category/Pagination.tsx

```typescript
// ============================================================
// PAGINATION COMPONENT
// Renders responsive pagination controls with custom items-per-page selector.
// ============================================================

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
      {/* Items per page selector */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-black uppercase tracking-[1px] text-muted whitespace-nowrap">
          Show:
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="h-10 px-4 rounded-xl border border-border bg-surface font-bold text-sm outline-none focus:border-secondary cursor-pointer"
        >
          <option value={9}>9 per page</option>
          <option value={12}>12 per page</option>
          <option value={24}>24 per page</option>
          <option value={48}>48 per page</option>
        </select>
      </div>

      {/* Page numbers */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-10 w-10 flex items-center justify-center rounded-xl border border-border bg-surface font-bold text-sm hover:bg-secondary hover:text-white hover:border-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-foreground"
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="h-10 w-10 flex items-center justify-center text-muted font-bold"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`h-10 w-10 flex items-center justify-center rounded-xl border font-bold text-sm transition-all ${
                currentPage === page
                  ? "bg-secondary text-white border-secondary"
                  : "border-border bg-surface hover:bg-secondary hover:text-white hover:border-secondary"
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-10 w-10 flex items-center justify-center rounded-xl border border-border bg-surface font-bold text-sm hover:bg-secondary hover:text-white hover:border-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-foreground"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Page info */}
      <div className="text-[11px] font-black uppercase tracking-[1px] text-muted">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
```

---

### TARGET 7: lib/data/pages/shopPage.json

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
  "content": [
    {
      "id": "category-head-section",
      "type": "text",
      "adminTitle": "Category Page Head",
      "props": {
        "badge": {
          "en": "Collection",
          "hi": "संग्रह"
        },
        "heading": {
          "en": "Our Collection",
          "hi": "हमारा संग्रह"
        },
        "description": {
          "en": "Explore our entire range of design-led furniture and home essentials. Crafted with purpose, built for life.",
          "hi": "डिजाइन-आधारित फर्नीचर और घर की आवश्यक वस्तुओं की हमारी पूरी श्रृंखला का पता लगाएं। उद्देश्य के साथ तैयार, जीवन के लिए निर्मित।"
        }
      }
    }
  ]
}
```

---

## OUTPUT CHECKLIST

### CRITICAL RULES VERIFICATION

- [ ] **NO `.data.ts` files** - All configurations and structures are defined in dynamic models or json data files.
- [ ] **DATA FLOW: JSON → Redux → Component** - Shop components fetch sections dynamically from page state variables.
- [ ] **LOCALE PRESERVED IN LINKS** - Router path pushes preserve the active i18n locale context.
- [ ] **EDITABLE TEXT INTEGRATED** - Editable elements are correctly bound to `isEditable` and trigger page saves via Redux `updatePageThunk` when modified.
- [ ] **BLUEPRINT SYSTEM VARIABLES** - Border classes, text styles, backgrounds, and accents rely exclusively on Blueprint design tokens.
