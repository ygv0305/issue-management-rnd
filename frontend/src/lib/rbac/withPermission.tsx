// Node modules
import React from 'react';

// Context
import { useUser } from '../context/UserContext';

// RBAC
import { hasPermission } from './hasPermission';

const withPermission = <P extends object>(
  WrappedComponent: React.ComponentType<P & { disabled?: boolean }>,
  requiredPermission: string,
) => {
  return function WithPermissionComponent(props: P & { disabled?: boolean }) {
    const { user, loading } = useUser();

    if (loading) {
      return null;
    }

    const isAllowed = hasPermission(user, requiredPermission);
    const disabled = props.disabled || !isAllowed;

    return <WrappedComponent {...props} disabled={disabled} />;
  };
};

export default withPermission;
