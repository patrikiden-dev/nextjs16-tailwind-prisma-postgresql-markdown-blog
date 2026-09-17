CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

CREATE TABLE "User" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_name_idx" ON "User"("name");

CREATE TABLE "Category" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

CREATE TABLE "Tag" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

CREATE TABLE "Post" (
  "id" SERIAL NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "readTime" INTEGER NOT NULL,
  "imageId" TEXT NOT NULL,
  "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "authorId" INTEGER NOT NULL,
  "categoryId" INTEGER NOT NULL,
  CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");
CREATE INDEX "Post_categoryId_idx" ON "Post"("categoryId");
CREATE INDEX "Post_status_idx" ON "Post"("status");
CREATE INDEX "Post_publishedAt_idx" ON "Post"("publishedAt");
CREATE INDEX "Post_categoryId_status_idx" ON "Post"("categoryId", "status");

CREATE TABLE "PostTag" (
  "postId" INTEGER NOT NULL,
  "tagId" INTEGER NOT NULL,
  CONSTRAINT "PostTag_pkey" PRIMARY KEY ("postId", "tagId")
);
CREATE INDEX "PostTag_tagId_idx" ON "PostTag"("tagId");

CREATE TABLE "PostView" (
  "id" BIGSERIAL NOT NULL,
  "postId" INTEGER NOT NULL,
  "ipHash" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PostView_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PostView_postId_idx" ON "PostView"("postId");
CREATE INDEX "PostView_createdAt_idx" ON "PostView"("createdAt");
CREATE INDEX "PostView_postId_createdAt_idx" ON "PostView"("postId", "createdAt");

ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PostView" ADD CONSTRAINT "PostView_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
