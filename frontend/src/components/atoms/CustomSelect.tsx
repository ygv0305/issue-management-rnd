// MUI
import MuiSelect from '@mui/material/Select';
import type { SelectProps } from '@mui/material/Select';

/**
 * Custom Select wrapper that fixes the dropdown menu movement shift.
 *
 * The shift occurs because MUI's Select recalculates menu position on open.
 * This component disables scroll lock to prevent layout shifts.
 * (Global transitions are disabled via theme, so transitionDuration is no longer needed here.)
 */
export default function CustomSelect<Value>(props: SelectProps<Value>) {
  return (
    <MuiSelect<Value>
      {...props}
      MenuProps={{
        disableScrollLock: true,
        ...props.MenuProps,
      }}
    />
  );
}
