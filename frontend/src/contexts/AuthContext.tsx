import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

const AUTH_STORAGE_KEY = 'careboard:auth-session';

export interface AuthUser {
  id: number;
  name: string;
  role: string;
  hospitalId?: number;
  bedId?: number;
  bedNumber?: string;
  admissionId?: number;
  patientName?: string | null;
}

interface AuthState {
  user: AuthUser | null;
}

type AuthAction =
  | { type: 'LOGIN'; payload: AuthUser }
  | { type: 'LOGOUT' };

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredSession(): AuthState {
  const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedSession) {
    return { user: null };
  }

  try {
    return { user: JSON.parse(storedSession) as AuthUser };
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { user: null };
  }
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, undefined, readStoredSession);

  const login = useCallback((user: AuthUser) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    localStorage.removeItem('careboard:patient-session');
    dispatch({ type: 'LOGIN', payload: user });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('careboard:patient-session');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.user),
      login,
      logout,
    }),
    [login, logout, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
