import { authService } from '@ithalamed/web-core';

export async function checkAuth(): Promise<boolean> {
  if (!authService.hasStoredTokens()) {
    return false;
  }

  try {
    await authService.getCurrentUser();
    return true;
  } catch {
    return false;
  }
}

export { authService };
