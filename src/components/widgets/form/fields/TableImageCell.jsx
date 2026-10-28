import { download } from "@/axios/DataService";
import { useEffect, useState } from "react";

export default function TableImageCell ({value}) {
    const [imageSrc, setImageSrc] = useState(null)

    useEffect(() => {
        //console.log('---------------------------- !!!!!!!!!!!!!!!!!! '+value)
        dowloadFile(value)
    }, [value])

    const dowloadFile = async(value) => {
        if (!value) {
            setImageSrc(null)
            return
        }

        let objectUrl = await download(value)
        setImageSrc(objectUrl)
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }  

    if (!imageSrc) return <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />;

    return (
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
          <img src={imageSrc} alt="Miniature" className="w-full h-full object-cover" />
        </div>
    );
}