-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar_url" TEXT;
