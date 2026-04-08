// Node modules
import React from 'react';

// Context
import { useUser } from '../context/UserContext';

// RBAC
import { hasPermission } from './hasPermission';

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
