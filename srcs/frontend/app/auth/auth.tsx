import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./style.css";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/");
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("https://localhost/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data?.msg || "Registration failed");
                setLoading(false);
                return;
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            navigate("/");
        } catch (e) {
            console.error(e);
            setError("Network error");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Register</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p style={{color: "red"}} className="error">{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : "Register"}
            </button>
        </form>
    );
}

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/");
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("https://localhost/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data?.msg || "Invalid credentials");
                setLoading(false);
                return;
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            navigate("/");
        } catch (e) {
            console.error(e);
            setError("Network error");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Login</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p style={{color: "red"}} className="error">{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : "Login"}
            </button>
        </form>
    );
}

export default function Auth() {
    const [type, setType] = useState<"signIn" | "signUp">("signIn");

    return (
        <div className="auth-container">
            {type === "signIn" ? <Login /> : <Register />}

            <p>
                {type === "signIn" ? "No account?" : "Already have an account?"}
                <button
                    onClick={() =>
                        setType(type === "signIn" ? "signUp" : "signIn")
                    }
                >
                    {type === "signIn" ? "Register" : "Login"}
                </button>
            </p>
        </div>
    );
}


