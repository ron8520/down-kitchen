import {useEffect} from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathName } = useLocation();

    /* When loading a new page, scroll the position to the top */
    useEffect(() => {
        window.scrollTo(0,0);
    }, [pathName])

    return null;
}