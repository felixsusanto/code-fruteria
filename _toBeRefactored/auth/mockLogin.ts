export interface User {
    id: string;
    username: string;
    role: string;
}

export function mockLogin(username: string, password: string): Promise<User | null> {
    // Simulate async login
    return new Promise((resolve) => {
        setTimeout(() => {
            if (username === "admin" && password === "password") {
                resolve({
                    id: "1",
                    username: "admin",
                    role: "admin"
                });
            } else if (username === "user" && password === "password") {
                resolve({
                    id: "2",
                    username: "user",
                    role: "user"
                });
            } else {
                resolve(null);
            }
        }, 300);
    });
}
