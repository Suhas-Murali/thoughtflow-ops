-- CreateIndex
CREATE INDEX "ParsedFailure_category_idx" ON "ParsedFailure"("category");

-- CreateIndex
CREATE INDEX "ParsedFailure_severity_idx" ON "ParsedFailure"("severity");

-- CreateIndex
CREATE INDEX "ParsedFailure_createdAt_idx" ON "ParsedFailure"("createdAt");
