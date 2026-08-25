'use client';

// Font Awesome + Next.js: disable the auto-injected CSS because we import
// the stylesheet ourselves in globals.css. Prevents giant icons on first paint.
import { config } from '@fortawesome/fontawesome-svg-core';

config.autoAddCss = false;

export { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
