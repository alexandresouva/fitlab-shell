import { MfeUser } from '@fitlab/tooling';

export type { MfeContext, MfeTheme, MfeUser } from '@fitlab/tooling';

export interface AuthUser extends MfeUser {
  avatarUrl?: string;
}
