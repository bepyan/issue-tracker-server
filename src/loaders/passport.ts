import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GitHubStrategy } from "passport-github";
import { JWTService, UserService } from "../services";

export const loadPassport = () => {
  useJWT();
  useGithub();
  passport.initialize();
};

const JWT_SECRET = process.env.JWT_SECRET!;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

const useJWT = () => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // header의 bearer 해석
        secretOrKey: JWT_SECRET,
      },
      async (payload, done) => {
        const user = await UserService.getById(payload.id);

        return done(null, user ?? false);
      }
    )
  );
};

const useGithub = () => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL:
          "https://fe-w4-issue-tracker.herokuapp.com/api/auth/github/callback",
      },
      (
        _accessToken: any,
        _refreshToken: any,
        profile: any,
        done: (arg0: null, arg1: any) => void
      ) => {
        const user = {
          id: "github" + profile._json.id,
          name: profile._json.name,
        };

        done(null, user);
      }
    )
  );
};
