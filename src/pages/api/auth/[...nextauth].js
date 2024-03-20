import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GithubProvider  from "next-auth/providers/github";

const options = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  database: process.env.NEXT_PUBLIC_DATABASE_URL,
  session: {
    jwt: true,
  },
  callbacks: {
    session: async (session, user) => {
      session.jwt = user.jwt;
      session.id = user.id;
      console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++');
      console.log(session)
      return Promise.resolve(session);
    },
    jwt: async (token, user, account) => {
      console.log('///////////////////////////////////////////////////')
      console.log(user);
      const isSignIn = user ? true : false;
      if (isSignIn) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/${account.provider}/callback?access_token=${account?.accessToken}`
        );
        const data = await response.json();
        console.log('******************************************************');
        console.log(data)
        token.jwt = data.jwt;
        token.id = data.user.id;
      }
      console.log('---------------------------------------------------');
      console.log(token)
      return Promise.resolve(token);
    },
  },
};

const Auth = (req, res) =>
  NextAuth(req, res, options);

export default Auth;