CREATE TABLE "content_summarys" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"content_id" varchar(191) NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_summarys_content_id_unique" UNIQUE("content_id")
);
--> statement-breakpoint
CREATE TABLE "content_vectors" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"content_id" varchar(191) NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1024) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_vectors_content_id_unique" UNIQUE("content_id")
);
--> statement-breakpoint
CREATE INDEX "embedding_idx" ON "content_vectors" USING hnsw ("embedding" vector_cosine_ops);