import { isEmail, emailDomain, emailLocalPart } from '../../field/email';

describe('field/email', () => {
  describe('isEmail', () => {
    it('validates correctly', () => {
      expect(isEmail('test@test.com')).toBe(true);
      expect(isEmail('test@test.com.br')).toBe(true);
      expect(isEmail('test@移动.移动')).toBe(true);
      expect(isEmail('test@test.com ')).toBe(true);
      expect(isEmail(' test@test.com')).toBe(true);
      expect(isEmail(1)).toBe(false);
      expect(isEmail('test@testcom')).toBe(false);
      expect(isEmail('test.test.com')).toBe(false);
      expect(isEmail('test..@test.com')).toBe(true);
      expect(isEmail('test..@test.com', false)).toBe(true);
      expect(isEmail('test..@test.com', true)).toBe(false);
    });
    it('returns false when there is a white space in the middle of the string', () => {
      expect(isEmail('test@test. com')).toBe(false);
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
  describe('emailLocalPart', () => {
    it('returns the local part for a normal email', () => {
      expect(emailLocalPart('alice@corp.com')).toBe('alice');
      expect(emailLocalPart('alice@sub.corp.com')).toBe('alice');
    });
    it('returns "" for addresses with no local part', () => {
      expect(emailLocalPart('@corp.com')).toBe('');
      expect(emailLocalPart('@a.b')).toBe('');
      expect(emailLocalPart('@CORP.COM')).toBe('');
      expect(emailLocalPart('@sub.corp.com')).toBe('');
    });
    it('is unicode-safe when the domain contains characters that expand on toLowerCase', () => {
      // İ (U+0130) lowercases to i + combining dot above (2 code units).
      // The old domain.length-based slice produced "alic" instead of "alice".
      expect(emailLocalPart('alice@İ.com')).toBe('alice');
    });
  });
});
