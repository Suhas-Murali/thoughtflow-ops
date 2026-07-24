const prisma = require('../infrastructure/prismaClient');

async function getDashboardStats() {
  const totalFailures = await prisma.parsedFailure.count();

  const byCategory = await prisma.parsedFailure.groupBy({
    by: ['category'],
    _count: { category: true },
  });

  const bySeverity = await prisma.parsedFailure.groupBy({
    by: ['severity'],
    _count: { severity: true },
  });

  const totalFiles = await prisma.uploadedFile.count();

  return {
    totalFailures,
    totalFiles,
    byCategory: byCategory.map((c) => ({ category: c.category, count: c._count.category })),
    bySeverity: bySeverity.map((s) => ({ severity: s.severity, count: s._count.severity })),
  };
}

module.exports = { getDashboardStats };