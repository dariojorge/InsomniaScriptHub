import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Dropdown } from "../utils/dropdown/dropdown";
import { firstElement, getElementByType, readFileDataList } from "../utils/Utils";
const os = require('os');
const homeDir = os.homedir();

const settingsFilename: string = 'settings.json';
const scriptHubBasePathName: string = `${homeDir}/Documents/Confi/ScriptsHub/`;
let scriptTypePathName = "";
let scriptTypeData: DataList;
let operationsData: DataList;


const ArgList = (props: { argList: any[] }) => {
    const [scriptType, setScriptType] = useState("");
    const [operation, setOperation] = useState("");

    useEffect(() => {
        scriptTypeData = readFileDataList(scriptHubBasePathName, settingsFilename);
        const scriptTypeInit = firstElement(scriptTypeData.types).name;
        setScriptType(scriptTypeInit);
        setOperationData(scriptTypeInit);
    }, [])


    const handleOnClick = async () => {
        console.log(scriptType);

        /* const options: ExecSyncOptionsWithStringEncoding = {
             shell: "C:\\Program Files\\Git\\bin\\bash.exe",
             encoding: "utf8"
         };*/

        //const executeCmd = "scriptHub.sh scriptType=runners type=update projects=sf-display-service env=local";
        //const path = "cd ~ && cd Documents/Confi/ScriptsHub"

        //execSync(`cd ~ && cd ${scriptHubPathName} && ./scriptHub.sh scriptType=runners type=update projects=sf-display-service env=local`, options);

        /*exec(`${path} && ${executeCmd}`, options, (err: any, stdout: any, stderr: any) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`The stdout Buffer from shell: ${stdout.toString()}`);
                console.log(`The stderr Buffer from shell: ${stderr.toString()}`);
            }
        });*/
    };


    const updateScriptType = (event: { target: any; }) => {
        setScriptType(event.target.value);
        setOperationData(event.target.value);
    }

    const updateOperation = (event: { target: any; }) => {
        setOperation(event.target.value);

        const operationDataType = getElementByType(operationsData.types, event.target.value);
        const operationPath = `${scriptTypePathName}${operationDataType.basePath}`;
        const settingsData = readFileDataList(operationPath, settingsFilename);
        console.log(getElementByType(settingsData.types, event.target.value));
    }

    const setOperationData = (scriptTypeInit: string) => {
        const scriptTypeDataType = getElementByType(scriptTypeData.types, scriptTypeInit);
        const scriptTypePath = `${scriptHubBasePathName}scripts${scriptTypeDataType.basePath}`;
        operationsData = readFileDataList(scriptTypePath, settingsFilename);
        scriptTypePathName = scriptTypePath;

        const operationDataType = getElementByType(operationsData.types, firstElement(operationsData.types).type);
        const operationPath = `${scriptTypePath}${operationDataType.basePath}`;
        const settingsData = readFileDataList(operationPath, settingsFilename);
        console.log(getElementByType(settingsData.types, firstElement(operationsData.types).type));
    }

    return (
        <>
            { props.argList.map(element => {
                <Dropdown dataValue={scriptType} dataList={scriptTypeData} isDisabled={false} updateSelected={updateScriptType}></Dropdown>
             })
            }
        </>
    );
}

const RenderPanelArgs = (elemCustom: any) => {
    const elementRoot = createRoot(elemCustom);
    elementRoot.render((<ArgList />))
};

export default RenderPanelArgs;