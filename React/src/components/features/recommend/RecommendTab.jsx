import { IconMovie } from '@tabler/icons-react';
import { IconDeviceTvOld } from '@tabler/icons-react';
import { IconBook } from '@tabler/icons-react';
import { IconMusic } from '@tabler/icons-react';
import './css/MovieList.css'

export function RecommendTab(){

    return(
        <div className={"recommendTab"}>
            <button className={"tabButton"}>
                <IconMovie color="#FB79A2" />
            </button>
            <button>
                <IconDeviceTvOld color="#FFF" />
            </button>
            <button>
                <IconBook color="#FFF" />
            </button>
            <button>
                <IconMusic color="#FFF" />
            </button>
            {/*<Button variant="button4" icon={IconMovie} />*/}
            {/*<Button variant="button4" icon={IconDeviceTvOld} />*/}
            {/*<Button variant="button4" icon={IconBook} />*/}
            {/*<Button variant="button4" icon={IconMusic} />*/}
        </div>
    )
}