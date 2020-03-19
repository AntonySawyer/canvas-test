    import { IShape } from './interfaces';
    import { setListeners } from "./utils";
    import { setSizes, buildToolbar } from "./canvasUtils";


    export const spaceMap: IShape[] = [];
    
    window.onload = () => {
        setSizes();
        setListeners();
        buildToolbar();
    }
