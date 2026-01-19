CREATE TABLE "content_vectors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1024) NOT NULL,
	CONSTRAINT "content_vectors_content_id_unique" UNIQUE("content_id")
);
--> statement-breakpoint
CREATE INDEX "embedding_idx" ON "content_vectors" USING hnsw ("embedding" vector_cosine_ops);