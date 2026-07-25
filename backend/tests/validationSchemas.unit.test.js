const { registerSchema, loginSchema } = require('../src/domain/validationSchemas');

describe('registerSchema', () => {
  test('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'ValidPass123',
    });
    expect(result.success).toBe(true);
  });

  test('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      password: 'ValidPass123',
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path).toEqual(['email']);
  });

  test('rejects a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path).toEqual(['password']);
  });

  test('rejects an invalid role', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'ValidPass123',
      role: 'SUPERADMIN',
    });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  test('accepts valid login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'anything',
    });
    expect(result.success).toBe(true);
  });

  test('rejects missing password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com' });
    expect(result.success).toBe(false);
  });
});