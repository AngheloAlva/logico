-- AddForeignKey
ALTER TABLE "incident" ADD CONSTRAINT "incident_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
