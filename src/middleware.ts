/**
 * Authentication Middleware for NusantaraEdu
 * Protects routes and manages authentication state
 */

import { NextRequest, NextResponse } from 'next/server';
import { UserRoles } from './types/auth.types';

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
];

// Routes that require specific roles
const ROLE_BASED_ROUTES = {
  '/dashboard': [UserRoles.ADMIN, UserRoles.PRINCIPAL, UserRoles.TEACHER, UserRoles.SCHOOL_ADMIN_STAFF],
  '/admin': [UserRoles.ADMIN],
  '/principal': [UserRoles.PRINCIPAL],
} as const;

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/about',
  '/contact',
];

// API routes that should be excluded from middleware
const API_ROUTES = [
  '/api',
  '/_next',
  '/favicon.ico',
  '/images',
  '/icons',
];

/**
 * Check if route is protected
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route));
}

/**
 * Check if route should be excluded from middleware
 */
function shouldExcludeRoute(pathname: string): boolean {
  return API_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Parse JWT token (basic parsing without verification)
 */
function parseJWTToken(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = parseJWTToken(token);
    if (!payload || !payload.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
}

/**
 * Check if user has required role for route
 */
function hasRequiredRole(pathname: string, userRole: UserRoles): boolean {
  const requiredRoles = Object.entries(ROLE_BASED_ROUTES).find(([route]) => 
    pathname.startsWith(route)
  )?.[1] as UserRoles[] | undefined;
  
  if (!requiredRoles) return true; // No specific role required
  
  return requiredRoles.includes(userRole);
}

/**
 * Get authentication data from request
 */
function getAuthData(request: NextRequest) {
  // Try to get token from cookie or header
  const token = request.cookies.get('nusantara_edu_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  const userStr = request.cookies.get('nusantara_edu_user')?.value;
  
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  return { token, user };
}

/**
 * Create redirect response to login
 */
function redirectToLogin(request: NextRequest, reason?: string) {
  const loginUrl = new URL('/', request.url);
  
  // Add return URL as query parameter
  if (request.nextUrl.pathname !== '/') {
    loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname + request.nextUrl.search);
  }
  
  // Add error reason if provided
  if (reason) {
    loginUrl.searchParams.set('error', reason);
  }
  
  const response = NextResponse.redirect(loginUrl);
  
  // Clear auth cookies on redirect
  response.cookies.delete('nusantara_edu_token');
  response.cookies.delete('nusantara_edu_user');
  response.cookies.delete('nusantara_edu_school');
  
  return response;
}

/**
 * Create redirect response for unauthorized access
 */
function redirectUnauthorized(request: NextRequest) {
  const unauthorizedUrl = new URL('/unauthorized', request.url);
  return NextResponse.redirect(unauthorizedUrl);
}

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes and static files
  if (shouldExcludeRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Get authentication data
  const { token, user } = getAuthData(request);
  
  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    // Check if user is authenticated
    if (!token || !user) {
      return redirectToLogin(request, 'authentication_required');
    }
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      return redirectToLogin(request, 'token_expired');
    }
    
    // Check role-based access
    if (!hasRequiredRole(pathname, user.role)) {
      return redirectUnauthorized(request);
    }
    
    // Add user info to headers for the page
    const response = NextResponse.next();
    response.headers.set('x-user-id', user.id.toString());
    response.headers.set('x-user-role', user.role);
    response.headers.set('x-user-authenticated', 'true');
    
    return response;
  }
  
  // Handle public routes - redirect authenticated users away from login/register
  if ((pathname === '/' || pathname === '/login' || pathname === '/register') && token && user && !isTokenExpired(token)) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  // Allow access to public routes
  return NextResponse.next();
}

/**
 * Middleware configuration
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (image files)
     * - icons (icon files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)',
  ],
};