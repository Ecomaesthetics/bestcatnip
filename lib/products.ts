import { createServerClient } from './supabase';

export interface Product {
  id: string;
  asin: string;
  slug: string;
  title: string;
  price: number;
  image_url: string;
  amazon_url: string;
  features: string[];
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export const REVALIDATE = 3600;
export const PAGE_SIZE   = 24;

export interface PagedResult {
  products: Product[];
  total:    number;
  page:     number;
  pageSize: number;
  totalPages: number;
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`getAllProducts: ${error.message}`);
  return (data ?? []) as Product[];
}

export async function getProductsPaged(page: number, category?: string): Promise<PagedResult> {
  const supabase = createServerClient();
  const from = (page - 1) * PAGE_SIZE;
  const to   = from + PAGE_SIZE - 1;

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (category) query = query.eq('category', category);

  const { data, error, count } = await query;
  if (error) throw new Error(`getProductsPaged: ${error.message}`);

  const total      = count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return {
    products:   (data ?? []) as Product[],
    total,
    page,
    pageSize:   PAGE_SIZE,
    totalPages,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`getProductBySlug: ${error.message}`);
  }
  return data as Product;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`getProductsByCategory: ${error.message}`);
  return (data ?? []) as Product[];
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
