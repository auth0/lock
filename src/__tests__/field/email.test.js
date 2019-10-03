import { isEmail, emailDomain } from '../../field/email';

describe('field/email', () => {
  describe('isEmail', () => {
    it('validates correctly', () => {
      expect(isEmail('test@test.com')).toBe(true);
      expect(isEmail('test@test.com.br')).toBe(true);
      expect(isEmail('test@移动.移动')).toBe(true);
      expect(isEmail(1)).toBe(false);
      expect(isEmail('test@testcom')).toBe(false);
      expect(isEmail('test.test.com')).toBe(false);
    });
    it('returns false when there is a white space', () => {
      expect(isEmail('test@test.com ')).toBe(false);
    });
  });
  describe('emailDomain', () => {
    it('extracts email domain correctly', () => {
      expect(emailDomain('test@test.com')).toBe('test.com');
      expect(emailDomain('test@test.com.br')).toBe('test.com.br');
      expect(emailDomain('test@移动.移动')).toBe('移动.移动');
      expect(emailDomain(1)).toBe('');
      expect(emailDomain('test@testcom')).toBe('');
      expect(emailDomain('test.test.com')).toBe('');
    });
  });
});
