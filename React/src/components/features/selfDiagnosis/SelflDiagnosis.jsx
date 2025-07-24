import { useState } from "react";
import TestModal from "./TestModal";
import { testList } from "./testData.js"


function SelfDiagnosis() {
    const [openType, setOpenType] = useState(null); // 'depression', 'anxiety', 'stress'

    const handleOpen = (type) => {setOpenType(type)
        // console.log('openType:', openType);
        // console.log('test:', testList.find(t => t.type === openType));
    };
    const handleClose = () => setOpenType(null);

    return (
        <div>
            {testList.map((test) => (
                <button key={test.type} onClick={() => handleOpen(test.type)}>
                    {test.label}
                </button>
            ))}

            {openType && (
                <TestModal
                    test={testList.find(t => t.type === openType)}
                    onClose={handleClose}
                />
            )}
        </div>
    );
}

export default SelfDiagnosis;