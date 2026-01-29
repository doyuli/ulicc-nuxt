CREATE TABLE "content_summarys" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"post_id" varchar(191) NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_summarys_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "content_vectors" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"post_id" varchar(191) NOT NULL,
	"section_id" varchar(191) NOT NULL,
	"title" text NOT NULL,
	"heading" text,
	"content" text NOT NULL,
	"content_hash" varchar(32) NOT NULL,
	"embedding" vector(1024) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_vectors_section_id_unique" UNIQUE("section_id")
);
--> statement-breakpoint
CREATE INDEX "embedding_idx" ON "content_vectors" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "post_id_idx" ON "content_vectors" USING btree ("post_id");