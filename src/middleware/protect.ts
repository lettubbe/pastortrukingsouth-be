// import JWT from "jsonwebtoken";
// import { NextFunction, Request, Response } from "express";
// import ErrorResponse from "../messages/ErrorResponse";
// import config from "../config";
// import Admin from "../models/Auth/AdminUser";
// import jwt from "jsonwebtoken";


// export const protect = (req: any, res: Response, next: NextFunction) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return next(new ErrorResponse("No token provided", 401));
//   }

//   try {
//     const JWT_SECRET: any = config.auth.jwtSecret;
//     const decoded: any = jwt.verify(token, JWT_SECRET);

//     req.user = decoded;
//     next();
//   } catch (err: any) {
//     if (err.name === "TokenExpiredError") {
//       return next(new ErrorResponse("Token expired", 401));
//     }
//     if (err.name === "JsonWebTokenError") {
//       return next(new ErrorResponse("Invalid token", 401));
//     }
//     return next(new ErrorResponse("Unauthorized", 401));
//   }
// };

// export const adminProtectMiddleware = (allowedRoles: string[]) => {
//   return async (req: any, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return next(new ErrorResponse("Invalid Token", 401));
//     }

//     const token = authHeader.split(" ")[1];

//     try {
//       const decoded: any = JWT.verify(token, config.auth.jwtSecret as string);

//       req.user = decoded;

//       console.log("this ran", decoded);

//       // Check if role is allowed
//       if (!allowedRoles.includes(decoded.role)) {
//         return next(
//           new ErrorResponse("Not authorized to access this resource", 403)
//         );
//       }

//       const adminUser = await Admin.findById(decoded.id);

//       if (!adminUser?.isVerified) {
//         return next(
//           new ErrorResponse(
//             "Please verify your account first, Contact A Super Admin",
//             403
//           )
//         );
//       }

//       next();
//     } catch (error) {
//       return next(new ErrorResponse("Invalid or Expired Token", 401));
//     }
//   };
// };

// /**
//  * Middleware that protects routes accessible by admin, super-admin, and developer roles
//  *
//  * @example
//  * // In your route file:
//  * router.get('/admin-dashboard', adminProtect, (req, res) => {
//  *   // Only accessible by admin, super-admin, and developer roles
//  *   res.json({ message: 'Welcome to admin dashboard' });
//  * });
//  */
// export const adminProtect = adminProtectMiddleware([
//   "admin",
//   "super-admin",
//   "developer",
// ]);

// /**
//  * Middleware that protects routes accessible by super-admin and developer roles only
//  *
//  * @example
//  * // In your route file:
//  * router.post('/system-settings', superAdminProtect, (req, res) => {
//  *   // Only accessible by super-admin and developer roles
//  *   res.json({ message: 'System settings updated' });
//  * });
//  */
// export const superAdminProtect = adminProtectMiddleware([
//   "super-admin",
//   "developer",
// ]);

// /**
//  * Middleware that protects routes accessible by developer role only
//  *
//  * @example
//  * // In your route file:
//  * router.delete('/debug-logs', developerAdminProtect, (req, res) => {
//  *   // Only accessible by developer role
//  *   res.json({ message: 'Debug logs cleared' });
//  * });
//  */
// export const developerAdminProtect = adminProtectMiddleware(["developer"]);

// // Pre-configured middleware functions
// export const onlyAdmin = adminProtectMiddleware(["admin"]);
// export const onlySuperAdmin = adminProtectMiddleware(["super-admin"]);
// export const onlyDeveloper = adminProtectMiddleware(["developer"]);

// export const adminOrSuperAdmin = adminProtectMiddleware([
//   "admin",
//   "super-admin",
// ]);

// export const allAdmins = adminProtectMiddleware([
//   "admin",
//   "super-admin",
//   "developer",
// ]);
