import Button from "@shared/styles/Button.jsx";
import { IconMovie } from '@tabler/icons-react';
import { IconDeviceTvOld } from '@tabler/icons-react';
import { IconBook } from '@tabler/icons-react';
import { IconMusic } from '@tabler/icons-react';
import "./css/MovieList.css"

export function RecommendTab(){
    return(
        <div className={"recommend-Tab"}>
            <Button variant="button4" icon={IconMovie} />
            <Button variant="button4" icon={IconDeviceTvOld} />
            <Button variant="button4" icon={IconBook} />
            <Button variant="button4" icon={IconMusic} />
        </div>
    )
}