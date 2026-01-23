"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { User } from "../types/user";
import {
	login as loginApi,
	register as registerApi,
	logoutApi,
} from "../services/auth.api";
import http from "../services/http";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<User>;
	register: (
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		role: string,
	) => Promise<User>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const initializeAuth = async () => {
			if (typeof window !== "undefined") {
				const token = localStorage.getItem("token");
				if (token) {
					try {
						const res = await http.get("/auth/profile");
						setUser(res.data.user);
					} catch (error) {
						localStorage.removeItem("token");
					}
				}
			}
			setIsLoading(false);
		};
		initializeAuth();
	}, []);

	const login = async (email: string, password: string) => {
		try {
			const data = await loginApi(email, password);
			localStorage.setItem("token", data.token);
			setUser(data.user);
			return data.user;
		} catch (error) {
			throw error;
		}
	};

	const register = async (
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		role: string,
	) => {
		try {
			const data = await registerApi(
				firstName,
				lastName,
				email,
				password,
				role,
			);
			localStorage.setItem("token", data.token);
			setUser(data.user);
			return data.user;
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		logoutApi();
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated: !!user,
				login,
				register,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
