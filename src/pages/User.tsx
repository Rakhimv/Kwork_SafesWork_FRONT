import { useCallback, useEffect, useState } from "react";
import Header from "../layouts/Header"
import { dopLabels, Safe } from "../types/types";
import { GrLogout } from "react-icons/gr";
import { useAuth } from "../providers/AuthProvider";
import { API_URL } from "../global/global";
import { PiSpinnerGapThin } from "react-icons/pi";





const User = () => {
    const [safeNum, setSafeNum] = useState<string>('');
    const [safe, setSafe] = useState<Safe | null>(null)
    const [loading, setLoading] = useState<boolean>(true);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSafeNum(value);
    };
    const { logout } = useAuth()





    const getSafe = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}safe_getnum.php?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (result.status === 'success') {
                setSafe({
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
                })
            } else {
                setSafe(null)

            }
        } catch (error) {
            setSafe(null)
            setLoading(false);
        } finally {
            setLoading(false);

        }
    }, []);



    useEffect(() => {
        setLoading(true)
        if (safeNum.trim() !== '') {
            setTimeout(() => {
                getSafe(safeNum)
            }, 500);
        } else {
            setSafe(null)
            setLoading(false)
        }
    }, [safeNum])

    function removeDotFromLastThree(str: string | null) {
        if (!str) return '';
        const lastThree = str.slice(-3);
        if (lastThree.includes('.')) {
            const clearedLastThree = lastThree.replace(/\./g, '');
            return str.slice(0, -3) + clearedLastThree;
        }
        return str;
    }


    return (
        <div >

            <button
                onClick={() => logout()}
                className="cursor-pointer absolute top-[20px] right-[20px] w-[40px] flex items-center justify-center h-[40px] "
            >
                <GrLogout size={25} className="rotate-[180deg] text-black" />
            </button>



            <Header
                title="Забытое прошлое"
                description="Вы точно этого не знали"
                uppercase
            />

            <div className="flex flex-col mt-[80px] items-center gap-[10px]">
                <div>
                    <input
                        type="text"
                        className="custom-input w-[300px] font-sans"
                        placeholder="Введите номер"
                        value={safeNum}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="w-[310px] sm:w-full max-w-[350px] h-[1px] bg-[#4A4749]"></div>
            </div>



            {loading ?

                <div className="w-full h-[300px] flex items-center justify-center">
                    <div className="animate-spin w-max">
                        <PiSpinnerGapThin size={100} />
                    </div>
                </div>

                :

                safe ?
                    <div className="w-full mt-[50px] flex justify-center mb-[150px]">
                        <div className="flex justify-between w-[80%] md:w-[90%] max-w-[1080px] relative">
                            <div className="flex flex-col not-md:items-center not-md:gap-[50px] w-full">


                                <img className="w-[100%] max-w-[300px] mt-[20px] md:hidden" src={safe.image} />


                                <div className="flex flex-col  w-full">

                                    <div className="flex flex-col md:items-start items-center">
                                        <p className="font-times  text-[20px] md:text-[28px] text-center md:text-left font-[700] md:ml-[20px] mb-[5px]">№{safe.number} {removeDotFromLastThree(safe.name)}</p>
                                        <div className="w-[200px] md:w-[390px] h-[1px] bg-[#4A4749]"></div>
                                    </div>

                                    {safe.description && safe.description.length !== 1 && safe.description.trim() !== '' &&
                                        <div className="bg-[#D8DADD] w-[100%] not-md:w-[110%] not-md:ml-[-5%] md:w-[55%] font-times mt-[10px] px-[20px] py-[8px]">
                                            <p className="md:max-w-[90%] not-md:text-[13px] ">{safe.description}</p>
                                        </div>
                                    }
                                </div>


                                <div className={(safe.description && safe.description.length !== 1 && (safe.description.trim() !== '')) ? "flex flex-col w-full md:mt-[80px]" : "flex flex-col w-full md:mt-[0px]"} >
                                    {safe.description && safe.description.length !== 1 && safe.description.trim() !== '' &&
                                        <div className="flex flex-col md:items-start items-center">
                                            {/* <p className="font-times text-[20px] md:text-[28px] text-center md:text-left font-[700] md:ml-[20px] mb-[5px]">№{safe.number}</p> */}
                                            <div className="w-[200px] md:w-[390px] h-[1px] bg-[#4A4749]"></div>
                                        </div>
                                    }

                                    <tbody className="w-full md:max-w-[530px] mediaa mt-[10px]">
                                        {Object.values(safe.dop).every((value) => value === null)
                                            ? Object.keys(dopLabels)
                                                .slice(0, 4)
                                                .map((key, index) => (
                                                    <tr key={key} className={`${index % 2 === 0 ? 'bg-[#D8DADD]' : 'bg-[#cdccd2]'} w-[630px]`}>
                                                        <td className="sm:py-2 not-sm:py-1 not-sm:text-[13px] pl-[20px] font-times capitalize w-[100%]">
                                                            {dopLabels[key as keyof typeof dopLabels] || key}
                                                        </td>
                                                        <td className="sm:py-2 not-sm:py-1 not-sm:text-[13px] pr-[20px] font-times italic whitespace-nowrap">- - -</td>
                                                    </tr>
                                                ))
                                            : Object.entries(safe.dop)
                                                .filter(([_, value]) => value !== null)
                                                .map(([key, value], index) => (
                                                    <tr key={key} className={`${index % 2 === 0 ? 'bg-[#D8DADD]' : 'bg-[#cdccd2]'} w-[630px]`}>
                                                        <td className="sm:py-2 not-sm:py-1 not-sm:text-[13px] pl-[20px] font-times capitalize w-[100%]">
                                                            {dopLabels[key as keyof typeof dopLabels] || key}
                                                        </td>
                                                        <td className="sm:py-2 not-sm:py-1 not-sm:text-[13px] pr-[20px] font-times italic whitespace-nowrap">{value}</td>
                                                    </tr>
                                                ))}
                                    </tbody>
                                </div>

                            </div>


                            <img className="
                             pb-[50px] absolute w-[40%] max-h-[400px]
                            top-[80px] 
                             object-contain
                             right-0 not-md:hidden" src={safe.image} />
                        </div>
                    </div >
                    :

                    safeNum.trim() !== '' &&
                    <div className="w-full mt-[50px] flex justify-center mb-[150px]">
                        <div className="flex justify-center items-center w-[80%] md:w-[90%] max-w-[1080px] relative">
                            <p>Объект с таким номером не найден</p>
                        </div>
                    </div>


            }





        </div >
    )
}

export default User