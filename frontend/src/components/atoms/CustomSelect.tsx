// MUI
import MuiSelect from '@mui/material/Select';
import type { SelectProps } from '@mui/material/Select';

/**
 * Custom Select wrapper that fixes the dropdown menu movement shift.
 *
 * The shift occurs because MUI's Select recalculates menu position on open.
 * This component disables scroll lock (which causes layout shifts) and removes
 * the transition animation that causes the visual "jump".
 */
export default function CustomSelect<Value>(props: SelectProps<Value>) {
  return (
    <MuiSelect<Value>
      {...props}
      MenuProps={{
        disableScrollLock: true,
        transitionDuration: 0,
        ...props.MenuProps,
      }}
    />
  );
}
