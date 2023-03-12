import {useDispatch, useSelector, TypedUseSelectorHook} from 'react-redux'
import {RootState, AppDispatch} from "./store";

import { useEffect, useState, useRef, RefObject } from 'react';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function useOnScreen(ref: RefObject<HTMLElement>) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [isOnScreen, setIsOnScreen] = useState(false);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(([entry]) =>
            setIsOnScreen(entry.isIntersecting)
        );
    }, []);

    useEffect(() => {
        observerRef!.current!.observe(ref.current!);

        return () => {
            observerRef!.current!.disconnect();
        };
    }, [ref]);

    return isOnScreen;
}