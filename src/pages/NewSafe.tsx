import { useState, useEffect } from "react";
import Header from "../layouts/Header";
import { dopLabels, Safe } from "../types/types";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../global/global";
import { PiSpinnerGapThin } from "react-icons/pi";

type Props = {
    edit: boolean;
};

const NewSafe = ({ edit }: Props) => {
    const [editPage, setEditPage] = useState<boolean>(edit);
    const [loading, setLoading] = useState<boolean>(true);
    const [bor, setBor] = useState<any>(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Safe>({
        id: 0,
        image: '',
        number: '',
        name: '',
        description: '',
        dop: {
            workshop: null,
            year: null,
            place: null,
            material: null,
            author: null,
            size: null,
            casting: null,
        }
    });

    const { id } = useParams<{ id: string }>();

    const getSafe = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}safe_getid.php?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (result.status === 'success') {
                setFormData({
                    id: parseFloat(id),
                    image: API_URL + "objects/" + result.data.image || '',
                    number: result.data.number || '',
                    name: result.data.name || '',
                    description: result.data.description || '',
                    dop: {
                        workshop: result.data.workshop,
                        year: result.data.year,
                        place: result.data.place,
                        material: result.data.material,
                        author: result.data.author,
                        size: result.data.size,
                        casting: result.data.casting,
                    }
                });
                setBor("true");
            } else {
                setBor('Не удалось получить объект');
            }
        } catch (error) {
            setBor('Ошибка при получение объекта');
        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            if (edit && id && id !== 'new') {
                setEditPage(true);
                getSafe(id);
            } else {
                setLoading(false);
            }
        }, 500);
    }, [edit, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name in formData.dop) {
            setFormData(prev => ({
                ...prev,
                dop: {
                    ...prev.dop,
                    [name]: value || null,
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setFormData({
                        ...formData,
                        image: event.target.result as string,
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (!formData.image || !formData.number || !formData.name) {
            alert("Поля 'Фото', 'Номер', 'Название' и 'Описание' обязательны для заполнения!");
            setLoading(false);
            return;
        }
        setTimeout(async () => {
            try {
                const response = await fetch(API_URL + 'safe_save.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();
                if (result.status === 'success') {
                    navigate("/admin");
                } else {
                    alert('Не удалось сохранить: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Что то пошло не так!');
            } finally {
                setLoading(false);
            }
        }, 500);
    };

    const delSafe = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}safe_delid.php?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (result.status === 'success') {
                navigate('/admin');
            } else {
                alert('Не удалось удалить объект');
            }
        } catch (error) {
            alert('Не удалось удалить объект');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const UploadPhoto = () => (
        <div
            style={formData.image ? {} : { borderColor: "#231f208b", borderStyle: "dashed", borderWidth: "3px" }}
            className="w-full relative aspect-square flex justify-center items-center"
        >
            {formData.image ? (
                <img
                    src={formData.image}
                    alt="Загруженное фото"
                    className="lg:w-full lg:h-full object-contain"
                />
            ) : (
                <div className="flex flex-col items-center justify-center ">
                    <span className="text-[#231f208b] font-bold font-times text-[20px]">Добавьте изображение</span>
                    <img className="w-[150px]" src="/upload.svg" alt="upload" />
                </div>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                }}
            />
        </div>
    );

    const Content = () => (
        <div className="w-full mt-[50px] flex justify-center mb-[150px]">
            <form onSubmit={handleSubmit} className="flex gap-[50px] w-[80%] md:w-[90%] max-w-[940px] relative">
                <div className="w-[60%] overflow-hidden not-md:hidden">
                    <UploadPhoto />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex flex-col">
                        <div className="flex flex-col sm:items-start items-center">
                            <input
                                type="number"
                                name="number"
                                className="custom-input-header font-times w-full font-bold not-sm:w-[200px]"
                                value={formData.number}
                                onChange={handleChange}
                                placeholder="№ Введите номер"
                                required
                            />
                            <div className="w-[200px] md:w-[390px] h-[1px] bg-[#4A4749]"></div>
                        </div>

                        <tbody className="w-full md:w-[85%] mt-[10px]">
                            {Object.entries(formData.dop).map(([key, value], index) => (
                                <tr key={key} className={`bg-[${index % 2 === 0 ? '#D8DADD' : '#cdccd2'}] w-[630px]`}>
                                    <td className="sm:py-2 not-sm:py-1 not-sm:text-[13px] pl-[20px] font-times capitalize w-[100%]">
                                        {dopLabels[key] || key}
                                    </td>
                                    <td className="sm:py-2 not-sm:py-1 not-sm:text-[13px] pr-[20px] font-times italic whitespace-nowrap">
                                        <input
                                            type={"text"}
                                            name={key}
                                            className="custom-input-table"
                                            value={value || ''}
                                            onChange={handleChange}
                                            placeholder={dopLabels[key] || ''}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <div className="w-full mt-[50px] mb-[30px] overflow-hidden md:hidden">
                            <UploadPhoto />
                        </div>
                        <div className="flex mt-[30px] flex-col sm:items-start items-center">
                            <input
                                type="text"
                                name="name"
                                className="custom-input-header font-times w-full font-bold not-sm:w-[200px]"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="#Введите название"
                                required
                            />
                            <div className="w-[200px] md:w-[390px] h-[1px] bg-[#4A4749]"></div>
                        </div>

                        <textarea
                            name="description"
                            rows={5}
                            className="px-[20px] py-[10px] bg-[#D8DADD] outline-none mt-[10px] font-times text-[16px]"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Описание"
                        />
                        <div className="flex max-w-[500px] gap-[10px] not-sm:gap-0 not-sm:flex-col">
                            <div className="flex items-center gap-[10px]">
                                <button
                                    className="custom-button-bgno text-black bg-[#d8dadd] not-sm:w-full mt-[20px] font-sans"
                                    onClick={() => { navigate('/admin') }}
                                    type="button"
                                >
                                    Назад
                                </button>
                                <button
                                    className="custom-button-bgno bg-red-900 text-white not-sm:w-full mt-[20px] font-sans"
                                    onClick={() => {
                                        setLoading(true);
                                        setTimeout(() => {
                                            delSafe();
                                        }, 500);
                                    }}
                                    type="button"
                                >
                                    Удалить
                                </button>
                            </div>
                            <button
                                className="custom-button not-sm:w-full mt-[20px] font-sans"
                                type="submit"
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )



    return (
        <div>
            <Header
                title="новое в коллекцию"
                description="Добавьте новый элемент в нашу базу"
                uppercase
            />
            {loading ? (
                <div className="w-full h-[300px] flex items-center justify-center">
                    <div className="animate-spin w-max">
                        <PiSpinnerGapThin size={100} />
                    </div>
                </div>
            ) : editPage ? (
                bor !== "true" ? (
                    <div className="w-full h-[300px] flex items-center justify-center">
                        <p className="text-[20px] font-times">Объект не найден</p>
                    </div>
                ) : (
                    <>
                        {Content()}
                    </>
                )
            ) : (
                <>
                    {Content()}
                </>
            )}
        </div>
    );
};

export default NewSafe;
