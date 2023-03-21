export enum Exception {
  USER_CREDENTIAL_INVALID = 'USER_CREDENTIAL_INVALID',
  USER_EMAIL_EXISTS = 'USER_EMAIL_EXISTS',
  USER_IS_LOCK = 'USER_IS_LOCK',

  USER_EMAIL_EMPTY = 'USER_EMAIL_EMPTY',
  USER_EMAIL_FORMAT = 'USER_EMAIL_FORMAT',
  USER_EMAIL_MAX_LENGTH = 'USER_EMAIL_MAX_LENGTH',
  USER_PASSWORD_EMPTY = 'USER_PASSWORD_EMPTY',
  USER_PASSWORD_BLANK = 'USER_PASSWORD_BLANK',
  USER_NAME_EMPTY = 'USER_NAME_EMPTY',
  USER_NAME_BLANK = 'USER_NAME_BLANK',
  USER_NAME_MAX_LENGTH = 'USER_NAME_MAX_LENGTH',
  USER_LAST_LOGIN_DATE_FORMAT = 'USER_LAST_LOGIN_DATE_FORMA',
  USER_IS_LOCK_FORMAT = 'USER_IS_LOCK_FORMA',
  USER_REFRESH_TOKEN_EMPTY = 'USER_REFRESH_TOKEN_EMPTY',
  USER_REFRESH_TOKEN_BLANK = 'USER_REFRESH_TOKEN_BLANK',

  ACCESS_TOKEN_INVALID = 'ACCESS_TOKEN_INVALID',
  ACCESS_TOKEN_EXPIRATION = 'ACCESS_TOKEN_EXPIRATION',
  REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',
  REFRESH_TOKEN_EXPIRATION = 'REFRESH_TOKEN_EXPIRATION',
}
