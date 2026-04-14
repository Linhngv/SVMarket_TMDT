import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type User = {
    id: string;
    fullName: string;
    avatar?: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState<User | null>(null);

    const isLoggedIn = !!user;

    // lấy user từ API
    const refreshUser = async () => {
        if (!token) return;

        try {
            const res = await axios.get("http://localhost:8080/api/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(res.data);
        } catch (err) {
            console.error("Auth error:", err);
            logout();
        }
    };

    // login
    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    // logout
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    // mỗi khi token thay đổi → fetch user
    useEffect(() => {
        if (token) {
            refreshUser();
        } else {
            setUser(null);
        }
    }, [token]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoggedIn,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// hook dùng toàn app
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}