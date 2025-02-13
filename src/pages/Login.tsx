import { useState } from "react";
import Header from "../layouts/Header"
import { API_URL } from "../global/global";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "@heroui/react";



interface FormData {
    login: string;
    password: string;
}



const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        login: '',
        password: '',
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        e.preventDefault();
        if (formData.login && formData.password) {
            try {
                const response = await fetch(API_URL + 'login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                const data = await response.json();
                if (data.success) {
                    login({ login: formData.login, role: data.role });
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('Ошибка при авторизации');
            }
        } else {
            alert('Все поля обязательны для заполнения!');
        }

        setLoading(false)
    };

    return (
        <div>
            <Header
                title="Вход в систему"
                description="Введите логин и пароль"
                uppercase
            />

            <form onSubmit={handleSubmit} className="flex flex-col mt-[80px] items-center gap-[10px]">
                <div>
                    <input
                        type="text"
                        id="login"
                        name="login"
                        className="custom-input w-[300px] font-sans"
                        placeholder="Логин"
                        value={formData.login}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Пароль"
                        className="custom-input w-[300px] font-sans"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <Button
                    disabled={loading}
                    className="custom-button disabled:opacity-50 w-[300px] mt-[60px] font-sans"
                    type="submit">Войти</Button>

                <div className="w-[273px] sm:w-full max-w-[350px] mt-[40px] h-[1px] bg-[#4A4749]"></div>
            </form>



        </div>
    )
}

export default Login