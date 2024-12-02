// import NextAuth from "next-auth";

// import credentials from "next-auth/providers/credentials"

// export const {handlers, signIn, signOut, auth} = NextAuth({
//     providers:[
//         credentials({
//             credentials:{
//                 email:{label:"Email", type:"email", placeholder:"Email"},
//                 password:{label:"password", type:"password", placeholder:"Password"},
//             },
//             async authorize(credentials){
//                 let user = null;
//                 // validate credentials

//                 // get user

//                 user = {
//                     id: '1',
//                     name: 'saheb singh',
//                     email:'sahebsingh@gmail.com' ,
//                     role : "admin"
//                 }
//                 if(!user){
//                     console.log("invalid Credentials");
//                     return null;
//                 }
//                 return user;

//             }
//         })
//     ],
//     callbacks: {
//         authorized({request:{nextUrl}, auth}) {
//             const isLoggedIn = !!auth?.user;

//             const {pathname } = nextUrl;
//             const role = auth?.user.role || 'user';

//             if(pathname.startsWith('/auth/signin') && isLoggedIn){
//                 return Response.redirect(new URL('/', nextUrl));
//             }

//             if(pathname.startsWith("/upload") && role !== "admin" ){
//                 return Response.redirect(new URL('/', nextUrl));
//             }
//             return !!auth;
//         },
//          jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id; // No need for "as string" in JavaScript
//                 token.role = user.role ;
//             }
//             return token;
//         },
//         session({session,token}){
//             session.user.id = token.id;
//             session.user.role = token.role;
//             return session;
//         }
        
//     },
//     pages: {
//         signIn:"/auth/signin"
//     }
// })