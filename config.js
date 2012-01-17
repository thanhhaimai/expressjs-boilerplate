var DEBUG = (process.env.NODE_ENV !== 'production');

module.exports = {
  /** MongoDB database uri .*/
  dburi: 'mongodb://test:test@staff.mongohq.com:10085/testing',
  /** Session secret .*/
  secret: 'I am a session secret. Please change me (and keep me a secret).',
  /** Default cookie lifetime is 1 day. */
  COOKIE_LIFETIME: 1000 * 60 * 60 * 24,
  /** Default fav icon lifetime is 30 days. */
  FAVICON_LIFETIME: 1000 * 60 * 60 * 24 * 30,
  /** Whether we're in development mode .*/
  DEBUG: DEBUG,
  /** Current node environment .*/
  env: (process.env.NODE_ENV || 'development'),
  /** Port to use .*/
  port: DEBUG ? 8086 : process.env.PORT || 80,
};
