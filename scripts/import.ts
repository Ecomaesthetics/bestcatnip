#!/usr/bin/env tsx
/**
 * CSV → Supabase importer
 * Usage: npx tsx scripts/import.ts [path/to/products.csv]
 *
 * Reads a CSV and upserts rows into the `products` table on the `asin` key.
 * Safe to re-run: existing rows are updated, new rows are inserted.
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';

// ── env ────────────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your environment.\n' +
    'Copy .env.example → .env.local and fill in your Supabase credentials.'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ── types ──────────────────────────────────────────────────────────────────────
interface CsvRow {
  asin: string;
  title: string;
  category: string;
  price: string;
  image_url: string;
  amazon_url: string;
  features: string;
  description: string;
  slug: string;
}

interface ProductRow {
  asin: string;
  slug: string;
  title: string;
  price: number;
  image_url: string;
  amazon_url: string;
  features: string[];
  description: string;
  category: string;
}

// ── slug helpers ───────────────────────────────────────────────────────────────
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function dedupeSlug(base: string, seen: Set<string>): string {
  let slug = base;
  let n = 2;
  while (seen.has(slug)) {
    slug = `${base}-${n++}`;
  }
  seen.add(slug);
  return slug;
}

// ── main ───────────────────────────────────────────────────────────────────────
async function main() {
  const csvPath = process.argv[2] ?? path.join(process.cwd(), 'data', 'products.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`ERROR: CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(csvPath, 'utf-8');
  const rows: CsvRow[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`\nParsed ${rows.length} row(s) from ${csvPath}\n`);

  const slugsSeen = new Set<string>();
  const valid: ProductRow[] = [];
  const skipped: Array<{ row: number; asin: string; reason: string }> = [];

  rows.forEach((row, i) => {
    const rowNum = i + 2; // 1-based + header

    // Required field validation
    const missing: string[] = [];
    if (!row.asin?.trim())       missing.push('asin');
    if (!row.title?.trim())      missing.push('title');
    if (!row.category?.trim())   missing.push('category');
    if (!row.price?.trim())      missing.push('price');
    if (!row.image_url?.trim())  missing.push('image_url');
    if (!row.amazon_url?.trim()) missing.push('amazon_url');

    if (missing.length > 0) {
      skipped.push({ row: rowNum, asin: row.asin || '(blank)', reason: `Missing required field(s): ${missing.join(', ')}` });
      return;
    }

    const price = parseFloat(row.price);
    if (isNaN(price) || price < 0) {
      skipped.push({ row: rowNum, asin: row.asin, reason: `Invalid price: "${row.price}"` });
      return;
    }

    const slugBase = row.slug?.trim() ? row.slug.trim() : toSlug(row.title);
    const slug = dedupeSlug(slugBase, slugsSeen);

    valid.push({
      asin:        row.asin.trim(),
      slug,
      title:       row.title.trim(),
      price,
      image_url:   row.image_url.trim(),
      amazon_url:  row.amazon_url.trim(),
      features:    row.features ? row.features.split('|').map(f => f.trim()).filter(Boolean) : [],
      description: row.description?.trim() ?? '',
      category:    row.category.trim(),
    });
  });

  // ── upsert in batches of 50 ──────────────────────────────────────────────────
  const BATCH = 50;
  let inserted = 0;
  let updated = 0;

  for (let i = 0; i < valid.length; i += BATCH) {
    const batch = valid.slice(i, i + BATCH);
    const { data, error } = await supabase
      .from('products')
      .upsert(batch, { onConflict: 'asin', ignoreDuplicates: false })
      .select('asin, created_at, updated_at');

    if (error) {
      console.error('Supabase error during upsert:', error.message);
      process.exit(1);
    }

    // Distinguish inserts vs updates by comparing created_at ≈ updated_at
    for (const r of data ?? []) {
      const createdMs  = new Date(r.created_at).getTime();
      const updatedMs  = new Date(r.updated_at).getTime();
      if (Math.abs(updatedMs - createdMs) < 2000) {
        inserted++;
      } else {
        updated++;
      }
    }
  }

  // ── report ───────────────────────────────────────────────────────────────────
  console.log('─'.repeat(50));
  console.log(`  Inserted : ${inserted}`);
  console.log(`  Updated  : ${updated}`);
  console.log(`  Skipped  : ${skipped.length}`);
  console.log('─'.repeat(50));

  if (skipped.length > 0) {
    console.log('\nSkipped rows:');
    for (const s of skipped) {
      console.log(`  Row ${s.row} (asin: ${s.asin}) — ${s.reason}`);
    }
  }

  console.log('\nDone.\n');
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
