import { motion } from 'framer-motion';

type Props = {
    title: string,
    description: string,
    uppercase?: boolean
}

const Header = (props: Props) => {
    return (
        <div className="w-full flex justify-center mt-[100px]!">
            <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <div className="w-full max-w-[350px] not-sm:max-w-[200px] h-[1px] bg-[#4A4749]"></div>
                <motion.h1 
                    className={`text-[25px] sm:text-[44px] text-[#231F20] font-[700] font-times mt-[35px] sm:mt-[50px] ${props.uppercase ? "uppercase" : ""}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                >
                    {props.title}
                </motion.h1>
                <motion.h3 
                    className={`text-[11px] sm:text-[14px] font-[500] text-[#231F20] mt-[20px] sm:mt-[40px] font-sans ${props.uppercase ? "uppercase" : ""}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
                >
                    {props.description}
                </motion.h3>
            </motion.div>
        </div>
    )
}

export default Header;