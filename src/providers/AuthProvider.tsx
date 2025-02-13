import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface User {
    login: string;
    role: "user" | "admin";
}

interface AuthContextType {
    user: User | null;
    login: (data: User) => void;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(atob(storedUser)) : null;
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log(user);
        if (user) {
            if (user.role === "user" && (location.pathname === "/" || location.pathname === '/login')) {
                navigate("/user");
            } else if (user.role === "admin" && location.pathname === "/" || location.pathname === '/login') {
                navigate("/admin");
            }
            localStorage.setItem("user", btoa(JSON.stringify(user)));
        } else if (location.pathname !== "/login") {
            navigate("/login");
        }
    }, [user, navigate, location]);

    const login = (data: User) => {
        setUser(data);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isAdmin = user?.role === "admin";

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
