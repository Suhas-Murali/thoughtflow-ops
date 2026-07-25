const prisma = require('../infrastructure/prismaClient');

async function getFailures({ search, category, severity, sortBy, sortOrder }) {
  const where = {};

  if (category) {
    where.category = category;
  }
  if (severity) {
    where.severity = severity;
  }
  if (search) {
    where.OR = [
      { testId: { contains: search, mode: 'insensitive' } },
      { testName: { contains: search, mode: 'insensitive' } },
      { cleanSummary: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy = {};
  const validSortFields = ['createdAt', 'severity', 'category', 'testId'];
  orderBy[validSortFields.includes(sortBy) ? sortBy : 'createdAt'] = sortOrder === 'asc' ? 'asc' : 'desc';

  const failures = await prisma.parsedFailure.findMany({
    where,
    orderBy,
    take: 200, // safety cap, avoid returning unbounded huge lists
  });

  return failures;
}

module.exports = { getFailures };