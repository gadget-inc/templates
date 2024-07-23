import OAuth2Strategy from "passport-oauth2";

/**
 * Instagram OAuth2 Strategy for passport
 * Forked from https://github.com/jaredhanson/passport-instagram
 */
export class InstagramStrategy extends OAuth2Strategy {
  name = "instagram";

  constructor(options, verify) {
    options ??= {};
    options.authorizationURL ??= "https://api.instagram.com/oauth/authorize/";
    options.tokenURL ??= "https://api.instagram.com/oauth/access_token";
    super(options, verify);
  }

  userProfile(accessToken, done) {
    done(null, { token: accessToken });
  }
}
