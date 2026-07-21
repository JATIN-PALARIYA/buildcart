"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    ShoppingBag,
    Check,
    HelpCircle,
    Package,
    RefreshCw,
    Loader2,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { QuantitySelector } from "@/components/store/QuantitySelector";
import { ProductCard } from "@/components/store/ProductCard";
import { getProductBySlug, getProducts } from "@/lib/api/product";
import { Product } from "@/lib/types/product";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
    const { slug } = use(params);
    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Gallery Active Image Index State
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    // Quantity State
    const [quantity, setQuantity] = useState(1);
    // Button Add State (for visual feedback)
    const [isAdded, setIsAdded] = useState(false);

    // Load product details and related products from API layer
    useEffect(() => {
        async function loadProductData() {
            setLoading(true);

            setActiveImageIndex(0);
            setQuantity(1);
            setIsAdded(false);
            try {
                // TODO: Product Details API
                const fetchedProduct = await getProductBySlug(slug);
                setProduct(fetchedProduct);

                if (fetchedProduct) {
                    // TODO: Fetch data from backend
                    const allProducts = await getProducts({
                        category: fetchedProduct.category.slug,
                    });
                    const related = allProducts
                        .filter((p) => p.id !== fetchedProduct.id && p.isActive)
                        .slice(0, 4);
                    setRelatedProducts(related);
                }
            } catch (error) {
                console.error("Failed to load product details:", error);
            } finally {
                setLoading(false);
            }
        }

        loadProductData();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center py-32">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                        Loading gear details...
                    </p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                    <HelpCircle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-foreground">
                        Gear Not Found
                    </h2>
                    <p className="text-xs text-muted-foreground leading-normal max-w-sm mx-auto">
                        The workspace hardware or audio peripheral you are
                        searching for is either discontinued, deactivated, or
                        doesn&apos;t exist in our catalog.
                    </p>
                </div>
                <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-5 py-3 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Catalog
                </Link>
            </div>
        );
    }

    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    const handleAddToCart = () => {
        if (!isOutOfStock) {
            addItem(product, quantity);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        }
    };

    return (
        <div className="max-w-6xl 2xl:max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-12 space-y-4 sm:space-y-6 grow flex flex-col w-full">
            {/* Back Button */}
            <div>
                <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
                >
                    <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
                    Back to catalog
                </Link>
            </div>

            {/* Main Grid: Gallery & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                {/* Column 1: Image Gallery */}
                <div className="space-y-4">
                    {/* Main Showcase Image */}
                    <div className="aspect-square bg-secondary/30 rounded-3xl overflow-hidden border border-border/50 relative shadow-sm">
                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                <span className="bg-background border border-border text-foreground text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                                    Sold Out
                                </span>
                            </div>
                        )}
                        <Image
                            src={
                                product.images[activeImageIndex] ||
                                product.image
                            }
                            alt={product.name}
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>

                    {/* Thumbnail list */}
                    {product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-3.5">
                            {product.images.map((imgUrl, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImageIndex(index)}
                                    onMouseEnter={() =>
                                        setActiveImageIndex(index)
                                    }
                                    className={`aspect-square rounded-xl overflow-hidden border bg-secondary/20 transition-all cursor-pointer relative ${
                                        activeImageIndex === index
                                            ? "border-foreground ring-2 ring-foreground/10"
                                            : "border-border/60 hover:border-border"
                                    }`}
                                    aria-label={`View image ${index + 1}`}
                                >
                                    <Image
                                        src={imgUrl}
                                        alt={`${product.name} thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Column 2: Product Specifications */}
                <div className="space-y-6">
                    {/* Header metadata */}
                    <div className="space-y-2">
                        <span className="text-[10px] tracking-wider text-muted-foreground uppercase font-bold">
                            {product.category.name}
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            {product.name}
                        </h1>
                        <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
                            $
                            {product.price.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                            })}
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border/40" />

                    {/* Details & Stock Status */}
                    <div className="space-y-4">
                        {/* Visual Stock Badge */}
                        <div className="flex items-center gap-2">
                            <span
                                className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                                    isOutOfStock
                                        ? "bg-rose-500 animate-pulse"
                                        : isLowStock
                                          ? "bg-amber-500 animate-pulse"
                                          : "bg-emerald-500"
                                }`}
                            />
                            <span className="text-xs font-semibold text-foreground">
                                {isOutOfStock ? (
                                    <span className="text-rose-500">
                                        Currently out of stock
                                    </span>
                                ) : isLowStock ? (
                                    <span className="text-amber-500">
                                        Only {product.stock} items left in stock
                                    </span>
                                ) : (
                                    <span className="text-emerald-600 dark:text-emerald-500">
                                        In stock, ready to dispatch
                                    </span>
                                )}
                            </span>
                        </div>

                        {/* Description Copy */}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Add-to-cart interface */}
                    {!isOutOfStock && (
                        <div className="space-y-4 pt-4 border-t border-border/40">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                                    Select Quantity
                                </span>
                                <QuantitySelector
                                    quantity={quantity}
                                    max={product.stock}
                                    onChange={(val) => setQuantity(val)}
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={handleAddToCart}
                                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold shadow-md transition-all duration-300 cursor-pointer ${
                                        isAdded
                                            ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600 scale-[0.98]"
                                            : "bg-foreground hover:bg-foreground/95 text-background"
                                    }`}
                                    aria-label="Add to cart"
                                >
                                    {isAdded ? (
                                        <>
                                            <Check className="h-4.5 w-4.5" />
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="h-4.5 w-4.5" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Benefits/Return Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border/40 text-[10px] text-muted-foreground font-medium">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                            <span>Free shipping & secure packing box</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                            <span>30-Day satisfaction return window</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Related Products */}
            {relatedProducts.length > 0 && (
                <section className="space-y-6 pt-10 border-t border-border/30">
                    <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                            Recommendations
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                            Related Studio Gear
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
