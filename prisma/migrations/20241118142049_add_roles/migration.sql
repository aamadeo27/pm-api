-- CreateEnum
CREATE TYPE "AppRole" AS ENUM ('admin', 'project_manager', 'team_member');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "AppRole" NOT NULL DEFAULT 'team_member';
