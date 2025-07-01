/**
 * Route Guard Component for NusantaraEdu
 * Client-side route protection and role-based access control
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from './AuthContext';
import { UserRoles } from '../types/auth.types';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRoles[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * Loading component
 */
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

/**
 * Unauthorized access component
 */
const UnauthorizedAccess = ({ redirectTo }: { redirectTo?: string }) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
          
          {redirectTo && (
            <button
              onClick={() => router.push(redirectTo)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Route Guard Component
 */
export function RouteGuard({ 
  children, 
  requiredRoles, 
  redirectTo = '/dashboard',
  fallback 
}: RouteGuardProps) {
  const { isAuthenticated, isLoading, user, checkAuth } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const performAuthCheck = async () => {
      setIsChecking(true);
      
      // If still loading auth state, wait
      if (isLoading) {
        return;
      }

      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        const returnUrl = encodeURIComponent(pathname);
        router.replace(`/?returnUrl=${returnUrl}`);
        return;
      }

      // Check role-based access
      if (requiredRoles && user) {
        const hasRequiredRole = requiredRoles.includes(user.role);
        
        if (!hasRequiredRole) {
          setIsChecking(false);
          return; // Will show unauthorized component
        }
      }

      setIsChecking(false);
    };

    performAuthCheck();
  }, [isAuthenticated, isLoading, user, requiredRoles, pathname, router]);

  // Show loading while checking authentication
  if (isLoading || isChecking) {
    return fallback || <LoadingSpinner />;
  }

  // Show unauthorized if not authenticated (shouldn't reach here due to middleware)
  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  // Show unauthorized if user doesn't have required role
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <UnauthorizedAccess redirectTo={redirectTo} />;
  }

  // Render children if all checks pass
  return <>{children}</>;
}

/**
 * HOC version of RouteGuard
 */
export function withRouteGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requiredRoles?: UserRoles[];
    redirectTo?: string;
    fallback?: React.ReactNode;
  } = {}
) {
  return function GuardedComponent(props: P) {
    return (
      <RouteGuard {...options}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}

/**
 * Role-based conditional rendering
 */
interface RoleBasedProps {
  children: React.ReactNode;
  allowedRoles: UserRoles[];
  fallback?: React.ReactNode;
  user?: any;
}

export function RoleBased({ children, allowedRoles, fallback = null, user }: RoleBasedProps) {
  const { user: contextUser } = useAuthContext();
  const currentUser = user || contextUser;

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook for role-based logic
 */
export function useRoleAccess() {
  const { user } = useAuthContext();

  const hasRole = (role: UserRoles): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRoles[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const isAdmin = (): boolean => hasRole(UserRoles.ADMIN);
  const isPrincipal = (): boolean => hasRole(UserRoles.PRINCIPAL);
  const isTeacher = (): boolean => hasRole(UserRoles.TEACHER);
  const isSchoolStaff = (): boolean => hasRole(UserRoles.SCHOOL_ADMIN_STAFF);

  return {
    user,
    hasRole,
    hasAnyRole,
    isAdmin,
    isPrincipal,
    isTeacher,
    isSchoolStaff,
  };
}

export default RouteGuard;