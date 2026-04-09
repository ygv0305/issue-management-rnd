// Node modules
import React from 'react';

// Context
import { useUser } from '../context/UserContext';

// RBAC
import { hasPermission } from './hasPermission';

/**
 * Higher-Order Component that renders the wrapped component only when the
 * authenticated user has the required permission. Returns null otherwise
 * (including while auth state is still loading).
 *
 * Use this for component-level guards inside a page.
 * For route-level guards use `ProtectedRoute` in the router instead.
 *
 * @example
 * const ActionsTab = withPermission(ActionsTabComponent, PERMISSIONS.VIEW_ALL_ISSUE);
 */
const withPermission = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission: string,
) => {
  return function WithPermissionComponent(props: P) {
    const { user, loading } = useUser();

    if (loading) {
      return null;
    }

    const isAllowed = hasPermission(user, requiredPermission);

    if (!isAllowed) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withPermission;
