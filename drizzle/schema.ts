import { sql } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  }
});

export const postStatus = pgEnum("post_status", [
  "draft",
  "published",
  "archived"
]);

export const postLinkType = pgEnum("post_link_type", [
  "wikilink",
  "markdown",
  "tag"
]);

export const apiKeyStatus = pgEnum("api_key_status", [
  "active",
  "revoked"
]);

export const publishLogAction = pgEnum("publish_log_action", [
  "created",
  "updated",
  "published",
  "archived",
  "deleted"
]);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    markdownPath: text("markdown_path").notNull(),
    status: postStatus("status").notNull().default("draft"),
    series: text("series"),
    canonicalUrl: text("canonical_url"),
    ogImage: text("og_image"),
    readingTime: integer("reading_time"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    uniqueIndex("posts_slug_unique").on(table.slug),
    index("posts_status_idx").on(table.status),
    index("posts_series_idx").on(table.series),
    index("posts_published_at_idx").on(table.publishedAt),
    index("posts_updated_at_idx").on(table.updatedAt)
  ]
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    uniqueIndex("tags_slug_unique").on(table.slug),
    index("tags_name_idx").on(table.name)
  ]
);

export const postTags = pgTable(
  "post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.tagId] }),
    index("post_tags_post_id_idx").on(table.postId),
    index("post_tags_tag_id_idx").on(table.tagId)
  ]
);

export const postLinks = pgTable(
  "post_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourcePostId: uuid("source_post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    targetPostId: uuid("target_post_id").references(() => posts.id, {
      onDelete: "set null"
    }),
    targetSlug: text("target_slug").notNull(),
    linkType: postLinkType("link_type").notNull(),
    rawText: text("raw_text").notNull(),
    displayText: text("display_text"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    index("post_links_source_post_id_idx").on(table.sourcePostId),
    index("post_links_target_post_id_idx").on(table.targetPostId),
    index("post_links_target_slug_idx").on(table.targetSlug),
    index("post_links_link_type_idx").on(table.linkType)
  ]
);

export const postSearchIndex = pgTable(
  "post_search_index",
  {
    postId: uuid("post_id")
      .primaryKey()
      .references(() => posts.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    titleText: text("title_text").notNull(),
    bodyText: text("body_text").notNull(),
    tagText: text("tag_text").notNull().default(""),
    seriesText: text("series_text").notNull().default(""),
    searchText: text("search_text").notNull(),
    searchVector: tsvector("search_vector").notNull(),
    indexedAt: timestamp("indexed_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    uniqueIndex("post_search_index_slug_unique").on(table.slug),
    index("post_search_index_search_vector_idx").using(
      "gin",
      table.searchVector
    ),
    index("post_search_index_indexed_at_idx").on(table.indexedAt)
  ]
);

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    keyHash: text("key_hash").notNull(),
    status: apiKeyStatus("status").notNull().default("active"),
    hmacRequired: boolean("hmac_required").notNull().default(false),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    revokedAt: timestamp("revoked_at", { withTimezone: true })
  },
  (table) => [
    uniqueIndex("api_keys_key_hash_unique").on(table.keyHash),
    index("api_keys_status_idx").on(table.status)
  ]
);

export const publishLogs = pgTable(
  "publish_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id").references(() => posts.id, {
      onDelete: "set null"
    }),
    postSlug: text("post_slug").notNull(),
    action: publishLogAction("action").notNull(),
    actorKeyId: uuid("actor_key_id").references(() => apiKeys.id, {
      onDelete: "set null"
    }),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    index("publish_logs_post_id_idx").on(table.postId),
    index("publish_logs_post_slug_idx").on(table.postSlug),
    index("publish_logs_action_idx").on(table.action),
    index("publish_logs_created_at_idx").on(table.createdAt)
  ]
);
