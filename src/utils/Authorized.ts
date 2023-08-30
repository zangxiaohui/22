import RenderAuthorize from '../components/Authorized';
import { getAuthority } from './authority';

let Authorized = RenderAuthorize(getAuthority());

// Reload the rights component
const reloadAuthorized = (): void => {
  Authorized = RenderAuthorize(getAuthority());
};

/**
 * hard code
 * block need it。
 */

const win: any = window;
win.reloadAuthorized = reloadAuthorized;

export { reloadAuthorized };
export default Authorized;
