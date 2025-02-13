import { useEffect, useState } from "react";
import Header from "../layouts/Header";
import { SafeInArray } from "../types/types";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../global/global";
import { useAuth } from "../providers/AuthProvider";
import { GrLogout } from "react-icons/gr";
import { PiSpinnerGapThin } from "react-icons/pi";

const Admin = () => {
    const [inpSearch, setInpSearch] = useState<string>("");
    const [safes, setSafes] = useState<SafeInArray[] | [] | null>(null);
    const [currentBlock, setCurrentBlock] = useState<number>(1);
    const [totalBlocks, setTotalBlocks] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const { logout } = useAuth()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setCurrentBlock(1)
        setInpSearch(value);
    };

    const getSafes = async (block: number) => {

        try {
            const response = await fetch(`${API_URL}safe_get.php?block=${block}${inpSearch?.trim() !== '' ? `&search=${inpSearch}` : ""}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (result.status === 'success') {
                setSafes(result.data);
                setTotalBlocks(Math.ceil(result.total / 6));
            } else {
                setSafes([]);
                setTotalBlocks(0)
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            getSafes(currentBlock);
        }, 500);
    }, [currentBlock, inpSearch]);

    const handleNext = () => {
        if (currentBlock < totalBlocks) {
            setCurrentBlock(currentBlock + 1);
        }
    };

    const handlePrev = () => {
        if (currentBlock > 1) {
            setCurrentBlock(currentBlock - 1);
        }
    };




    return (
        <div>

            <button
                onClick={() => logout()}
                className="cursor-pointer absolute top-[20px] right-[20px] w-[40px] flex items-center justify-center h-[40px] "
            >
                <GrLogout size={25} className="rotate-[180deg] text-black" />
            </button>



            <Header
                title="Найдите объект"
                description="Быстрый поиск по номеру"
                uppercase
            />

            <div className="flex flex-col mt-[80px] items-center gap-[10px]">
                <div>
                    <input
                        type="text"
                        className="custom-input w-[300px] font-sans"
                        placeholder="Введите номер"
                        value={inpSearch}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="w-[310px] sm:w-full max-w-[350px] h-[1px] bg-[#4A4749]"></div>
            </div>

            <div className="w-full mt-[50px] flex justify-center mb-[150px]">
                <div className="flex flex-col w-[80%] md:w-[90%] max-w-[940px] relative">
                    <div className="w-full flex justify-between items-center">

                        <div className="flex gap-[10px] items-center">


                            <p className="font-times text-[20px]">{currentBlock} из {totalBlocks}</p>

                        </div>
                        <div className="flex gap-[20px]">
                            <button
                                onClick={handlePrev}
                                disabled={currentBlock === 1 || loading}
                                className="custom-icon w-[40px] flex items-center justify-center h-[40px] disabled:opacity-50"
                            >
                                <img src="/vector.svg" className="w-[20px]" />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentBlock === totalBlocks || loading}
                                className="custom-icon w-[40px] flex items-center justify-center h-[40px] disabled:opacity-50"
                            >
                                <img src="/vector.svg" className="w-[20px] rotate-[180deg]" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-[20px]">
                        {loading ? (
                            <>
                                <div className="grid grid-cols-3 not-md:grid-cols-2 gap-[20px]">
                                    {Array.from({ length: 6 }).map((_, index: number) => (
                                        <div key={index}
                                            className="aspect-square w-full cursor-pointer overflow-hidden flex not-lg:p-[10px] p-[20px] not-lg:gap-[10px] flex-col justify-center items-center gap-[20px] bg-[#D9D9D9]">
                                            <div className="animate-spin w-max">
                                                <PiSpinnerGapThin size={50} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : safes && safes.length > 0 ? (
                            <>
                                <div className="grid grid-cols-3 not-md:grid-cols-2 gap-[20px]">
                                    {safes.map((safe: SafeInArray) => (
                                        <div key={safe.id}
                                            onClick={() => navigate('/admin/safe/' + safe.id)}
                                            className="aspect-square cursor-pointer overflow-hidden flex not-lg:p-[10px] p-[20px] not-lg:gap-[10px] flex-col gap-[20px] bg-[#D9D9D9]">
                                            <p className="font-times not-lg:text-[16px] text-[25px] text-center">№{safe.number}</p>
                                            <div className="w-full h-full flex items-center justify-center">
                                                <img className="lg:w-[260px] lg:h-[200px] sm:w-[195px] sm:h-[150px] w-[130px] h-[80px] object-contain" src={API_URL + "objects/" + safe.image} alt="Safe" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full mt-[20px] flex justify-center">
                                    <button onClick={() => navigate('/admin/safe/new/')} className="custom-button w-[300px] font-sans">ДОБАВИТЬ ОБЪЕКТ</button>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-[200px] flex-col gap-[20px] flex justify-center items-center">
                                <p className="text-[20px]">Объектов пока нет</p>
                                <button onClick={() => navigate('/admin/safe/new/')} className="custom-button w-[300px] font-sans">ДОБАВИТЬ ОБЪЕКТ</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;