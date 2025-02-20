import {vi} from "vitest";

vi.mock('@src/components/iconify', () => {
  return {
    __esModule: true,
    default: (props: any) => (
      <div
        data-testid="iconify"
        data-icon={props.icon}
        data-sx={JSON.stringify(props.sx)}
      />
    ),
  };
});
